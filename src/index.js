"use strict";
exports.__esModule = true;
exports.SortableItem = void 0;
var tslib_1 = require("tslib");
var array_move_1 = tslib_1.__importDefault(require("array-move"));
var react_1 = tslib_1.__importDefault(require("react"));
var helpers_1 = require("./helpers");
var hooks_1 = require("./hooks");
var SortableListContext = react_1["default"].createContext(undefined);
var SortableList = function (_a) {
    var children = _a.children, onSortStart = _a.onSortStart, onSortEnd = _a.onSortEnd, draggedItemClassName = _a.draggedItemClassName, rest = tslib_1.__rest(_a, ["children", "onSortStart", "onSortEnd", "draggedItemClassName"]);
    // this array contains the elements than can be sorted (wrapped inside SortableItem)
    var itemsRef = react_1["default"].useRef([]);
    // this array contains the coordinates of each sortable element (only computed on dragStart and used in dragMove for perf reason)
    var itemsRect = react_1["default"].useRef([]);
    // contains the container element
    var containerRef = react_1["default"].useRef(null);
    // contains the target element (copy of the source element)
    var targetRef = react_1["default"].useRef(null);
    // contains the index in the itemsRef array of the element being dragged
    var sourceIndexRef = react_1["default"].useRef(undefined);
    // contains the index in the itemsRef of the element to be exchanged with the source item
    var lastTargetIndexRef = react_1["default"].useRef(undefined);
    react_1["default"].useEffect(function () {
        return function () {
            // cleanup the target element from the DOM when SortableList in unmounted
            if (targetRef.current) {
                document.body.removeChild(targetRef.current);
            }
        };
    }, []);
    var updateTargetPosition = function (position) {
        if (targetRef.current) {
            // we use `translate3d` to force using the GPU if available
            targetRef.current.style.transform = "translate(-50%, -50%) translate3d(" + position.x + "px, " + position.y + "px, 0px)";
        }
    };
    var copyItem = react_1["default"].useCallback(function (sourceIndex) {
        if (!containerRef.current) {
            return;
        }
        var source = itemsRef.current[sourceIndex];
        var sourceRect = itemsRect.current[sourceIndex];
        var copy = source.cloneNode(true);
        // added the "dragged" class name
        if (draggedItemClassName) {
            draggedItemClassName.split(' ').forEach(function (c) { return copy.classList.add(c); });
        }
        // we ensure the copy has the same size than the source element
        copy.style.width = sourceRect.width + "px";
        copy.style.height = sourceRect.height + "px";
        // we place the target starting position at the top-left of the container
        // it will then be moved relatively using `transform: translate3d()`
        var containerBounds = containerRef.current.getBoundingClientRect();
        copy.style.position = 'fixed';
        copy.style.top = containerBounds.top + "px";
        copy.style.left = containerBounds.left + "px";
        document.body.appendChild(copy);
        targetRef.current = copy;
    }, [draggedItemClassName]);
    var listeners = hooks_1.useDrag({
        containerRef: containerRef,
        onStart: function (_a) {
            var point = _a.point, pointInWindow = _a.pointInWindow;
            if (!containerRef.current) {
                return;
            }
            itemsRect.current = itemsRef.current.map(function (item) { return item.getBoundingClientRect(); });
            var sourceIndex = helpers_1.findItemIndexAtPosition(pointInWindow, itemsRect.current);
            // if we are not starting the drag gesture on a SortableItem, we exit early
            if (sourceIndex === -1) {
                return;
            }
            // saving the index of the item being dragged
            sourceIndexRef.current = sourceIndex;
            // the item being dragged is copied to the document body and will be used as the target
            copyItem(sourceIndex);
            updateTargetPosition(point);
            // hide source during the drag gesture
            var source = itemsRef.current[sourceIndex];
            source.style.opacity = '0';
            source.style.visibility = 'hidden';
            // Adds a nice little physical feedback
            if (window.navigator.vibrate) {
                window.navigator.vibrate(100);
            }
            if (onSortStart) {
                onSortStart();
            }
        },
        onMove: function (_a) {
            var point = _a.point, pointInWindow = _a.pointInWindow;
            updateTargetPosition(point);
            var sourceIndex = sourceIndexRef.current;
            // if there is no source, we exit early (happened when drag gesture was started outside a SortableItem)
            if (sourceIndex === undefined) {
                return;
            }
            var targetIndex = helpers_1.findItemIndexAtPosition(pointInWindow, itemsRect.current, {
                fallbackToClosest: true
            });
            // if not target detected, we don't need to update other items' position
            if (targetIndex === -1) {
                return;
            }
            // we keep track of the last target index (to be passed to the onSortEnd callback)
            lastTargetIndexRef.current = targetIndex;
            var isMovingRight = sourceIndex < targetIndex;
            // in this loop, we go over each sortable item and see if we need to update their position
            for (var index = 0; index < itemsRef.current.length; index += 1) {
                var currentItem = itemsRef.current[index];
                var currentItemRect = itemsRect.current[index];
                // if current index is between sourceIndex and targetIndex, we need to translate them
                if ((isMovingRight && index >= sourceIndex && index <= targetIndex) ||
                    (!isMovingRight && index >= targetIndex && index <= sourceIndex)) {
                    // we need to move the item to the previous or next item position
                    var nextItemRects = itemsRect.current[isMovingRight ? index - 1 : index + 1];
                    if (nextItemRects) {
                        var translateX = nextItemRects.left - currentItemRect.left;
                        var translateY = nextItemRects.top - currentItemRect.top;
                        // we use `translate3d` to force using the GPU if available
                        currentItem.style.transform = "translate3d(" + translateX + "px, " + translateY + "px, 0px)";
                    }
                }
                // otherwise, the item should be at its original position
                else {
                    currentItem.style.transform = 'translate3d(0,0,0)';
                }
                // we want the translation to be animated
                currentItem.style.transitionDuration = '300ms';
            }
        },
        onEnd: function () {
            // we reset all items translations (the parent is expected to sort the items in the onSortEnd callback)
            for (var index = 0; index < itemsRef.current.length; index += 1) {
                var currentItem = itemsRef.current[index];
                currentItem.style.transform = '';
                currentItem.style.transitionDuration = '';
            }
            var sourceIndex = sourceIndexRef.current;
            if (sourceIndex !== undefined) {
                // show the source item again
                var source = itemsRef.current[sourceIndex];
                if (source) {
                    source.style.opacity = '1';
                    source.style.visibility = '';
                }
                var targetIndex = lastTargetIndexRef.current;
                if (targetIndex !== undefined) {
                    // sort our internal items array
                    itemsRef.current = array_move_1["default"](itemsRef.current, sourceIndex, targetIndex);
                    // let the parent know
                    onSortEnd(sourceIndex, targetIndex);
                }
            }
            sourceIndexRef.current = undefined;
            lastTargetIndexRef.current = undefined;
            // cleanup the target element from the DOM
            if (targetRef.current) {
                document.body.removeChild(targetRef.current);
                targetRef.current = null;
            }
        }
    });
    var registerItem = react_1["default"].useCallback(function (item) {
        itemsRef.current.push(item);
    }, []);
    var removeItem = react_1["default"].useCallback(function (item) {
        var index = itemsRef.current.indexOf(item);
        if (index !== -1) {
            itemsRef.current.splice(index, 1);
        }
    }, []);
    // we need to memoize the context to avoid re-rendering every children of the context provider
    // when not needed
    var context = react_1["default"].useMemo(function () { return ({ registerItem: registerItem, removeItem: removeItem }); }, [registerItem, removeItem]);
    return (react_1["default"].createElement("div", tslib_1.__assign({}, listeners, rest, { ref: containerRef }),
        react_1["default"].createElement(SortableListContext.Provider, { value: context }, children)));
};
exports["default"] = SortableList;
/**
 * SortableItem only adds a ref to its children so that we can register it to the main Sortable
 */
var SortableItem = function (_a) {
    var children = _a.children;
    var context = react_1["default"].useContext(SortableListContext);
    if (!context) {
        throw new Error('SortableItem must be a child of SortableList');
    }
    var registerItem = context.registerItem, removeItem = context.removeItem;
    var elementRef = react_1["default"].useRef(null);
    react_1["default"].useEffect(function () {
        var currentItem = elementRef.current;
        if (currentItem) {
            registerItem(currentItem);
        }
        return function () {
            if (currentItem) {
                removeItem(currentItem);
            }
        };
        // if the children changes, we want to re-register the DOM node
    }, [registerItem, removeItem, children]);
    return react_1["default"].cloneElement(children, { ref: elementRef });
};
exports.SortableItem = SortableItem;
//# sourceMappingURL=index.js.map
"use strict";
exports.__esModule = true;
exports.useDrag = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var getMousePoint = function (e) { return ({
    x: Number(e.clientX),
    y: Number(e.clientY)
}); };
var getTouchPoint = function (touch) { return ({
    x: Number(touch.clientX),
    y: Number(touch.clientY)
}); };
var getPointInContainer = function (point, containerTopLeft) {
    return {
        x: point.x - containerTopLeft.x,
        y: point.y - containerTopLeft.y
    };
};
var preventDefault = function (event) {
    event.preventDefault();
};
var disableContextMenu = function () {
    window.addEventListener('contextmenu', preventDefault, { capture: true, passive: false });
};
var enableContextMenu = function () {
    window.removeEventListener('contextmenu', preventDefault);
};
var useDrag = function (_a) {
    var onStart = _a.onStart, onMove = _a.onMove, onEnd = _a.onEnd, containerRef = _a.containerRef;
    // contains the top-left coordinates of the container in the window. Set on drag start and used in drag move
    var containerPositionRef = react_1["default"].useRef({ x: 0, y: 0 });
    // on touch devices, we only start the drag gesture after pressing the item 200ms.
    // this ref contains the timer id to be able to cancel it
    var handleTouchStartTimerRef = react_1["default"].useRef(undefined);
    // on non-touch device, we don't call onStart on mouse down but on the first mouse move
    // we do this to let the user clicks on clickable element inside the container
    // this means that the drag gesture actually starts on the fist move
    var isFirstMoveRef = react_1["default"].useRef(false);
    // see https://twitter.com/ValentinHervieu/status/1324407814970920968
    // we do this so that the parent doesn't have to use `useCallback()` for these callbacks
    var callbacksRef = react_1["default"].useRef({ onStart: onStart, onMove: onMove, onEnd: onEnd });
    // instead of relying on hacks to know if the device is a touch device or not,
    // we track this using an onTouchStart listener on the document. (see https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685)
    var _b = react_1["default"].useState(false), isTouchDevice = _b[0], setTouchDevice = _b[1];
    react_1["default"].useEffect(function () {
        callbacksRef.current = { onStart: onStart, onMove: onMove, onEnd: onEnd };
    }, [onStart, onMove, onEnd]);
    var cancelTouchStart = function () {
        if (handleTouchStartTimerRef.current) {
            window.clearTimeout(handleTouchStartTimerRef.current);
        }
    };
    var saveContainerPosition = react_1["default"].useCallback(function () {
        if (containerRef.current) {
            var bounds = containerRef.current.getBoundingClientRect();
            containerPositionRef.current = { x: bounds.left, y: bounds.top };
        }
    }, [containerRef]);
    var onDrag = react_1["default"].useCallback(function (pointInWindow) {
        var point = getPointInContainer(pointInWindow, containerPositionRef.current);
        if (callbacksRef.current.onMove) {
            callbacksRef.current.onMove({ pointInWindow: pointInWindow, point: point });
        }
    }, []);
    var onMouseMove = react_1["default"].useCallback(function (e) {
        // if this is the first move, we trigger the onStart logic
        if (isFirstMoveRef.current) {
            isFirstMoveRef.current = false;
            var pointInWindow = getMousePoint(e);
            var point = getPointInContainer(pointInWindow, containerPositionRef.current);
            if (callbacksRef.current.onStart) {
                callbacksRef.current.onStart({ point: point, pointInWindow: pointInWindow });
            }
        }
        // otherwise, we do the normal move logic
        else {
            onDrag(getMousePoint(e));
        }
    }, [onDrag]);
    var onTouchMove = react_1["default"].useCallback(function (e) {
        if (e.cancelable) {
            // Prevent the whole page from scrolling
            e.preventDefault();
            onDrag(getTouchPoint(e.touches[0]));
        }
        else {
            // if the event is not cancelable, it means the browser is currently scrolling
            // which cannot be interrupted. Thus we cancel the drag gesture.
            document.removeEventListener('touchmove', onTouchMove);
            if (callbacksRef.current.onEnd) {
                callbacksRef.current.onEnd();
            }
        }
    }, [onDrag]);
    var onMouseUp = react_1["default"].useCallback(function () {
        isFirstMoveRef.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (callbacksRef.current.onEnd) {
            callbacksRef.current.onEnd();
        }
    }, [onMouseMove]);
    var onTouchEnd = react_1["default"].useCallback(function () {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        enableContextMenu();
        if (callbacksRef.current.onEnd) {
            callbacksRef.current.onEnd();
        }
    }, [onTouchMove]);
    var onMouseDown = react_1["default"].useCallback(function (e) {
        if (e.button !== 0) {
            // we don't want to handle clicks other than left ones
            return;
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        saveContainerPosition();
        // mark the next move as being the first one
        isFirstMoveRef.current = true;
    }, [onMouseMove, onMouseUp, saveContainerPosition]);
    var handleTouchStart = react_1["default"].useCallback(function (point, pointInWindow) {
        document.addEventListener('touchmove', onTouchMove, { capture: false, passive: false });
        document.addEventListener('touchend', onTouchEnd);
        disableContextMenu();
        if (callbacksRef.current.onStart) {
            callbacksRef.current.onStart({ point: point, pointInWindow: pointInWindow });
        }
    }, [onTouchEnd, onTouchMove]);
    var onTouchStart = react_1["default"].useCallback(function (e) {
        saveContainerPosition();
        var pointInWindow = getTouchPoint(e.touches[0]);
        var point = getPointInContainer(pointInWindow, containerPositionRef.current);
        // we wait 120ms to start the gesture to be sure that the user
        // is not trying to scroll the page
        handleTouchStartTimerRef.current = window.setTimeout(function () { return handleTouchStart(point, pointInWindow); }, 120);
    }, [handleTouchStart, saveContainerPosition]);
    var detectTouchDevice = react_1["default"].useCallback(function () {
        setTouchDevice(true);
        document.removeEventListener('touchstart', detectTouchDevice);
    }, []);
    // if the user is scrolling on mobile, we cancel the drag gesture
    var touchScrollListener = react_1["default"].useCallback(function () {
        cancelTouchStart();
    }, []);
    react_1["default"].useLayoutEffect(function () {
        if (isTouchDevice) {
            var container_1 = containerRef.current;
            container_1 === null || container_1 === void 0 ? void 0 : container_1.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
            // we are adding this touchmove listener to cancel drag if user is scrolling
            // however, it's also important to have a touchmove listener always set
            // with non-capture and non-passive option to prevent an issue on Safari
            // with e.preventDefault (https://github.com/atlassian/react-beautiful-dnd/issues/1374)
            document.addEventListener('touchmove', touchScrollListener, {
                capture: false,
                passive: false
            });
            document.addEventListener('touchend', touchScrollListener, {
                capture: false,
                passive: false
            });
            return function () {
                container_1 === null || container_1 === void 0 ? void 0 : container_1.removeEventListener('touchstart', onTouchStart);
                document.removeEventListener('touchmove', touchScrollListener);
                document.removeEventListener('touchend', touchScrollListener);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                enableContextMenu();
                cancelTouchStart();
            };
        }
        // if non-touch device
        document.addEventListener('touchstart', detectTouchDevice);
        return function () {
            document.removeEventListener('touchstart', detectTouchDevice);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        isTouchDevice,
        detectTouchDevice,
        onMouseMove,
        onTouchMove,
        touchScrollListener,
        onTouchEnd,
        onMouseUp,
        containerRef,
        onTouchStart,
    ]);
    // on touch devices, we cannot attach the onTouchStart directly via React:
    // Touch handlers must be added with {passive: false} to be cancelable.
    // https://developers.google.com/web/updates/2017/01/scrolling-intervention
    return isTouchDevice ? {} : { onMouseDown: onMouseDown };
};
exports.useDrag = useDrag;
//# sourceMappingURL=hooks.js.map
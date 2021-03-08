"use strict";
exports.__esModule = true;
exports.findItemIndexAtPosition = void 0;
/**
 * This function check if a given point is inside of the items rect.
 * If it's not inside any rect, it will return the index of the closest rect
 */
var findItemIndexAtPosition = function (_a, itemsRect, _b) {
    var x = _a.x, y = _a.y;
    var _c = _b === void 0 ? {} : _b, _d = _c.fallbackToClosest, fallbackToClosest = _d === void 0 ? false : _d;
    var smallestDistance = 10000;
    var smallestDistanceIndex = -1;
    for (var index = 0; index < itemsRect.length; index += 1) {
        var rect = itemsRect[index];
        // if it's inside the rect, we return the current index directly
        if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
            return index;
        }
        if (fallbackToClosest) {
            // otherwise we compute the distance and update the smallest distance index if needed
            var itemCenterX = (rect.left + rect.right) / 2;
            var itemCenterY = (rect.top + rect.bottom) / 2;
            var distance = Math.sqrt(Math.pow(x - itemCenterX, 2) + Math.pow(y - itemCenterY, 2)); // ** 2 operator is not supported on IE11
            if (distance < smallestDistance) {
                smallestDistance = distance;
                smallestDistanceIndex = index;
            }
        }
    }
    return smallestDistanceIndex;
};
exports.findItemIndexAtPosition = findItemIndexAtPosition;
//# sourceMappingURL=helpers.js.map
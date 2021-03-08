"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var helpers = tslib_1.__importStar(require("./helpers"));
var getRect = function (_a) {
    var left = _a.left, top = _a.top, width = _a.width, height = _a.height;
    return ({
        top: top,
        left: left,
        width: width,
        height: height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: function () { return ''; }
    });
};
describe('SortableList helpers', function () {
    describe('findItemIndexAtPosition', function () {
        it('should return 0 if point is in the first item', function () {
            var point = { x: 20, y: 20 };
            var rects = [
                getRect({ left: 10, top: 10, width: 100, height: 100 }),
                getRect({ left: 120, top: 10, width: 100, height: 100 }),
                getRect({ left: 230, top: 10, width: 100, height: 100 }),
            ];
            var index = helpers.findItemIndexAtPosition(point, rects);
            expect(index).toEqual(0);
        });
        it('should return 2 if point is in the last item', function () {
            var point = { x: 300, y: 50 };
            var rects = [
                getRect({ left: 10, top: 10, width: 100, height: 100 }),
                getRect({ left: 120, top: 10, width: 100, height: 100 }),
                getRect({ left: 230, top: 10, width: 100, height: 100 }),
            ];
            var index = helpers.findItemIndexAtPosition(point, rects);
            expect(index).toEqual(2);
        });
        it('should return the right index if point is inside an item positioned in a grid', function () {
            var point = { x: 100, y: 200 };
            var rects = [
                getRect({ left: 10, top: 10, width: 100, height: 100 }),
                getRect({ left: 120, top: 10, width: 100, height: 100 }),
                getRect({ left: 10, top: 120, width: 100, height: 100 }),
                getRect({ left: 120, top: 120, width: 100, height: 100 }),
            ];
            var index = helpers.findItemIndexAtPosition(point, rects);
            expect(index).toEqual(2);
        });
        it('should return -1 if point is not inside any items and fallbackToClosest is false', function () {
            var point = { x: 150, y: -20 };
            var rects = [
                getRect({ left: 10, top: 10, width: 100, height: 100 }),
                getRect({ left: 120, top: 10, width: 100, height: 100 }),
                getRect({ left: 230, top: 10, width: 100, height: 100 }),
            ];
            var index = helpers.findItemIndexAtPosition(point, rects, { fallbackToClosest: false });
            expect(index).toEqual(-1);
        });
        it('should the closest index if point is not inside any items and fallbackToClosest is true', function () {
            var point = { x: 150, y: -20 };
            var rects = [
                getRect({ left: 10, top: 10, width: 100, height: 100 }),
                getRect({ left: 120, top: 10, width: 100, height: 100 }),
                getRect({ left: 230, top: 10, width: 100, height: 100 }),
            ];
            var index = helpers.findItemIndexAtPosition(point, rects, { fallbackToClosest: true });
            expect(index).toEqual(1);
        });
    });
});
//# sourceMappingURL=helpers.test.js.map
"use strict";
exports.__esModule = true;
exports.generateItems = void 0;
var generateItems = function (count) {
    var items = [];
    for (var i = 0; i < count; i++) {
        items.push(String.fromCharCode(65 + i));
    }
    return items;
};
exports.generateItems = generateItems;
//# sourceMappingURL=index.js.map
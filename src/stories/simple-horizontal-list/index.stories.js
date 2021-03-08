"use strict";
exports.__esModule = true;
exports.Demo = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var array_move_1 = tslib_1.__importDefault(require("array-move"));
var addon_knobs_1 = require("@storybook/addon-knobs");
var addon_actions_1 = require("@storybook/addon-actions");
var index_1 = tslib_1.__importStar(require("../../index"));
var helpers_1 = require("../helpers");
var core_1 = require("@material-ui/core");
exports["default"] = {
    title: 'react-easy-sort/Simple horizontal list',
    component: index_1["default"],
    decorators: [addon_knobs_1.withKnobs]
};
var useStyles = core_1.makeStyles({
    list: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'flex-start'
    },
    item: {
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(84, 84, 241)',
        color: 'white',
        margin: 8,
        width: 60,
        height: 60,
        cursor: 'grab'
    },
    dragged: {
        backgroundColor: 'rgb(37, 37, 197)'
    }
});
var Demo = function () {
    var classes = useStyles();
    var count = addon_knobs_1.number('Items', 9, { min: 3, max: 12, range: true });
    var _a = react_1["default"].useState([]), items = _a[0], setItems = _a[1];
    react_1["default"].useEffect(function () {
        setItems(helpers_1.generateItems(count));
    }, [count]);
    var onSortEnd = function (oldIndex, newIndex) {
        addon_actions_1.action('onSortEnd')("oldIndex=" + oldIndex + ", newIndex=" + newIndex);
        setItems(function (array) { return array_move_1["default"](array, oldIndex, newIndex); });
    };
    return (react_1["default"].createElement(index_1["default"], { onSortEnd: onSortEnd, className: classes.list, draggedItemClassName: classes.dragged }, items.map(function (item) { return (react_1["default"].createElement(index_1.SortableItem, { key: item },
        react_1["default"].createElement("div", { className: classes.item }, item))); })));
};
exports.Demo = Demo;
//# sourceMappingURL=index.stories.js.map
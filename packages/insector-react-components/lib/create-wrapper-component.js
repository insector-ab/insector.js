'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createWrapperComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _insectorUtils = require('insector-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a simple React wrapper component
 * @param  {String} className Component className
 * @return {function} React component
 */
function createWrapperComponent(className, tagName) {

    var Component = function Component(props) {
        var attrs = (0, _insectorUtils.getAttrs)(props, Component);
        attrs.className = (0, _classnames2.default)(className, attrs.className);
        var Tag = tagName || 'div';
        return _react2.default.createElement(
            Tag,
            attrs,
            props.children
        );
    };

    Component.propTypes = {
        children: _propTypes2.default.node
    };

    return Component;
}
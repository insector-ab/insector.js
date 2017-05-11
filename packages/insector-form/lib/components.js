'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.FormGroup = FormGroup;
exports.CheckboxGroup = CheckboxGroup;
exports.FormTextInput = FormTextInput;
exports.FormPasswordInput = FormPasswordInput;
exports.FormCheckbox = FormCheckbox;
exports.FormSelect = FormSelect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _insectorUtils = require('insector-utils');

var _controls = require('./controls');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * FormGroup
 */
function FormGroup(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormGroup);
    attrs.className = (0, _classnames2.default)('form-group', attrs.className);
    var leftColClasses = (0, _classnames2.default)('col-md-' + props.labelSize, 'control-label');
    var rightColClasses = (0, _classnames2.default)('col-md-' + (12 - props.labelSize));
    return _react2.default.createElement(
        'div',
        attrs,
        _react2.default.createElement(
            'label',
            { className: leftColClasses, htmlFor: props.labelFor },
            props.label
        ),
        _react2.default.createElement(
            'div',
            { className: rightColClasses },
            props.children
        )
    );
}
FormGroup.propTypes = {
    label: _propTypes2.default.string,
    labelSize: _propTypes2.default.number,
    labelFor: _propTypes2.default.string,
    children: _propTypes2.default.node
};
FormGroup.defaultProps = {
    labelSize: 3
};

/**
 * CheckboxGroup
 */
function CheckboxGroup(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, CheckboxGroup);
    attrs.className = (0, _classnames2.default)('checkbox', attrs.className || '');
    return _react2.default.createElement(
        'div',
        attrs,
        _react2.default.createElement(
            'label',
            null,
            props.children,
            props.label
        )
    );
}
CheckboxGroup.propTypes = {
    label: _propTypes2.default.string,
    children: _propTypes2.default.node
};

// ------------- React inputs ------------- //

/**
 * FormTextInput
 */
function FormTextInput(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormTextInput);
    attrs.className = (0, _classnames2.default)('form-control', attrs.className || '');
    return _react2.default.createElement(_controls.ReactInput, _extends({ type: 'text'
    }, attrs));
}
FormTextInput.propTypes = {};

/**
 * FormPasswordInput
 */
function FormPasswordInput(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormPasswordInput);
    attrs.className = (0, _classnames2.default)('form-control', attrs.className || '');
    return _react2.default.createElement(_controls.ReactInput, _extends({ type: 'password'
    }, attrs));
}
FormPasswordInput.propTypes = {};

/**
 * FormCheckbox
 */
function FormCheckbox(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormCheckbox);
    return _react2.default.createElement(_controls.ReactInput, _extends({ type: 'checkbox'
    }, attrs));
}
FormCheckbox.propTypes = {};

/**
 * FormSelect
 */
function FormSelect(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormSelect);
    attrs.className = (0, _classnames2.default)('form-control', attrs.className || '');
    return _react2.default.createElement(
        _controls.ReactSelect,
        attrs,
        props.children
    );
}
FormSelect.propTypes = {
    children: _propTypes2.default.node
};
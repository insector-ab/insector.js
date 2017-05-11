'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactSelect = exports.ReactTextarea = exports.ReactInput = exports.AbstractFormControl = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _insectorUtils = require('insector-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Autocomplete from 'react-autocomplete';
// import classNames from 'classnames';


// import 'bootstrap-datepicker';

/**
 * AbstractFormControl
 */
var AbstractFormControl = exports.AbstractFormControl = function (_React$Component) {
    _inherits(AbstractFormControl, _React$Component);

    function AbstractFormControl(props) {
        _classCallCheck(this, AbstractFormControl);

        var _this = _possibleConstructorReturn(this, (AbstractFormControl.__proto__ || Object.getPrototypeOf(AbstractFormControl)).call(this, props));

        _this.onChange = _this.onChange.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        return _this;
    }

    _createClass(AbstractFormControl, [{
        key: 'getAttrs',
        value: function getAttrs() {
            var attrs = (0, _insectorUtils.getAttrs)(this.props, this.constructor);
            attrs.onChange = this.onChange;
            attrs.onBlur = this.onBlur;
            return attrs;
        }
    }, {
        key: 'onChange',
        value: function onChange(event) {
            this.dispatchCustomEvent('react.change', event);
        }
    }, {
        key: 'onBlur',
        value: function onBlur(event) {
            this.dispatchCustomEvent('react.blur', event);
        }
    }, {
        key: 'dispatchCustomEvent',
        value: function dispatchCustomEvent(type, data) {
            var e = new window.CustomEvent(type, { detail: data });
            this.element.dispatchEvent(e);
        }
    }, {
        key: 'element',
        get: function get() {
            return _reactDom2.default.findDOMNode(this);
        }
    }]);

    return AbstractFormControl;
}(_react2.default.Component);

AbstractFormControl.propTypes = {
    value: _propTypes2.default.any
};

/**
 * ReactInput
 */

var ReactInput = exports.ReactInput = function (_AbstractFormControl) {
    _inherits(ReactInput, _AbstractFormControl);

    function ReactInput() {
        _classCallCheck(this, ReactInput);

        return _possibleConstructorReturn(this, (ReactInput.__proto__ || Object.getPrototypeOf(ReactInput)).apply(this, arguments));
    }

    _createClass(ReactInput, [{
        key: 'render',
        value: function render() {
            var attrs = this.getAttrs();
            return _react2.default.createElement('input', _extends({ type: this.props.type || 'text',
                value: this.props.value
            }, attrs));
        }
    }]);

    return ReactInput;
}(AbstractFormControl);

ReactInput.propTypes = {
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
};
ReactInput.defaultProps = {
    value: ''
};

/**
 * ReactTextarea
 */

var ReactTextarea = exports.ReactTextarea = function (_AbstractFormControl2) {
    _inherits(ReactTextarea, _AbstractFormControl2);

    function ReactTextarea() {
        _classCallCheck(this, ReactTextarea);

        return _possibleConstructorReturn(this, (ReactTextarea.__proto__ || Object.getPrototypeOf(ReactTextarea)).apply(this, arguments));
    }

    _createClass(ReactTextarea, [{
        key: 'render',
        value: function render() {
            var attrs = this.getAttrs();
            return _react2.default.createElement('textarea', _extends({ value: this.props.value
            }, attrs));
        }
    }]);

    return ReactTextarea;
}(AbstractFormControl);

ReactTextarea.propTypes = {
    value: _propTypes2.default.string
};
ReactTextarea.defaultProps = {
    value: ''
};

/**
 * ReactSelect
 */

var ReactSelect = exports.ReactSelect = function (_AbstractFormControl3) {
    _inherits(ReactSelect, _AbstractFormControl3);

    function ReactSelect() {
        _classCallCheck(this, ReactSelect);

        return _possibleConstructorReturn(this, (ReactSelect.__proto__ || Object.getPrototypeOf(ReactSelect)).apply(this, arguments));
    }

    _createClass(ReactSelect, [{
        key: 'render',
        value: function render() {
            var attrs = this.getAttrs();
            return _react2.default.createElement(
                'select',
                _extends({ value: this.props.value
                }, attrs),
                this.props.children
            );
        }
    }]);

    return ReactSelect;
}(AbstractFormControl);

ReactSelect.propTypes = {
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    children: _propTypes2.default.node
};
ReactSelect.defaultProps = {
    value: ''
};

// /**
//  * ReactDatepicker
//  */
// export class ReactDatepicker extends ReactInput {

//     constructor(props) {
//         super(props);
//         this.onDateChange = this.onDateChange.bind(this);
//         this.onShow = this.onShow.bind(this);
//         this.onHide = this.onHide.bind(this);
//     }

//     componentDidMount() {
//         // Datepicker instance
//         if (!this.datepicker) {
//             const $el = $(ReactDOM.findDOMNode(this));
//             this.datepicker = $el.datepicker({
//                 format: 'yyyy-mm-dd',
//                 weekStart: 1,
//                 autoclose: true
//             });
//             this.datepicker.on('changeDate', this.onDateChange);
//             this.datepicker.on('show', this.onShow);
//             this.datepicker.on('hide', this.onHide);
//         }
//     }

//     componentWillUnmount() {
//         if (this.datepicker) {
//             this.datepicker.off(undefined, undefined, this);
//             delete this.datepicker;
//         }
//     }

//     onChange(event) {
//         // disable onChange behaviour
//     }

//     onDateChange(event) {
//         super.onChange(event);
//     }

//     onShow(event) {
//         this.dispatchEvent(event, 'react.datepicker.show');
//         // this.$el.trigger('react.datepicker.show', [event, this]);
//     }

//     onHide(event) {
//         this.dispatchEvent(event, 'react.datepicker.hide');
//         // this.$el.trigger('react.datepicker.hide', [event, this]);
//     }

// }
// ReactDatepicker.propTypes = {
//     value: PropTypes.string
// };

// /**
//  * ReactToggle
//  */
// export class ReactToggle extends ReactInput {

//     componentDidMount() {
//         // bootstrapToggle instance
//         if (!this.toggle) {
//             const $el = $(ReactDOM.findDOMNode(this));
//             this.toggle = $el.bootstrapToggle({
//                 on: 'Yes',
//                 off: 'No',
//                 onstyle: 'success',
//                 offstyle: 'warning',
//                 size: 'small'
//             });
//             this.toggle.on('change', this.onChange);
//         }
//     }

//     componentWillUnmount() {
//         delete this.toggle;
//     }

// }
// ReactToggle.propTypes = {
//     value: PropTypes.string
// };
// ReactToggle.defaultProps = {
//     type: 'checkbox'
// };

// /**
//  * ReactAutocomplete
//  */
// export class ReactAutocomplete extends AbstractFormControl {

//     constructor(props) {
//         super(props);
//         this.onSelect = this.onSelect.bind(this);
//         this.onChange = this.onChange.bind(this);
//     }

//     render() {
//         const p = this.props;
//         // use default values
//         const defaultProps = this.constructor.defaultProps;
//         const wrapperProps = Object.assign({}, defaultProps.wrapperProps, p.wrapperProps);
//         const inputProps = Object.assign({}, defaultProps.inputProps, p.inputProps);
//         // wrapper className
//         if (wrapperProps.className && p.className) {
//             wrapperProps.className += ' ' + p.className;
//         } else if (p.className) {
//             wrapperProps.className = p.className;
//         }
//         return (
//             <Autocomplete ref="autocomplete"
//                           onChange={this.onChange}
//                           onSelect={this.onSelect}
//                           value={p.value ? p.value : ''}
//                           items={p.items}
//                           shouldItemRender={p.shouldItemRender}
//                           getItemValue={p.getItemValue}
//                           renderItem={p.renderItem}
//                           renderMenu={p.renderMenu}
//                           inputProps={inputProps}
//                           wrapperProps={wrapperProps} />
//         );
//     }

//     onSelect(value, item) {
//         // dispatch, no event available
//         this.dispatchEvent(undefined, 'react.autocomplete.select', value, item);
//     }

//     onChange(event, value) {
//         this.dispatchEvent(event, 'react.change');
//     }

// }
// // Autocomplete.propTypes = {
// //     value: PropTypes.any,
// //     onChange: PropTypes.func,
// //     onSelect: PropTypes.func,
// //     shouldItemRender: PropTypes.func,
// //     sortItems: PropTypes.func,
// //     getItemValue: PropTypes.func.isRequired,
// //     renderItem: PropTypes.func.isRequired,
// //     renderMenu: PropTypes.func,
// //     menuStyle: PropTypes.object,
// //     inputProps: PropTypes.object,
// //     wrapperProps: PropTypes.object,
// //     wrapperStyle: PropTypes.object,
// //     autoHighlight: PropTypes.bool,
// //     onMenuVisibilityChange: PropTypes.func,
// //     open: PropTypes.bool,
// //     debug: PropTypes.bool
// // }
// ReactAutocomplete.propTypes = {
//     className: PropTypes.string,
//     noValueText: PropTypes.string,
//     value: PropTypes.any,
//     items: PropTypes.array,
//     shouldItemRender: PropTypes.func,
//     sortItems: PropTypes.func,
//     getItemValue: PropTypes.func.isRequired,
//     renderItem: PropTypes.func.isRequired,
//     renderMenu: PropTypes.func,
//     inputProps: PropTypes.object,
//     wrapperProps: PropTypes.object
// };
// ReactAutocomplete.defaultProps = {
//     shouldItemRender: function(item, value) {
//         return item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
//     },
//     getItemValue: function(item) {
//         return item.name;
//     },
//     renderItem: function(item, isHighlighted) {
//         const classes = classNames({'active': isHighlighted});
//         return (
//             <li className={classes}
//                  key={item.id}
//                  id={item.id}>
//                 <span>{item.name}</span>
//             </li>
//         );
//     },
//     renderMenu: function(items, value, style) {
//         let children = items;
//         // TODO: use noValueText from props
//         if (children.length === 0) {
//             children = <li><span className="text-novalue">No items matched</span></li>;
//         }
//         return (
//             <ul className="dropdown-menu">
//                 {children}
//             </ul>
//         );
//     },
//     inputProps: {name: 'autocomplete', 'className': 'form-control'},
//     wrapperProps: {className: 'autocomplete'}
// };
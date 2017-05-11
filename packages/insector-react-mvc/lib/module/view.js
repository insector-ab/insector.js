'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.uniqueid');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Privates
var _model = void 0,
    _controller = void 0;

/**
 * ModuleView
 */

var ModuleView = function (_React$Component) {
    _inherits(ModuleView, _React$Component);

    function ModuleView(props) {
        _classCallCheck(this, ModuleView);

        // Model
        var _this = _possibleConstructorReturn(this, (ModuleView.__proto__ || Object.getPrototypeOf(ModuleView)).call(this, props));

        _model = _this._newModelInstance(props);
        // Controller
        _controller = _this._newControllerInstance(_model, props);
        return _this;
    }

    _createClass(ModuleView, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { ref: 'view' });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // controller event handler
            this.controller.componentWillMount();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // Set view in controller
            this.controller.targetComponent = this.view;
            // Super (calls _addEventListeners)
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), 'componentDidMount', this).call(this);
            // controller event handler
            this.controller.componentDidMount();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // controller event handler
            this.controller.componentWillUnmount();
            // Unset view in controller
            this.controller.targetComponent = undefined;
            // Super (calls _removeEventListeners)
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), 'componentWillUnmount', this).call(this);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // controller handles new props
            this.controller.componentWillReceiveProps(nextProps);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // Abstract
        }
    }, {
        key: '_newModelInstance',
        value: function _newModelInstance(props) {
            // Abstract
        }
    }, {
        key: '_newControllerInstance',
        value: function _newControllerInstance(model, props) {
            // Abstract
        }
    }, {
        key: '_getUniqueClientID',
        value: function _getUniqueClientID() {
            return (0, _lodash2.default)('module');
        }
    }, {
        key: '_dispose',
        value: function _dispose() {
            // Dispose controller
            if (this.controller.hasOwnProperty('dispose')) {
                this.controller.dispose();
            }
            // Dispose model
            if (this.model.hasOwnProperty('dispose')) {
                this.model.dispose();
            }
            // Dispose super
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), '_dispose', this).call(this);
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), '_deleteReferences', this).call(this);
            // delete refs
            delete this._controller;
        }
    }, {
        key: '_addEventListeners',
        value: function _addEventListeners(model) {
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), '_addEventListeners', this).call(this, model);
            // Delegate events to Module DOM element
            this.controller.delegateEvents(this.element);
        }
    }, {
        key: '_removeEventListeners',
        value: function _removeEventListeners() {
            _get(ModuleView.prototype.__proto__ || Object.getPrototypeOf(ModuleView.prototype), '_removeEventListeners', this).call(this);
            // Undelegate events from Module DOM element
            this.controller.undelegateEvents();
        }
    }, {
        key: 'model',
        get: function get() {
            return _model;
        }
    }, {
        key: 'view',
        get: function get() {
            if (!this.refs.hasOwnProperty('view')) {
                throw new Error('No ref attribute in ' + this.constructor.name + '.render: <Module ref="view" />.');
            }
            return this.refs.view;
        }
    }, {
        key: 'controller',
        get: function get() {
            return _controller;
        }
    }]);

    return ModuleView;
}(_react2.default.Component);

exports.default = ModuleView;
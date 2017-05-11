'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.uniqueid');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.result');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ReactController
 */
var ReactController = function () {
    function ReactController(model, targetComponent) {
        _classCallCheck(this, ReactController);

        // public
        this.cid = (0, _lodash4.default)('controller');
        // private
        this._model = model;
        this._targetComponent = targetComponent;
        this._delegatedEl = undefined;
    }

    _createClass(ReactController, [{
        key: 'events',
        value: function events() {
            return {};
        }
    }, {
        key: 'dispatchDOMEvent',
        value: function dispatchDOMEvent(event, target) {
            // console.log(this.constructor.name, 'dispatchDOMEvent', event.type);
            event.target = target || this.element;
            (0, _jquery2.default)(event.target).trigger(event.type, event);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // Model Listeners
            this._addModelEventListeners();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // View Listeners
            this._addViewEventListeners();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // Listeners
            this._removeModelEventListeners();
            this._removeViewEventListeners();
        }
    }, {
        key: 'delegateEvents',
        value: function delegateEvents(targetEl) {
            targetEl = targetEl || this.element;
            var events = (0, _lodash6.default)(this, 'events');
            var key = void 0;
            // Events, but no target found, throw error.
            if (events && !targetEl) {
                throw new Error('Could not delegate controller events. No target element.');
            }
            // Events found, delegate
            if (events) {
                // Undelegate
                this.undelegateEvents();
                var method = void 0,
                    match = void 0,
                    eventName = void 0,
                    selector = void 0;
                // Delegate
                for (key in events) {
                    if (!events.hasOwnProperty(key)) {
                        continue;
                    }
                    method = events[key];
                    if (!(0, _lodash2.default)(method)) {
                        method = this[events[key]];
                    }
                    if (!method) {
                        continue;
                    }
                    match = key.match(/^(\S+)\s*(.*)$/);
                    eventName = match[1];
                    selector = match[2];
                    method = method.bind(this);
                    eventName += '.delegateEvents' + this.cid;
                    if (selector === '') {
                        (0, _jquery2.default)(targetEl).on(eventName, method);
                    } else {
                        (0, _jquery2.default)(targetEl).on(eventName, selector, method);
                    }
                }
                // Save new target
                this._delegatedEl = targetEl;
            }
            // Return
            return this;
        }
    }, {
        key: 'undelegateEvents',
        value: function undelegateEvents() {
            if (this._delegatedEl) {
                (0, _jquery2.default)(this._delegatedEl).off('.delegateEvents' + this.cid);
            }
            return this;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._removeModelEventListeners();
            this._removeViewEventListeners();
            // delete refs
            this._deleteReferences();
        }
    }, {
        key: '_addViewEventListeners',
        value: function _addViewEventListeners() {
            // Abstract
        }
    }, {
        key: '_addModelEventListeners',
        value: function _addModelEventListeners(model) {
            // Abstract
        }
    }, {
        key: '_removeViewEventListeners',
        value: function _removeViewEventListeners() {
            // Abstract
        }
    }, {
        key: '_removeModelEventListeners',
        value: function _removeModelEventListeners() {
            // Abstract
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            delete this._model;
            delete this._component;
            delete this._delegatedEl;
        }
    }, {
        key: 'model',
        get: function get() {
            return this._model;
        },
        set: function set(value) {
            if (value !== this._model) {
                // Remove listeners from current model
                this._removeModelEventListeners();
                // Set new model
                this._model = value;
                // Add listeners to new model
                this._addModelEventListeners();
            }
        }
    }, {
        key: 'targetComponent',
        get: function get() {
            return this._targetComponent;
        },
        set: function set(value) {
            this._targetComponent = value;
        }
    }, {
        key: 'element',
        get: function get() {
            console.log('ReactController.element', this.targetComponent.constructor);
            return _reactDom2.default.findDOMNode(this.targetComponent);
        }
    }]);

    return ReactController;
}();

exports.default = ReactController;
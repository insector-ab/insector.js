'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.isobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.uniqueid');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.result');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ReactView
 */
var ReactView = function (_React$Component) {
    _inherits(ReactView, _React$Component);

    function ReactView(props) {
        _classCallCheck(this, ReactView);

        // Unique client id
        var _this = _possibleConstructorReturn(this, (ReactView.__proto__ || Object.getPrototypeOf(ReactView)).call(this, props));

        _this.cid = _this._getUniqueClientID();
        return _this;
    }

    _createClass(ReactView, [{
        key: 'events',
        value: function events() {
            return {};
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._dispose();
            this._removeEventListeners();
            this._deleteReferences();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // console.log('componentWillReceiveProps', this.constructor.name, this.cid);
            if (nextProps.model && nextProps.model !== this.model) {
                // Remove listeners from current model
                this._removeEventListeners();
                // Add to new model
                this._addEventListeners(nextProps.model);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // Add listeners
            this._addEventListeners();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // Dispose
            this.dispose();
            // Super
            _get(ReactView.prototype.__proto__ || Object.getPrototypeOf(ReactView.prototype), 'componentWillUnmount', this).call(this);
        }
    }, {
        key: '_delegateEvents',
        value: function _delegateEvents(target) {
            target = target || this.model;
            var events = this._getResolvedEvents();
            // Events found, delegate
            if (events) {
                // Events, but no target found, throw error.
                if (!target) {
                    throw new Error('Could not delegate controller events. No target model.');
                }
                // Undelegate
                this._undelegateEvents();
                // Delegate
                Object.keys(events).forEach(function (key) {
                    target.addListener(key, events[key]);
                });
                // Save target
                this._delegatedTarget = target;
            }
            // Return
            return this;
        }
    }, {
        key: '_undelegateEvents',
        value: function _undelegateEvents(target) {
            var _this2 = this;

            target = target || this._delegatedTarget || this.model;
            // Undelegate
            if (this._resolvedEvents) {
                Object.keys(this._resolvedEvents).forEach(function (key) {
                    target.removeListener(key, _this2._resolvedEvents[key]);
                });
            }
            // Return
            return this;
        }
    }, {
        key: '_getResolvedEvents',
        value: function _getResolvedEvents() {
            var _this3 = this;

            if (!this._resolvedEvents) {
                var events = (0, _lodash8.default)(this, 'events');
                if (!events) {
                    return;
                }
                this._resolvedEvents = {};
                Object.keys(events).forEach(function (key) {
                    _this3._resolvedEvents[key] = _this3._getEventHandler(key, events);
                });
            }
            return this._resolvedEvents;
        }
    }, {
        key: '_getEventHandler',
        value: function _getEventHandler(key, events) {
            events = events || (0, _lodash8.default)(this, 'events');
            var handler = events[key];
            if (!(0, _lodash4.default)(handler)) {
                handler = this[events[key]];
            }
            if (!handler) {
                throw new Error('Could not find handler for event "' + key + '".');
            }
            return handler.bind(this);
        }

        // FIX: split up _addEventListeners into addModelEventListeners & addViewEventListeners
        // run _addModelEventListeners in componentWillMount
        // run _addViewEventListeners in componentDidMount

    }, {
        key: '_addEventListeners',
        value: function _addEventListeners(model) {
            this._delegateEvents(model);
        }
    }, {
        key: '_removeEventListeners',
        value: function _removeEventListeners() {
            this._undelegateEvents();
        }
    }, {
        key: '_getUniqueClientID',
        value: function _getUniqueClientID() {
            return (0, _lodash6.default)('view');
        }
    }, {
        key: '_dispose',
        value: function _dispose() {
            // Abstract
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            var _this4 = this;

            delete this.cid;
            delete this._model;
            delete this._delegatedTarget;
            // Resolved event handlers
            Object.keys(this._resolvedEvents || {}).forEach(function (key) {
                delete _this4._resolvedEvents[key];
            });
            delete this._resolvedEvents;
        }
    }, {
        key: 'model',
        get: function get() {
            if ((0, _lodash2.default)(this.props) && this.props.hasOwnProperty('model')) {
                return this.props.model;
            }
            if (this.hasOwnProperty('_model')) {
                return this._model;
            }
            return null;
        }
    }, {
        key: 'element',
        get: function get() {
            return _reactDom2.default.findDOMNode(this);
        }
    }]);

    return ReactView;
}(_react2.default.Component);

exports.default = ReactView;

ReactView.propTypes = {
    model: _propTypes2.default.object
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _controller = require('../controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ModuleController
 */
var ModuleController = function (_ReactController) {
    _inherits(ModuleController, _ReactController);

    function ModuleController(model, targetComponent) {
        _classCallCheck(this, ModuleController);

        // Promise
        var _this = _possibleConstructorReturn(this, (ModuleController.__proto__ || Object.getPrototypeOf(ModuleController)).call(this, model, targetComponent));

        _this._initializePromise = undefined;
        // Bind
        _this.onInitializeDone = _this.onInitializeDone.bind(_this);
        _this.onInitializeFail = _this.onInitializeFail.bind(_this);
        return _this;
    }

    _createClass(ModuleController, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            _get(ModuleController.prototype.__proto__ || Object.getPrototypeOf(ModuleController.prototype), 'componentWillMount', this).call(this);
            // Initialize
            if (!this.model.initialized) {
                if (!this._initializePromise) {
                    var $promise = this.initialize();

                    if (!$promise || !(0, _lodash2.default)($promise.done)) {
                        throw new Error('ModuleController.initialize() should always return a promise');
                    }
                    this._initializePromise = $promise;
                    this._initializePromise.fail(this.onInitializeFail);
                }
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            _get(ModuleController.prototype.__proto__ || Object.getPrototypeOf(ModuleController.prototype), 'componentDidMount', this).call(this);
            // initializing, launches when done
            if (this._initializePromise) {
                this._initializePromise.done(this.onInitializeDone);
            } else if (this.model.initialized) {
                this.launch();
            } else {
                throw new Error('ModuleController.componentDidMount() No this._initializePromise found and model not initialized, module will not launch()');
            }
        }

        // Called when component will mount and ModuleModel is not initialized
        // intialize should always return a promise
        // Override and do stuff

    }, {
        key: 'initialize',
        value: function initialize() {
            return _jquery2.default.Deferred().resolve().promise();
        }

        // Called when component is mounted and initialized promise is resolved
        // Override and do stuff

    }, {
        key: 'launch',
        value: function launch() {}
    }, {
        key: 'onInitializeDone',
        value: function onInitializeDone(data, textStatus, jqXHR) {
            this._initializePromise = undefined;
            // Update model
            if (this.model) {
                this.model.initialized = true;
            }
            // Launch
            this.launch();
        }
    }, {
        key: 'onInitializeFail',
        value: function onInitializeFail(promise, textStatus, statusTitle) {
            // ABSTRACT
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            _get(ModuleController.prototype.__proto__ || Object.getPrototypeOf(ModuleController.prototype), '_deleteReferences', this).call(this);
            // Binds
            delete this.onInitializeDone;
            delete this.onInitializeFail;
        }
    }]);

    return ModuleController;
}(_controller2.default);

exports.default = ModuleController;
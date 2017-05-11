'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _controller = require('../module/controller');

var _controller2 = _interopRequireDefault(_controller);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AppController
 */
var AppController = function (_ModuleController) {
    _inherits(AppController, _ModuleController);

    function AppController(model) {
        _classCallCheck(this, AppController);

        // Bind
        var _this = _possibleConstructorReturn(this, (AppController.__proto__ || Object.getPrototypeOf(AppController)).call(this, model));

        _this.onClick = _this.onClick.bind(_this);
        _this.onDblClick = _this.onDblClick.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onWindowPopState = _this.onWindowPopState.bind(_this);
        // Ajax events
        _this.onAjaxStart = _this.onAjaxStart.bind(_this);
        _this.onAjaxError = _this.onAjaxError.bind(_this);
        _this.onAjaxSuccess = _this.onAjaxSuccess.bind(_this);
        _this.onAjaxStop = _this.onAjaxStop.bind(_this);
        return _this;
    }

    _createClass(AppController, [{
        key: 'events',
        value: function events() {
            return {
                'routeto.insector.app': 'onRouteTo',
                'updatedocumenttitle.insector.app': 'onUpdateDocumentTitle'
            };
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            var superPromise = _get(AppController.prototype.__proto__ || Object.getPrototypeOf(AppController.prototype), 'initialize', this).call(this);
            var deferred = _jquery2.default.Deferred();
            // Load dependencies
            this._loadDependencies().done(function () {
                // Define routes
                _this2._defineRoutes();
                // resolve
                deferred.resolve();
            });
            // Return promise
            return _jquery2.default.when(superPromise, deferred.promise());
        }
    }, {
        key: 'launch',
        value: function launch() {
            _get(AppController.prototype.__proto__ || Object.getPrototypeOf(AppController.prototype), 'launch', this).call(this);
            // Show page
            this.dispatchDOMEvent(_event2.default.createRouteToEvent(window.location.pathname));
        }
    }, {
        key: 'routeTo',
        value: function routeTo(path) {
            throw new Error('Abstract method AppController.routeTo not implemented.');
        }
    }, {
        key: 'setDocumentTitle',
        value: function setDocumentTitle(title) {
            document.title = String(title);
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            return this._checkRouting('.page-route', event);
        }
    }, {
        key: 'onDblClick',
        value: function onDblClick(event) {
            return this._checkRouting('.dbl-page-route', event);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            switch (event.which) {
                case 13:
                    // enter-key
                    this._checkRouting('.page-route', event);
                    this._checkRouting('.dbl-page-route', event);
                    break;
            }
        }
    }, {
        key: 'onInitializeFail',
        value: function onInitializeFail(promise, textStatus, statusTitle) {
            // FIX
            // Try launch anyway
            this.launch();
        }
    }, {
        key: 'onRouteTo',
        value: function onRouteTo(event, appEvent) {
            console.log('onRouteTo', appEvent.route);
            // Open in new window?
            if (appEvent.inNewWindow) {
                window.open(appEvent.route);
            } else {
                // Route
                this.routeTo(appEvent.route);
            }
        }
    }, {
        key: 'onUpdateDocumentTitle',
        value: function onUpdateDocumentTitle(event, appEvent) {
            var _this3 = this;

            setTimeout(function () {
                console.log('onUpdateDocumentTitle (delayed 100 ms)', appEvent.title);
                _this3.setDocumentTitle(appEvent.title);
            }, 100);
        }
    }, {
        key: 'onWindowPopState',
        value: function onWindowPopState(event) {
            // Hide any open modals
            (0, _jquery2.default)(this.element).find('.modal').modal('hide');
        }
    }, {
        key: 'onWindowError',
        value: function onWindowError(event) {
            // Abstract
        }
    }, {
        key: 'onAjaxStart',
        value: function onAjaxStart(event) {
            console.log('onAjaxStart', event);
            this.model.isFetching = true;
        }
    }, {
        key: 'onAjaxError',
        value: function onAjaxError() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            console.log('onAjaxError', args);
        }
    }, {
        key: 'onAjaxSuccess',
        value: function onAjaxSuccess(event, jqXHR, ajaxOptions, data) {
            console.log('onAjaxSuccess', data);
        }
    }, {
        key: 'onAjaxStop',
        value: function onAjaxStop(event) {
            console.log('onAjaxStop', event);
            this.model.isFetching = false;
        }

        // Always return promise

    }, {
        key: '_loadDependencies',
        value: function _loadDependencies() {
            return _jquery2.default.Deferred().resolve().promise();
        }
    }, {
        key: '_checkRouting',
        value: function _checkRouting(classname, event) {
            // console.log('_checkRouting', event);
            var $targetEl = (0, _jquery2.default)(event.target);
            var $linkEl = $targetEl.closest('a');
            var $pageRouteEl = $targetEl.closest(classname);
            // Check .page-route click
            if ($pageRouteEl.length) {
                if ($pageRouteEl.attr('disabled') === 'disabled') {
                    event.preventDefault();
                } else {
                    return this._pageRouteHandler($pageRouteEl, event);
                }
                // If link with href="#" prevent default
            } else if ($linkEl.length && $linkEl.attr('href') === '#') {
                event.preventDefault();
            }
            return false;
        }
    }, {
        key: '_pageRouteHandler',
        value: function _pageRouteHandler($el, event) {
            // href
            var href = $el.attr('href') || $el.attr('data-href');
            // open in new window?
            var isTargetBlankLink = $el.is('a') && $el.attr('target') === '_blank';
            if (isTargetBlankLink) {
                return false;
            }
            var metaKeyOnNonLink = (event.metaKey || $el.attr('data-target') === '_blank') && !$el.is('a');
            if (metaKeyOnNonLink) {
                window.open(href);
                return false;
            }
            if (event.metaKey) {
                return;
            }
            // Stop event
            event.preventDefault();
            // Route
            this.routeTo(href);
            return false;
        }
    }, {
        key: '_defineRoutes',
        value: function _defineRoutes() {
            throw new Error('Abstract method AppController._defineRoutes not implemented.');
        }
    }, {
        key: '_addViewEventListeners',
        value: function _addViewEventListeners() {
            _get(AppController.prototype.__proto__ || Object.getPrototypeOf(AppController.prototype), '_addViewEventListeners', this).call(this);
            // Add click handlers in capture phase
            this.element.addEventListener('click', this.onClick, true);
            this.element.addEventListener('dblclick', this.onDblClick, true);
            this.element.addEventListener('keydown', this.onKeyDown, true);
            // Window events
            (0, _jquery2.default)(window).on('popstate', this.onWindowPopState);
            (0, _jquery2.default)(window).on('error', this.onWindowError);
            // Global ajax events
            (0, _jquery2.default)(document).on('ajaxStart', this.onAjaxStart);
            (0, _jquery2.default)(document).on('ajaxError', this.onAjaxError);
            (0, _jquery2.default)(document).on('ajaxSuccess', this.onAjaxSuccess);
            (0, _jquery2.default)(document).on('ajaxStop', this.onAjaxStop);
        }
    }, {
        key: '_removeViewEventListeners',
        value: function _removeViewEventListeners() {
            _get(AppController.prototype.__proto__ || Object.getPrototypeOf(AppController.prototype), '_removeViewEventListeners', this).call(this);
            // Remove click handlers in capture phase
            this.element.removeEventListener('click', this.onClick, true);
            this.element.removeEventListener('dblclick', this.onDblClick, true);
            this.element.removeEventListener('keydown', this.onKeyDown, true);
            // Window events
            (0, _jquery2.default)(window).off('popstate', this.onWindowPopState);
            (0, _jquery2.default)(window).off('error', this.onWindowError);
            // Global ajax events
            (0, _jquery2.default)(document).off('ajaxStart', this.onAjaxStart);
            (0, _jquery2.default)(document).off('ajaxError', this.onAjaxError);
            (0, _jquery2.default)(document).off('ajaxSuccess', this.onAjaxSuccess);
            (0, _jquery2.default)(document).off('ajaxStop', this.onAjaxStop);
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            _get(AppController.prototype.__proto__ || Object.getPrototypeOf(AppController.prototype), '_deleteReferences', this).call(this);
            delete this.onClick;
            delete this.onDblClick;
            delete this.onKeyDown;
            delete this.onRouteTo;
            delete this.onUpdateDocumentTitle;
            delete this.onWindowPopState;
        }
    }]);

    return AppController;
}(_controller2.default);

exports.default = AppController;
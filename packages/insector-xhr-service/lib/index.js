'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JSONService = exports.XHRService = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash.defaults');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.uniqueid');

var _lodash4 = _interopRequireDefault(_lodash3);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * XHRService
 */
var XHRService = exports.XHRService = function () {
    function XHRService() {
        var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
        var defaultAjaxParams = arguments[1];

        _classCallCheck(this, XHRService);

        // public
        this.cid = (0, _lodash4.default)('service');
        this._baseUrl = baseUrl;
        this._defaultAjaxParams = defaultAjaxParams || {};
        this._jqXHRs = {};
    }

    _createClass(XHRService, [{
        key: 'get',
        value: function get(relativeUrl) {
            var ajaxParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var params = this._getAjaxParams(ajaxParams, { method: 'GET' });
            return this.request(relativeUrl, params);
        }
    }, {
        key: 'delete',
        value: function _delete(relativeUrl) {
            var ajaxParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var params = this._getAjaxParams(ajaxParams, { method: 'DELETE' });
            return this.request(relativeUrl, params);
        }
    }, {
        key: 'post',
        value: function post(relativeUrl, data) {
            var ajaxParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var params = this._getAjaxParams(ajaxParams, { method: 'POST', data: data });
            return this.request(relativeUrl, params);
        }
    }, {
        key: 'put',
        value: function put(relativeUrl, data) {
            var ajaxParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var params = this._getAjaxParams(ajaxParams, { method: 'PUT', data: data });
            return this.request(relativeUrl, params);
        }
    }, {
        key: 'request',
        value: function request(relativeUrl) {
            var ajaxParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var url = this._getUrl(relativeUrl);
            return this.ajax(url, ajaxParams);
        }
    }, {
        key: 'ajax',
        value: function ajax(url) {
            var ajaxParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            console.log(ajaxParams.method, url, ajaxParams.data);
            return _jquery2.default.ajax(url, ajaxParams);
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._deleteReferences();
        }
    }, {
        key: '_getUrl',
        value: function _getUrl(relativeUrl) {
            return _path2.default.join(this.baseUrl, relativeUrl);
        }
    }, {
        key: '_getAjaxParams',
        value: function _getAjaxParams() {
            for (var _len = arguments.length, ajaxParamObjs = Array(_len), _key = 0; _key < _len; _key++) {
                ajaxParamObjs[_key] = arguments[_key];
            }

            return _lodash2.default.apply(undefined, ajaxParamObjs.concat([this.defaultAjaxParams]));
        }
    }, {
        key: '_deleteReferences',
        value: function _deleteReferences() {
            delete this._baseUrl;
            delete this._defaultAjaxParams;
            delete this._jqXHRs;
        }
    }, {
        key: 'baseUrl',
        get: function get() {
            return this._baseUrl;
        },
        set: function set(value) {
            this._baseUrl = _path2.default.normalize(value);
        }
    }, {
        key: 'defaultAjaxParams',
        get: function get() {
            return this._defaultAjaxParams;
        }
    }]);

    return XHRService;
}();

// Store multitons


XHRService._instances = new Map();
// Multiton getter
XHRService.get = function () {
    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var defaultAjaxParams = arguments[1];
    var Constructor = arguments[2];

    baseUrl = _path2.default.normalize(baseUrl);
    // Instance exists?
    if (XHRService._instances.has(baseUrl)) {
        return XHRService._instances.get(baseUrl);
    }
    // Create new XHRService
    Constructor = Constructor || XHRService;
    var service = new Constructor(baseUrl, defaultAjaxParams);
    // Register
    XHRService._instances.set(baseUrl, service);
    // return
    return service;
};
// Alias
XHRService.at = XHRService.get;

/**
 * JSONService
 */

var JSONService = exports.JSONService = function (_XHRService) {
    _inherits(JSONService, _XHRService);

    function JSONService() {
        var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
        var defaultAjaxParams = arguments[1];

        _classCallCheck(this, JSONService);

        // http://www.jsonrpc.org/specification
        var _this = _possibleConstructorReturn(this, (JSONService.__proto__ || Object.getPrototypeOf(JSONService)).call(this, baseUrl, (0, _lodash2.default)(defaultAjaxParams, {
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            processData: false
        })));

        _this._version = '2.0';
        return _this;
    }

    _createClass(JSONService, [{
        key: 'rpc',
        value: function rpc(rpcMethod, params) {
            var ajaxParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            ajaxParams = this._getAjaxParams(ajaxParams, {
                method: 'POST',
                data: this._getRPCData(rpcMethod, params)
            });
            return this.ajax(this.baseUrl, ajaxParams);
        }

        // {"jsonrpc": "2.0", "id": 345, "method": "user.get", params: {id: 163886}}
        // {"jsonrpc": "2.0", "id": 346, "method": "diff", "params": [42, 23]}
        // {"jsonrpc": "2.0", "id": 347, "method": "divide", "params": {"dividend": 42, "divisor": 23}}

    }, {
        key: '_getRPCData',
        value: function _getRPCData(method, params) {
            return {
                method: method,
                params: params,
                jsonrpc: this.version,
                id: (0, _lodash4.default)('rpc')
            };
        }
    }, {
        key: '_getAjaxParams',
        value: function _getAjaxParams() {
            var _get2;

            for (var _len2 = arguments.length, ajaxParamObjs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                ajaxParamObjs[_key2] = arguments[_key2];
            }

            var params = (_get2 = _get(JSONService.prototype.__proto__ || Object.getPrototypeOf(JSONService.prototype), '_getAjaxParams', this)).call.apply(_get2, [this].concat(ajaxParamObjs));
            // if POST or PUT, stringify json data
            if (params.hasOwnProperty('data') && ['POST', 'PUT'].indexOf(params.method) !== -1) {
                params.data = JSON.stringify(params.data);
            }
            return params;
        }
    }, {
        key: 'version',
        get: function get() {
            return this._version;
        },
        set: function set(value) {
            this._version = value;
        }
    }]);

    return JSONService;
}(XHRService);
// Multiton getter


JSONService.at = function () {
    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var defaultAjaxParams = arguments[1];

    return XHRService.at(baseUrl, defaultAjaxParams, JSONService);
};
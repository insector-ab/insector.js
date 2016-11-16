import _ from 'lodash';
import path from 'path';
import {Registry} from 'guins/registry';

/**
 * XHRService
 */
export class XHRService {

    constructor(baseUrl = '/', defaultAjaxParams) {
        // public
        this.cid = _.uniqueId('service');
        this._baseUrl = baseUrl;
        this._defaultAjaxParams = defaultAjaxParams || {};
        this._jqXHRs = {};
    }

    get baseUrl() {
        return this._baseUrl;
    }
    set baseUrl(value) {
        this._baseUrl = path.normalize(value);
    }

    get defaultAjaxParams() {
        return this._defaultAjaxParams;
    }

    get(relativeUrl, ajaxParams = {}) {
        let url = this._getUrl(relativeUrl);
        let params = this._getAjaxParams(ajaxParams, {method: 'GET'});
        return this.request(url, params);
    }

    delete(relativeUrl, ajaxParams = {}) {
        let url = this._getUrl(relativeUrl);
        let params = this._getAjaxParams(ajaxParams, {method: 'DELETE'});
        return this.request(url, params);
    }

    post(relativeUrl, data, ajaxParams = {}) {
        let url = this._getUrl(relativeUrl);
        let params = this._getAjaxParams(ajaxParams, {method: 'POST', data: data});
        return this.request(url, params);
    }

    put(relativeUrl, data, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {method: 'PUT', data: data});
        return this.request(url, params);
    }

    request(relativeUrl, ajaxParams = {}) {
        let url = this._getUrl(relativeUrl);
        return this.ajax(url, ajaxParams);
    }

    ajax(url, ajaxParams = {}) {
        // Key
        let key = ajaxParams.method + '_' + url;
        // Already requesting, return existing promise
        if (this._jqXHRs[key]) {
            return this._jqXHRs[key];
        }
        // Ajax request
        let jqXHR = $.ajax(url, ajaxParams);
        // Always delete jqXHR ref
        jqXHR.always((jqXHR, textStatus) => {
            delete this._jqXHRs[key];
        });
        // return promise
        return this._jqXHRs[key];
    }

    dispose() {
        this._deleteReferences();
    }

    _getUrl(relativeUrl) {
        return path.join(this.baseUrl, relativeUrl);
    }

    _getAjaxParams(... ajaxParamObjs) {
        return _.defaults(... ajaxParamObjs, this.defaultAjaxParams);
    }

    _deleteReferences() {
        delete this._baseUrl;
        delete this._defaultAjaxParams;
        delete this._jqXHRs;
    }

}

// Store multitons
XHRService._instances = new Registry();
// Multiton getter
XHRService.at = function(baseUrl = '/', defaultAjaxParams) {
    baseUrl = path.normalize(baseUrl);
    // Instance exists?
    if (XHRService.exists(baseUrl)) {
        return XHRService._instances.get(baseUrl);
    }
    // Create new XHRService
    let reg = new XHRService(key, factory);
    // Register
    XHRService._instances.register(baseUrl, reg);
    // return
    return reg;
};
XHRService.exists = function(baseUrl) {
    baseUrl = path.normalize(baseUrl);
    return XHRService._instances.isRegistered(baseUrl);
};

/**
 * JSONService
 */
export class JSONService extends XHRService {

    constructor(baseUrl = '/', defaultAjaxParams) {
        super(baseUrl, _.defaults(defaultAjaxParams, {
            dataType: 'json',
            contentType: 'application/json',
            processData: false 
        }));
        // http://www.jsonrpc.org/specification
        this._version = '2.0';
    }

    get version() {
        return this._version;
    }
    set version(value) {
        this._version = value;
    }

    rpc(rpcMethod, id, params, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {
            method: this._guessRequestMethod(rpcMethod, id, params),
            data: this._getRPCData(rpcMethod, id, params)
        });
        return this.request(relativeUrl, ajaxParams);
    }

    // {"jsonrpc": "2.0", "method": "user.get", "id": 12345}
    // {"jsonrpc": "2.0", "method": "diff", "params": [42, 23]}
    // {"jsonrpc": "2.0", "method": "divide", "params": {"dividend": 42, "divisor": 23}}
    _getRPCData(method, id, params) {
        let rpcdata = {method, params, jsonrpc: this.version};
        if (!_.isUndefined(id)) {
            rpcdata.id = id;
        }
        return rpcdata;
    }

    _guessRequestMethod(method, id, params) {
        if (_.includes(method, '.create')) {
            return 'POST';
        }
        if (_.includes(method, '.update')) {
            return 'PUT';
        }
        if (_.includes(method, '.delete')) {
            return 'DELETE';
        }
        return 'GET';
    }

    _getAjaxParams(... ajaxParamObjs) {
        let params = super._getAjaxParams(... ajaxParamObjs);
        // if POST or PUT, stringify json data
        if (params.hasOwnProperty('data') && ['POST', 'PUT'].indexOf(params.method) !== -1) {
            params.data = JSON.stringify(params.data);
        }
        return params;
    }

}
// Multiton getter
JSONService.at = function(baseUrl = '/', defaultAjaxParams) {
    return XHRService.at(baseUrl, defaultAjaxParams);
};
JSONService.exists = function(baseUrl) {
    return XHRService.exists(baseUrl);
};

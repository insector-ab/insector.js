import $ from 'jquery';
import _ from 'lodash';
import JSON from 'JSON2';
import {systemErrorHandler} from 'insectorjs/helpers';
/*

    this.xhrController = new XHRController(this.model);

    this.xhrController.whenGet('/customer/1234').done((data) => {
        this.model.customer.update(data.customer);
    });

 */

export class XHRController {

    constructor(model) {
        // public
        this.cid = _.uniqueId('xhrcontroller');
        this._model = model;
        this._xhrs = {};
    }

    get model() {
        return this._model;
    }

    set model(value) {
        this._model = value;
    }

    whenGet(url, ajaxParams = {}) {
        return this.when(url, _.assign({
            method: 'GET',
            dataType: 'json'
        }, ajaxParams));
    }

    whenDelete(url, ajaxParams = {}) {
        return this.whenGet(url, _.assign({
            method: 'DELETE'
        }, ajaxParams));
    }

    whenPost(url, data, ajaxParams = {}) {
        return this.when(url, _.assign({
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        }, ajaxParams));
    }

    whenPut(url, data, ajaxParams = {}) {
        return this.whenPost(url, data, _.assign({
            method: 'PUT'
        }, ajaxParams));
    }

    when(url, ajaxObj = {}) {
        console.log(ajaxObj.method, url, ajaxObj.data);
        // Key
        let key = ajaxObj.method + '_' + url;
        // Already getting, return existing promise
        if (this._xhrs[key]) {
            return this._xhrs[key];
        }
        // Fetching
        this.model.isFetching = true;
        // Ajax request
        this._xhrs[key] = $.ajax(url, _.assign(ajaxObj, {
            complete: (jqXHR, textStatus) => {
                // Delete ref
                delete this._xhrs[key];
                // Not fetching
                this.model.isFetching = false;
            }
        }));
        // Fail
        this._xhrs[key].fail((jqXHR, textStatus) => {
            systemErrorHandler(jqXHR, textStatus);
        });
        // return promise
        return this._xhrs[key];
    }

    dispose() {
        this._deleteReferences();
    }

    _deleteReferences() {
        delete this._model;
        delete this._xhrs;
    }

}

// --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
// <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
export class JSONRPCController extends XHRController {

    // ADD general Error handling

    constructor(model, apiBaseRoute) {
        super(model);
        // http://www.jsonrpc.org/specification
        this._version = '2.0';
    }

    getRPCCallData(method, id, params) {
        // {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
        // or
        // {"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}
        let rpcdata = {
            jsonrpc: this._version,
            method: method,
            params: params

        };
        if (id) {
            rpcdata.id = id;
        }
        return rpcdata;
    }

    whenGet(apiUrl, method, id, params = {}, ajaxParams = {}) {
        return this.when(apiUrl, _.assign({
            method: 'GET',
            dataType: 'json',
            data: this.getRPCCallData(method, id, params)
        }, ajaxParams));
    }

    whenDelete(apiUrl, method, id, params = {}, ajaxParams = {}) {
        return this.whenGet(apiUrl, method, id, params, _.assign({
            method: 'DELETE'
        }, ajaxParams));
    }

    whenPost(apiUrl, method, id, params = {}, ajaxParams = {}) {
        return this.when(apiUrl, _.assign({
            method: 'POST',
            data: JSON.stringify(this.getRPCCallData(method, id, params)),
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        }, ajaxParams));
    }

    whenPut(apiUrl, method, id, params = {}, ajaxParams = {}) {
        return this.whenPost(apiUrl, method, id, params, _.assign({
            method: 'PUT'
        }, ajaxParams));
    }

}

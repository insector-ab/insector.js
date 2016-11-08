import $ from 'jquery';
import _ from 'lodash';
import JSON from 'JSON2';
import {systemErrorHandler} from 'insectorjs/helpers';
/*

    this._xhrController = new XHRController(this.model);

    this._xhrController.whenGet('/customer/1234').done((data) => {
        this.model.customer.update(data.customer);
    });

 */

export default class XHRController {

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

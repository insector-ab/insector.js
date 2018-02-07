/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import uniqueId from 'lodash.uniqueid';
import path from 'path';

import {addConstantsToClass} from 'insector-utils';

/**
 * XHRService
 */
export class XHRService {

  constructor(baseUrl = '/', defaultRequestParams = {}) {
    // public
    this.cid = uniqueId('service');
    this._baseUrl = baseUrl;
    this._defaultRequestParams = defaultRequestParams;
  }

  get baseUrl() {
    return this._baseUrl;
  }
  set baseUrl(value) {
    this._baseUrl = path.normalize(value);
  }

  get defaultRequestParams() {
    return this._defaultRequestParams;
  }

  get(relativeUrl, requestParams = {}) {
    const params = this._getRequestParams(requestParams, {method: 'GET'});
    return this.request(relativeUrl, params);
  }

  deconste(relativeUrl, requestParams = {}) {
    const params = this._getRequestParams(requestParams, {method: 'DELETE'});
    return this.request(relativeUrl, params);
  }

  post(relativeUrl, data, requestParams = {}) {
    const params = this._getRequestParams(requestParams, {method: 'POST', body: data});
    return this.request(relativeUrl, params);
  }

  put(relativeUrl, data, requestParams = {}) {
    const params = this._getRequestParams(requestParams, {method: 'PUT', body: data});
    return this.request(relativeUrl, params);
  }

  request(relativeUrl, requestParams = {}) {
    // Get url
    const url = this._getUrl(relativeUrl);
    // Fetch API, returns promise
    return window.fetch(url, requestParams);
  }

  dispose() {
    this._deleteReferences();
  }

  _getUrl(relativeUrl) {
    return path.join(this.baseUrl, relativeUrl);
  }

  _getRequestParams(...requestParamObjs) {
    return Object.assign({}, this.defaultRequestParams, ...requestParamObjs);
  }

  _getResolveValue(request) {
    return request.responseText;
  }

  _deleteReferences() {
    delete this._baseUrl;
    delete this._defaultRequestParams;
  }

}

// Store multitons
XHRService._instances = new Map();
// Multiton getter
XHRService.get = function(baseUrl = '/', defaultRequestParams, Constructor) {
  baseUrl = path.normalize(baseUrl);
  // Instance exists?
  if (XHRService._instances.has(baseUrl)) {
    return XHRService._instances.get(baseUrl);
  }
  // Create new XHRService
  Constructor = Constructor || XHRService;
  const service = new Constructor(baseUrl, defaultRequestParams);
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
export class JSONService extends XHRService {

  constructor(baseUrl = '/', defaultRequestParams = {}) {
    // Default headers
    const headers = new window.Headers({
      'Content-Type': 'application/json; charset=UTF-8'
    });
    // Super
    super(baseUrl, Object.assign({headers}, defaultRequestParams));
    // http://www.jsonrpc.org/specification
    this._version = '2.0';
  }

  get version() {
    return this._version;
  }
  set version(value) {
    this._version = value;
  }

  request(...args) {
    return super.request(...args).then(response => response.json());
  }

  rpc(rpcMethod, params, requestParams = {}) {
    requestParams = this._getRequestParams(requestParams, {
      method: 'POST',
      body: this._getRPCData(rpcMethod, params)
    });
    return this.request('', requestParams);
  }

  // {"jsonrpc": "2.0", "id": 345, "method": "user.get", params: {id: 163886}}
  // {"jsonrpc": "2.0", "id": 346, "method": "diff", "params": [42, 23]}
  // {"jsonrpc": "2.0", "id": 347, "method": "divide", "params": {"dividend": 42, "divisor": 23}}
  _getRPCData(method, params) {
    return {
      method,
      params,
      jsonrpc: this.version,
      id: uniqueId('rpc')
    };
  }

  _getRequestParams(...requestParamObjs) {
    const params = super._getRequestParams(...requestParamObjs);
    // if POST or PUT, stringify json data
    if (params.body && ['POST', 'PUT'].includes(params.method)) {
      params.body = JSON.stringify(params.body);
    }
    return params;
  }

}
// Multiton getter
JSONService.at = function(baseUrl = '/', defaultRequestParams) {
  return XHRService.at(baseUrl, defaultRequestParams, JSONService);
};

/**
 * JSONRPCErrorCode
 * -32700                Parse error            Invalid JSON was received by the server.
 *                                              An error occurred on the server while parsing the JSON text.
 * -32600                Invalid Request        The JSON sent is not a valid Request object.
 * -32601                Method not found       The method does not exist / is not available.
 * -32602                Invalid params         Invalid method parameter(s).
 * -32603                Internal error         Internal JSON-RPC error.
 * -32000 to -32099      Server error           Reserved for implementation-defined server-errors.
 */
export class JSONRPCErrorCode {}
addConstantsToClass(JSONRPCErrorCode, {
  INVALID_JSON: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR: -32000,
  VALIDATION_ERROR: -32010
});

/**
 * JSONRPCError
 */
export class JSONRPCError {

  constructor(id, code, message, data) {
    this.id = id;
    this.errorCode = code;
    this.errorMessage = message;
    this.errorData = data;
  }

}

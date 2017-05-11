'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultValidators = exports.FormInputModel = exports.AbstractFormModel = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isundefined');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.result');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.frompairs');

var _lodash10 = _interopRequireDefault(_lodash9);

var _lodash11 = require('lodash.findindex');

var _lodash12 = _interopRequireDefault(_lodash11);

var _mozy = require('mozy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AbstractFormModel
 */
var AbstractFormModel = exports.AbstractFormModel = function (_Model) {
    _inherits(AbstractFormModel, _Model);

    function AbstractFormModel() {
        _classCallCheck(this, AbstractFormModel);

        return _possibleConstructorReturn(this, (AbstractFormModel.__proto__ || Object.getPrototypeOf(AbstractFormModel)).apply(this, arguments));
    }

    _createClass(AbstractFormModel, [{
        key: '_validate',


        /**
         * runs validation methods for given value
         * @param  {[type]} value       value to validate
         * @param  {[type]} validations array of values or single value
         *                              value: validationKeyString or {key: validationKeyString, args: [1,2,3]}
         * @param  {[type]} model       only used when validation is resolved (result, model)
         * @param  {[type]} context     context which is required for validation methods (usually Controller)
         */
        value: function _validate(value, validations, model, context, customValidators) {
            var _this2 = this;

            // to array
            if (validations && !Array.isArray(validations)) {
                validations = [validations];
            }
            // resolve when validation complete
            var $deferred = _jquery2.default.Deferred();
            // run validation methods
            if (validations) {
                var i = 0;
                var il = validations.length;
                var validationKey = void 0,
                    validationMethod = void 0,
                    validationArgs = void 0;
                // chained validation, keeps validating until no more keys are found
                var validateNext = function validateNext() {
                    if ((0, _lodash2.default)(validations[i])) {
                        // plain object
                        // expects object {key: 'validation key', args: [1, 2, 3]}
                        validationKey = validations[i].key;
                        validationArgs = validations[i].args || [];
                    } else {
                        // else handle as string
                        validationKey = validations[i];
                        validationArgs = [];
                    }
                    validationMethod = _this2._getValidationMethod(validationKey, customValidators);
                    _this2._doValidate.apply(_this2, [value, validationMethod, model, context].concat(_toConsumableArray(validationArgs))).done(function (result, model) {
                        // if valid
                        if (result) {
                            i++;
                            // more to validate?
                            if (i < il) {
                                validateNext();
                            } else {
                                // validation done
                                $deferred.resolve(true, model);
                            }
                        } else {
                            // did not validate
                            $deferred.resolve(false, model);
                        }
                    });
                };
                // start validation
                validateNext();
            } else {
                // no validation set
                $deferred.resolve(true, model);
            }
            return $deferred;
        }
    }, {
        key: '_getValidationMethod',
        value: function _getValidationMethod(validationKey, customValidators) {
            var methods = Object.assign({}, defaultValidators, customValidators || {});
            if (typeof methods[validationKey] !== 'function') {
                throw new Error('Validation method not found for: "' + validationKey + '"');
            }
            return methods[validationKey];
        }

        /**
         * validate
         * @param  {[type]} value      [description]
         * @param  {[type]} validation [description]
         * @param  {[type]} context    [description]
         * @return {[type]}            [description]
         */

    }, {
        key: '_doValidate',
        value: function _doValidate(value, validationMethod, model, context) {
            var $deferred = _jquery2.default.Deferred();
            // no validation, resolve
            if (!(0, _lodash4.default)(validationMethod)) {
                $deferred.resolve(true, model);
                return $deferred;
            }
            // validate

            for (var _len = arguments.length, validationArgs = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
                validationArgs[_key - 4] = arguments[_key];
            }

            var result = validationMethod.apply(undefined, [value, model, context].concat(validationArgs));

            // no XHR object, value validated, resolve
            if (!this._isXHRObject(result)) {
                $deferred.resolve(result, model);
                return $deferred;
            }

            // result is ajax promise, wait until promise is done
            result.done(function (data, textStatus, jqXHR) {
                if (!data.hasOwnProperty('result')) {
                    throw new Error('Remote validation method must return {result: result}');
                }
                $deferred.resolve(data.result, model);
            });
            return $deferred;
        }

        /**
         * isXHRObject
         * @param  {[type]}  value [description]
         * @return {Boolean}       [description]
         */

    }, {
        key: '_isXHRObject',
        value: function _isXHRObject(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.done === 'function' && typeof value.abort === 'function';
        }
    }]);

    return AbstractFormModel;
}(_mozy.Model);

/**
 * FormModel
 */


var FormModel = function (_AbstractFormModel) {
    _inherits(FormModel, _AbstractFormModel);

    function FormModel(data) {
        var _ref;

        _classCallCheck(this, FormModel);

        // Make sure inputs have identity
        if (data.hasOwnProperty('inputs')) {
            data.inputs.forEach(function (obj) {
                obj.identity = obj.identity || FormInputModel.identity;
            });
        }
        // super

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        return _possibleConstructorReturn(this, (_ref = FormModel.__proto__ || Object.getPrototypeOf(FormModel)).call.apply(_ref, [this, data].concat(args)));
    }

    _createClass(FormModel, [{
        key: 'addInput',
        value: function addInput(formInput) {
            this.inputs.add(formInput);
            this.dispatchChange('inputs');
            return this;
        }
    }, {
        key: 'hasInput',
        value: function hasInput(name) {
            return !!(0, _lodash12.default)(this.inputs.items, { name: name });
        }
    }, {
        key: 'getInput',
        value: function getInput(name) {
            var inputIndex = (0, _lodash12.default)(this.inputs.items, { name: name });
            if (inputIndex === -1) {
                throw new Error('FormInputModel not found for: ' + name);
            }
            return this.inputs.at(inputIndex);
        }
    }, {
        key: 'getInputValue',
        value: function getInputValue(name) {
            return this.getInput(name).value;
        }
    }, {
        key: 'setInputValue',
        value: function setInputValue(name, value) {
            this.getInput(name).value = value;
        }
    }, {
        key: 'validate',
        value: function validate(context, customValidators) {
            var _this4 = this;

            // inititate input validation
            var deferreds = this.inputs.map(function (input) {
                return input.validate(context, customValidators);
            });
            // when inputs validated
            var $deferred = _jquery2.default.Deferred();
            _jquery2.default.when.apply(_jquery2.default, _toConsumableArray(deferreds)).done(function () {
                // run form validation
                _this4._validate(_this4, _this4.validation, _this4, context, customValidators).done(function (result, form) {
                    var validationResult = _this4.isInputsValid && result;
                    // inputs valid & did validate, set validation string
                    if (validationResult) {
                        _this4.validationString = _this4.getInputsValidationString();
                    }
                    // resolve
                    $deferred.resolve(validationResult, _this4);
                });
            });
            return $deferred;
        }
    }, {
        key: 'getInputsValidationString',
        value: function getInputsValidationString() {
            return this.inputs.map(function (item) {
                var valstr = item.name + ((0, _lodash6.default)(item.validatedValue) ? '' : ':' + item.validatedValue);
                return valstr;
            }).join(',');
        }
    }, {
        key: 'getInputsValueString',
        value: function getInputsValueString() {
            return this.inputs.map(function (item) {
                return item.name + ':' + item.value;
            }).join(',');
        }
    }, {
        key: 'reset',
        value: function reset(data) {
            var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            // Just reset inputs
            this.inputs.forEach(function (input) {
                input.reset();
            });
        }
    }, {
        key: '_getDefaults',
        value: function _getDefaults() {
            var d = _get(FormModel.prototype.__proto__ || Object.getPrototypeOf(FormModel.prototype), '_getDefaults', this).call(this);
            d.identity = FormModel.identity;
            d.inputs = [];
            return d;
        }
    }, {
        key: 'validation',
        get: function get() {
            return this.get('validation');
        },
        set: function set(value) {
            this.set('validation', value);
        }
    }, {
        key: 'inputs',
        get: function get() {
            return _mozy.modelRegistry.getModelList(this.rawInputs, this.cid + '.inputs');
        }
    }, {
        key: 'rawInputs',
        get: function get() {
            return this.get('inputs');
        }
    }, {
        key: 'inputValues',
        get: function get() {
            return (0, _lodash10.default)(this.inputs.map(function (input) {
                return [input.name, input.value];
            }));
        }
    }, {
        key: 'isValid',
        get: function get() {
            return this.validationString === this.getInputsValueString();
        }
    }, {
        key: 'isInputsValid',
        get: function get() {
            return this.getInputsValidationString() === this.getInputsValueString();
        }
    }, {
        key: 'validationString',
        get: function get() {
            return this.get('validationString');
        },
        set: function set(value) {
            this.set('validationString', value);
        }
    }]);

    return FormModel;
}(AbstractFormModel);

exports.default = FormModel;

FormModel.identity = 'form.FormModel';

/**
 * FormInputModel
 */

var FormInputModel = exports.FormInputModel = function (_AbstractFormModel2) {
    _inherits(FormInputModel, _AbstractFormModel2);

    function FormInputModel() {
        _classCallCheck(this, FormInputModel);

        return _possibleConstructorReturn(this, (FormInputModel.__proto__ || Object.getPrototypeOf(FormInputModel)).apply(this, arguments));
    }

    _createClass(FormInputModel, [{
        key: 'validate',
        value: function validate(context, customValidators) {
            var _this6 = this;

            // unset error code
            this.unset('errorCode');
            var $deferred = this._validate(this.value, this.validation, this, context, customValidators);
            $deferred.done(function (result, input) {
                // if valid, set validatedValue
                if (result) {
                    _this6.set('validatedValue', input.value);
                }
                _this6.set('isValidated', true);
            });
            return $deferred;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.unset('value');
            this.unset('isValidated');
            this.unset('validatedValue');
            this.unset('errorCode');
        }
    }, {
        key: '_getDefaults',
        value: function _getDefaults() {
            var d = _get(FormInputModel.prototype.__proto__ || Object.getPrototypeOf(FormInputModel.prototype), '_getDefaults', this).call(this);
            d.identity = FormInputModel.identity;
            return d;
        }
    }, {
        key: 'name',
        get: function get() {
            return this.get('name');
        }
    }, {
        key: 'validation',
        get: function get() {
            return this.get('validation');
        },
        set: function set(value) {
            this.set('validation', value);
        }
    }, {
        key: 'defaultValue',
        get: function get() {
            return this.get('defaultValue');
        },
        set: function set(value) {
            return this.set('defaultValue');
        }
    }, {
        key: 'errorCode',
        get: function get() {
            return this.get('errorCode');
        },
        set: function set(value) {
            this.set('errorCode', value);
        }
    }, {
        key: 'validatedValue',
        get: function get() {
            return this.get('validatedValue');
        }
    }, {
        key: 'isValidated',
        get: function get() {
            return this.get('isValidated');
        }
    }, {
        key: 'isValid',
        get: function get() {
            return this.isValidated && this.has('validatedValue') && this.value === this.validatedValue;
        }
    }, {
        key: 'value',
        get: function get() {
            return this.get('value', (0, _lodash8.default)(this, 'defaultValue'));
        },
        set: function set(value) {
            this.unset('isValidated');
            this.unset('validatedValue');
            this.unset('errorCode');
            this.set('value', value);
        }
    }]);

    return FormInputModel;
}(AbstractFormModel);

FormInputModel.identity = 'form.FormInputModel';

/**
 * Reg models
 */
_mozy.modelIdentities.set(FormModel.identity, FormModel);
_mozy.modelIdentities.set(FormInputModel.identity, FormInputModel);

var defaultValidators = exports.defaultValidators = {

    required: function required(value, input, context) {
        if (!value) {
            input.errorCode = 'required';
            return false;
        }
        return true;
    },

    email: function email(value, input, context) {
        if (value && !/.+@.+\..+/.test(value)) {
            input.errorCode = 'invalidFormat';
            return false;
        }
        return true;
    },

    minChars: function minChars(value, input, context) {
        var limit = arguments.length <= 3 ? undefined : arguments[3];
        if (value && value.length < limit) {
            input.errorCode = 'minChars';
            return false;
        }
        return true;
    }

};
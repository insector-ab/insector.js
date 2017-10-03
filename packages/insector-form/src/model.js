import $ from 'jquery';
import isPlainObject from 'lodash.isplainobject';
import isFunction from 'lodash.isfunction';
import isUndefined from 'lodash.isundefined';
import result from 'lodash.result';
import fromPairs from 'lodash.frompairs';
import findIndex from 'lodash.findindex';
import {Model, modelIdentities, modelRegistry} from 'mozy';

/**
 * AbstractFormModel
 */
export class AbstractFormModel extends Model {

    /**
     * runs validation methods for given value
     * @param  {[type]} value       value to validate
     * @param  {[type]} validations array of values or single value
     *                              value: validationKeyString or {key: validationKeyString, args: [1,2,3]}
     * @param  {[type]} model       only used when validation is resolved (result, model)
     * @param  {[type]} context     context which is required for validation methods (usually Controller)
     */
    _validate(value, validations, model, context, customValidators) {
        // to array
        if (validations && !Array.isArray(validations)) {
            validations = [validations];
        }
        // resolve when validation complete
        let $deferred = $.Deferred();
        // run validation methods
        if (validations) {
            let i = 0;
            let il = validations.length;
            let validationKey, validationMethod, validationArgs;
            // chained validation, keeps validating until no more keys are found
            let validateNext = () => {
                if (isPlainObject(validations[i])) { // plain object
                    // expects object {key: 'validation key', args: [1, 2, 3]}
                    validationKey = validations[i].key;
                    validationArgs = validations[i].args || [];
                } else { // else handle as string
                    validationKey = validations[i];
                    validationArgs = [];
                }
                validationMethod = this._getValidationMethod(validationKey, customValidators);
                this._doValidate(value, validationMethod, model, context, ...validationArgs).done((result, model) => {
                    // if valid
                    if (result) {
                        i++;
                        // more to validate?
                        if (i < il) {
                            validateNext();
                        } else { // validation done
                            $deferred.resolve(true, model);
                        }
                    } else { // did not validate
                        $deferred.resolve(false, model);
                    }
                });
            };
            // start validation
            validateNext();
        } else { // no validation set
            $deferred.resolve(true, model);
        }
        return $deferred;
    }

    _getValidationMethod(validationKey, customValidators) {
        let methods = Object.assign({}, defaultValidators, customValidators || {});
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
    _doValidate(value, validationMethod, model, context, ...validationArgs) {
        let $deferred = $.Deferred();
        // no validation, resolve
        if (!isFunction(validationMethod)) {
            $deferred.resolve(true, model);
            return $deferred;
        }
        // validate
        let result = validationMethod(value, model, context, ...validationArgs);

        // no XHR object, value validated, resolve
        if (!this._isXHRObject(result)) {
            $deferred.resolve(result, model);
            return $deferred;
        }

        // result is ajax promise, wait until promise is done
        result.done((data, textStatus, jqXHR) => {
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
    _isXHRObject(value) {
        return typeof value === 'object' && typeof value.done === 'function' && typeof value.abort === 'function';
    }

}

/**
 * FormModel
 */
export default class FormModel extends AbstractFormModel {

    constructor(data, ...args) {
        // Make sure inputs have identity
        if (data.hasOwnProperty('inputs')) {
            data.inputs.forEach(obj => {
                obj.identity = obj.identity || FormInputModel.identity;
            });
        }
        // super
        super(data, ...args);
    }

    addInput(formInput) {
        this.inputs.push(formInput);
        this.dispatchChange('inputs');
        return this;
    }

    get validation() {
        return this.get('validation');
    }
    set validation(value) {
        this.set('validation', value);
    }

    get inputs() {
        return this.rawInputs.map(item => {
            return modelRegistry.getModel(item);
        });
    }

    get rawInputs() {
        return this.get('inputs');
    }

    get inputValues() {
        return fromPairs(this.inputs.map((input) => [input.name, input.value]));
    }

    get isValid() {
        return this.validationString === this.getInputsValueString();
    }

    get isInputsValid() {
        return this.getInputsValidationString() === this.getInputsValueString();
    }

    get validationString() {
        return this.get('validationString');
    }

    set validationString(value) {
        this.set('validationString', value);
    }

    hasInput(name) {
        return !!findIndex(this.inputs, {name: name});
    }

    getInput(name) {
        let inputIndex = findIndex(this.inputs, {name: name});
        if (inputIndex === -1) {
            throw new Error('FormInputModel not found for: ' + name);
        }
        return this.inputs[inputIndex];
    }

    getInputValue(name) {
        return this.getInput(name).value;
    }

    setInputValue(name, value) {
        this.getInput(name).value = value;
    }

    validate(context, customValidators) {
        // inititate input validation
        let deferreds = this.inputs.map((input) => {
            return input.validate(context, customValidators);
        });
        // when inputs validated
        let $deferred = $.Deferred();
        $.when(...deferreds).done(() => {
            // run form validation
            this._validate(this, this.validation, this, context, customValidators).done((result, form) => {
                let validationResult = this.isInputsValid && result;
                // inputs valid & did validate, set validation string
                if (validationResult) {
                    this.validationString = this.getInputsValidationString();
                }
                // resolve
                $deferred.resolve(validationResult, this);
            });
        });
        return $deferred;
    }

    getInputsValidationString() {
        return this.inputs.map((item) => {
            let valstr = item.name + (isUndefined(item.validatedValue) ? '' : ':' + item.validatedValue);
            return valstr;
        }).join(',');
    }

    getInputsValueString() {
        return this.inputs.map((item) => {
            return item.name + ':' + item.value;
        }).join(',');
    }

    reset(data, flags = 0) {
        // Just reset inputs
        this.inputs.forEach(input => {
            input.reset();
        });
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = FormModel.identity;
        d.inputs = [];
        return d;
    }

}
FormModel.identity = 'form.FormModel';

/**
 * FormInputModel
 */
export class FormInputModel extends AbstractFormModel {

    get name() {
        return this.get('name');
    }

    get validation() {
        return this.get('validation');
    }
    set validation(value) {
        this.set('validation', value);
    }

    get defaultValue() {
        return this.get('defaultValue');
    }
    set defaultValue(value) {
        return this.set('defaultValue');
    }

    get errorCode() {
        return this.get('errorCode');
    }
    set errorCode(value) {
        this.set('errorCode', value);
    }

    get validatedValue() {
        return this.get('validatedValue');
    }

    get isValidated() {
        return this.get('isValidated');
    }

    get isValid() {
        return this.isValidated && this.has('validatedValue') && this.value === this.validatedValue;
    }

    get value() {
        return this.get('value', result(this, 'defaultValue'));
    }
    set value(value) {
        this.unset('isValidated');
        this.unset('validatedValue');
        this.unset('errorCode');
        this.set('value', value);
    }

    validate(context, customValidators) {
        // unset error code
        this.unset('errorCode');
        let $deferred = this._validate(this.value, this.validation, this, context, customValidators);
        $deferred.done((result, input) => {
            // if valid, set validatedValue
            if (result) {
                this.set('validatedValue', input.value);
            }
            this.set('isValidated', true);
        });
        return $deferred;
    }

    reset() {
        this.unset('value');
        this.unset('isValidated');
        this.unset('validatedValue');
        this.unset('errorCode');
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = FormInputModel.identity;
        return d;
    }

}
FormInputModel.identity = 'form.FormInputModel';

/**
 * Reg models
 */
modelIdentities.set(FormModel.identity, FormModel);
modelIdentities.set(FormInputModel.identity, FormInputModel);

export const defaultValidators = {

    required: function(value, input, context, ...args) {
        if (!value) {
            input.errorCode = 'required';
            return false;
        }
        return true;
    },

    email: function(value, input, context, ...args) {
        if (value && !/.+@.+\..+/.test(value)) {
            input.errorCode = 'invalidFormat';
            return false;
        }
        return true;
    },

    minChars: function(value, input, context, ...args) {
        const limit = args[0];
        if (value && value.length < limit) {
            input.errorCode = 'minChars';
            return false;
        }
        return true;
    },

    number: function(value, input, context, ...args) {
        if (value && !/^\d+(\.\d+)?$/.test(value)) {
            input.errorCode = 'NaN';
            return false;
        }
        return true;
    }

};

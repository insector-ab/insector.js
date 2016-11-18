import $ from 'jquery';
import _ from 'lodash';
import {Model, modelIdentities, modelRegistry} from 'guins/model';
import assert from 'assert';
import {underscored} from 'underscore.string';

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
        if (validations && !_.isArray(validations)) {
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
                if (_.isPlainObject(validations[i])) { // plain object
                    // expects object {key: 'validation key', args: [1, 2, 3]}
                    validationKey = validations[i].key;
                    validationArgs = validations[i].args || [];
                } else { // else handle as string
                    validationKey = validations[i];
                    validationArgs = [];
                }
                validationMethod = this._getValidationMethod(validationKey, customValidators);
                this._doValidate(value, validationMethod, model, context, ... validationArgs).done((result, model) => {
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
        let methods = _.assign({}, defaultValidators, customValidators || {});
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
    _doValidate(value, validationMethod, model, context, ... validationArgs) {
        let $deferred = $.Deferred();
        // no validation, resolve
        if (!_.isFunction(validationMethod)) {
            $deferred.resolve(true, model);
            return $deferred;
        }
        // validate
        let result = validationMethod(value, model, context, ... validationArgs);

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
export class FormModel extends AbstractFormModel {

    constructor(data) {
        let inputItems;
        if (data) {
            inputItems = data.inputItems ? data.inputItems : null;
            delete data.inputItems;
        }
        super(data);
        this.createInputs(inputItems);
    }

    addInput(formInput) {
        assert(formInput instanceof FormInputModel);
        this.inputs.add(formInput);
        this.dispatchChange('inputs');
        return formInput;
    }

    createInputs(items) {
        if (!items) {
            return;
        }
        for (let i = 0, il = items.length; i < il; i++) {
            this.createInput(items[i]);
        }
    }

    createInput(data) {
        let input = this.modelRegistry.getInstance(data, FormInputModel);
        return this.addInput(input);
    }

    /**
     * get modelRegistry
     * Defaults to modelRegistry, override if needed
     */
    get modelRegistry() {
        return modelRegistry;
    }

    get validation() {
        return this.get('validation');
    }
    set validation(value) {
        this.set('validation', value);
    }

    get inputs() {
        return this.getInstanceList('inputs', this.get('inputs'), FormInputModel, this.modelRegistry);
    }

    get inputValues() {
        return this.getInputValues();
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

    getInputValues(underscoreKeys = false) {
        let values = {};
        let key;
        this.inputs.each((item) => {
            if (underscoreKeys) {
                key = underscored(item.name);
            } else {
                key = item.name;
            }
            values[key] = item.value;
        });
        return values;
    }

    hasInput(name) {
        return Boolean(this.inputs.find({name: name}));
    }

    getInput(name) {
        let input = this.inputs.find({name: name});
        if (!input) {
            throw Error('FormInputModel not found for: ' + name);
        }
        return input;
    }

    getInputValue(name) {
        return this.getInput(name).value;
    }

    setInputValue(name, value) {
        this.getInput(name).value = value;
    }

    reset() {
        this.unset('validationString');
        this.inputs.each((item) => {
            item.reset();
        });
    }

    validate(context, customValidators) {
        // inititate input validation
        let deferreds = this.inputs.map((item) => {
            return item.validate(context, customValidators);
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
            let valstr = item.name + ':' + item.validatedValue;
            return valstr;
        }).join(',');
    }

    getInputsValueString() {
        return this.inputs.map((item) => {
            return item.name + ':' + item.value;
        }).join(',');
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
        let val = null;
        if (this.has('value')) {
            val = this.get('value');
        } else if (this.defaultValue) {
            // if method call and return value
            if (_.isFunction(this.defaultValue)) {
                val = this.defaultValue();
            } else {
                val = this.defaultValue;
            }
        }
        // don't return undefined, no value = null
        return !_.isUndefined(val) ? val : null;
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
modelIdentities.register(FormModel.identity, FormModel);
modelIdentities.register(FormInputModel.identity, FormInputModel);

export let defaultValidators = {

    required: function(value, input, context, ... args) {
        if (!value) {
            input.errorCode = 'required';
            return false;
        }
        return true;
    },

    email: function(value, input, context, ... args) {
        if (value && !/.+@.+\..+/.test(value)) {
            input.errorCode = 'invalidFormat';
            return false;
        }
        return true;
    },

    minChars: function(value, input, context, ... args) {
        let limit = args[0];
        if (value && value.length < limit) {
            input.errorCode = 'minChars';
            return false;
        }
        return true;
    }

};

import isPlainObject from 'lodash.isplainobject';
import isUndefined from 'lodash.isundefined';
import result from 'lodash.result';
import fromPairs from 'lodash.frompairs';
import findIndex from 'lodash.findindex';
import {Model, modelIdentities, modelRegistry} from 'mozy';
import uuidValidate from 'uuid-validate';

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
        const validatorMethods = Object.assign({}, defaultValidators, customValidators || {});
        return new Promise((resolve, reject) => {
            // run validation methods
            if (validations) {
                let i = 0;
                const il = validations.length;
                let key, args;
                // chained validation, keeps validating until no more keys are found
                const validateNext = () => {
                    if (isPlainObject(validations[i])) { // plain object
                        // expects object {key: 'validation key', args: [1, 2, 3]}
                        key = validations[i].key;
                        args = validations[i].args || [];
                    // else handle as string
                    } else {
                        key = validations[i];
                        args = [];
                    }
                    // validator method not found
                    if (typeof validatorMethods[key] !== 'function') {
                        throw new Error(`Validation method not found for: ${key}`);
                    }
                    // validate
                    validatorMethods[key](value, model, context, ...args)
                        .then(validatedValue => {
                            i++;
                            // no more to validate?
                            i < il ? validateNext() : resolve(validatedValue);
                        })
                        // did not validate
                        .catch(err => {
                            reject(err);
                        });
                };
                // start validation
                validateNext();
            // no validation set
            } else {
                resolve(value);
            }
        });
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

    get formValidation() {
        // add form default validation to array
        let validation = ['form'];
        if (Array.isArray(this.validation)) {
            return validation.concat(this.validation);
        } else if (this.validation) {
            return validation.concat([this.validation]);
        }
        return validation;
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
        return new Promise((resolve, reject) => {
            // validate inputs
            Promise.all(this.inputs.map(input => {
                return input.validate(context, customValidators);
            }))
                // validate form
                .then(() => {
                    // run form validation
                    this._validate(this, this.formValidation, this, context, customValidators)
                        .then((validatedValue) => {
                            this.validationString = validatedValue;
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
        });
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
        // validate input
        return this._validate(this.value, this.validation, this, context, customValidators)
            .then((value) => {
                this.set('validatedValue', value);
                this.set('isValidated', true);
            })
            .catch(err => {
                this.errorCode = err.message;
                this.set('isValidated', true);

            });
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

    form: function(form, input, context, ...args) {
        return new Promise((resolve, reject) => {
            // is inputs valid
            if (!form.isInputsValid) {
                reject(new Error('invalidInput'));
            }
            resolve(form.getInputsValidationString());
        });
    },

    required: function(value, input, context, ...args) {
        return new Promise((resolve, reject) => {
            if (!value) {
                reject(new Error('required'));
            }
            resolve(value);
        });
    },

    email: function(value, input, context, ...args) {
        return new Promise((resolve, reject) => {
            if (value && !/.+@.+\..+/.test(value)) {
                reject(new Error('invalidFormat'));
            }
            resolve(value);
        });
    },

    minChars: function(value, input, context, ...args) {
        return new Promise((resolve, reject) => {
            const limit = args[0];
            if (value && value.length < limit) {
                reject(new Error('minChars'));
            }
            resolve(value);
        });
    },

    number: function(value, input, context, ...args) {
        return new Promise((resolve, reject) => {
            if (value && !/^-?\d+(\.\d+)?$/.test(value)) {
                reject(new Error('NaN'));
            }
            resolve(value);
        });
    },

    uuid: function(value, input, context, ...args) {
        return new Promise((resolve, reject) => {
            if (!uuidValidate(value, 4)) {
                reject(new Error('invalidFormat'));
            }
            resolve(value);
        });
    }

};

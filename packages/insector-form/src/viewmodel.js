import {Model, modelIdentities} from 'mozy';
import {addConstantsToClass} from 'insector-utils';
import ExtendableError from 'es6-error';

/**
 * FormViewModel
 */
export default class FormViewModel extends Model {

    get(property, defaultValue) {
        if (!this.has(property) && typeof defaultValue === 'undefined') {
            return super.get(`default:${property}`);
        }
        return super.get(property, defaultValue);
    }

    unset(key, flags) {
        super.unset(key, flags);
        super.unset(`validation:${key}`, {setSilent: true});
        if (this.hasChanged(`validation:${key}`)) {
            this.dispatchChange('validation');
        }
    }

    setValidation(key, value) {
        if (typeof key === 'undefined') {
            throw new TypeError('setValidation "key" undefined.');
        }
        this.set(`validation:${key}`, value, {setSilent: true});
        if (this.hasChanged(`validation:${key}`)) {
            this.dispatchChange('validation');
        }
    }

    unsetValidation(key) {
        this.unset(`validation:${key}`, {setSilent: true});
        if (this.hasChanged(`validation:${key}`)) {
            this.dispatchChange('validation');
        }
    }

    hasValidation(key) {
        return this.has(`validation:${key}`);
    }

    getValidationStatus(key) {
        return this.get(`validation:${key}`, {}).status || ValidationStatus.NONE;
    }

    isValid(key) {
        if (this.hasValidation(key)) {
            return this.getValidationStatus(key) === ValidationStatus.VALID;
        };
    }

    isInvalid(key) {
        if (this.hasValidation(key)) {
            return this.getValidationStatus(key) === ValidationStatus.INVALID;
        };
    }

    isChecking(key) {
        if (this.hasValidation(key)) {
            return this.getValidationStatus(key) === ValidationStatus.CHECKING;
        };
    }

    isCheckingFailed(key) {
        if (this.hasValidation(key)) {
            return this.getValidationStatus(key) === ValidationStatus.CHECKING_FAILED;
        };
    }

    isSubmittable(key) {
        return !!this.isValid(key) && this.isReady(key) && !this.isComplete(key) && !this.isSubmitted(key);
    }

    /**
     * FormStatus getters
     */
    isReady(key) {
        return this.get(key) === FormStatus.READY;
    }
    isSubmitted(key) {
        return this.get(key) === FormStatus.SUBMITTED;
    }
    isFailed(key) {
        return this.get(key) === FormStatus.FAILED;
    }
    isComplete(key) {
        return this.get(key) === FormStatus.COMPLETE;
    }

    getError(key) {
        if (this.hasError(key)) {
            return this.get(`validation:${key}`, {}).error;
        }
    }

    getErrors() {
        return Object.keys(this.getDataReference()).filter(key => key.substring(0, 11) === 'validation:' && !!this.get(key).error).map(key => this.get(key).error);
    }

    getErrorMessage(key) {
        if (this.hasError(key)) {
            return this.get(`validation:${key}`, {}).error.message;
        }
    }

    getErrorCode(key) {
        if (this.hasError(key)) {
            return this.get(`validation:${key}`, {}).error.code;
        }
    }

    hasError(key) {
        return !!this.get(`validation:${key}`, {}).error;
    }

    getFeedback(key) {
        return this.getValidationStatus(key);
    }

    hasFeedback(key) {
        return this.getFeedback(key) !== ValidationStatus.NONE;
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = FormViewModel.identity;
        return d;
    }

}
FormViewModel.identity = 'insector.form.FormViewModel';

// ****** Identity & Registry *****

modelIdentities.set(FormViewModel.identity, FormViewModel);

/**
 * FormStatus
 */
export class FormStatus {}
addConstantsToClass(FormStatus, {
    READY: 'ready',
    SUBMITTED: 'submitted',
    COMPLETE: 'complete',
    FAILED: 'failed'
});

/**
 * ValidationStatus
 */
export class ValidationStatus {}
addConstantsToClass(ValidationStatus, {
    NONE: 'none',
    VALID: 'valid',
    INVALID: 'invalid',
    CHECKING: 'checking',
    CHECKING_FAILED: 'checking_failed'
});

export class ValidationError extends ExtendableError {

    constructor(message, code) {
        super(message);
        this.code = code;
    }

    get data() {
        return {
            code: this.code,
            message: this.message
        };
    }

}

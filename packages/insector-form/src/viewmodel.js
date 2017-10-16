import Model, {
    identities as modelIdentities,
    SET_SILENT
} from 'mozy/model';
import {ValidationStatus} from './constants';

/**
 * FormViewModel
 */
export default class FormViewModel extends Model {

    unset(key, flags) {
        super.unset(key, flags);
        super.unset(`validation:${key}`, SET_SILENT);
        if (this.hasChanged(`validation:${key}`)) {
            this.dispatchChange('validation');
        }
    }

    setValidation(key, value) {
        this.set(`validation:${key}`, value, SET_SILENT);
        if (this.hasChanged(`validation:${key}`)) {
            this.dispatchChange('validation');
        }
    }

    unsetValidation(key) {
        this.unset(`validation:${key}`, SET_SILENT);
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

    isCheckingFailed(key) {
        if (this.hasValidation(key)) {
            return this.getValidationStatus(key) === ValidationStatus.CHECKING_FAILED;
        };
    }

    getError(key) {
        if (this.hasError(key)) {
            return this.get(`validation:${key}`, {}).error;
        }
    }

    getErrorMessage(key) {
        if (this.hasError(key)) {
            return this.get(`validation:${key}`, {}).error.message;
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

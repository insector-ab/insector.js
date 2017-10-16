import {addConstantsToClass} from 'insector-utils';

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

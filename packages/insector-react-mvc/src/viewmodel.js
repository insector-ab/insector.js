import Model, {UNSET_IF_FALSE} from 'mozy/model';

/**
 * ViewModel, for use with
 * ReactModule (/react/module.js)
 */
export default class ViewModel extends Model {

    constructor(...args) {
        super(...args);
        // Fetching flag
        this._isFetching = false;
    }

    get instanceKey() {
        return this.get('instanceKey');
    }
    set instanceKey(value) {
        this.set('instanceKey', value);
    }

    get initialized() {
        return this.get('initialized', false);
    }
    set initialized(value) {
        this.set('initialized', value, UNSET_IF_FALSE);
    }

    get isFetching() {
        return this._isFetching;
    }
    set isFetching(value) {
        if (value !== this._isFetching) {
            this._isFetching = value;
            this.dispatchChange('isFetching');
        }
    }

}

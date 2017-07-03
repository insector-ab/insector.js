import Model, {UNSET_IF_FALSE, SET_SILENT} from 'mozy/model';

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

    get activeView() {
        return this.get('activeView');
    }
    set activeView(value) {
        this.set('activeView', value, UNSET_IF_FALSE);
    }

    get activeViewProps() {
        return this.get('activeViewProps');
    }
    set activeViewProps(value) {
        this.set('activeViewProps', value, UNSET_IF_FALSE);
    }

    get previousActiveView() {
        return this._previousData['activeView'];
    }

    /**
     * getSubViewModel
     * @param {mozy.Model} ModelCls Constructor to instantiate
     * @param {String} instanceKey Key to set on parent model
     * @param {Object} data Constructor param
     * @return {mozy.Model} Model instance
     */
    getSubViewModel(ModelCls, instanceKey, data = {}) {
        // Get data
        const d = this.get(instanceKey, data);
        // Get model
        const m = new ModelCls(d);
        // Set instance key
        m.instanceKey = instanceKey;
        // store module instance data on parent Model
        this.set(instanceKey, m.getModelData(), SET_SILENT);
        // Return
        return m;
    }

}

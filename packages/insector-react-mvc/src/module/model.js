import {modelRegistry} from 'mozy';
import Model, {UNSET_IF_FALSE, SET_SILENT} from 'mozy/model';

/**
 * ModuleModel, for use with
 * ReactModule (/react/module.js)
 */
export default class ModuleModel extends Model {

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

    /**
     * getSubModuleModel
     * @param {mozy.Model} ModelCls Constructor to instantiate
     * @param {String} instanceKey Key to set on parent model
     * @param {Object} data Constructor param
     * @return {mozy.Model} Model instance
     */
    getSubModuleModel(ModelCls, instanceKey, data = {}) {
        // Get data
        const d = this.get(instanceKey, data);
        // Get model
        const m = modelRegistry.getModel(d, ModelCls);
        // Set instance key
        m.instanceKey = instanceKey;
        // store module instance data on parent Model
        this.set(instanceKey, m.getModelData(), SET_SILENT);
        // Return
        return m;
    }

}

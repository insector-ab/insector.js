import {Model, SetterFlag} from 'guins/model';

/**
 * ModuleModel, for use with
 * ReactModule (insectorjs/react/module.js)
 */
export default class ModuleModel extends Model {

    constructor(data, props) {
        super(data, props);
        // ref to module props
        this._props = props;
    }

    get props() {
        return this._props;
    }
    set props(value) {
        if (value !== this._props) {
            this._props = value;
            this.dispatchChange('props');
        }
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
        this.set('initialized', value, SetterFlag.UNSET_IF_FALSE);
    }

    removeFromParent() {
        let parent = this.props.parentModel;
        console.log('removeFromParent', parent, this.instanceKey, parent.has(this.instanceKey));
        if (parent && parent.has(this.instanceKey)) {
            parent.unset(this.instanceKey);
        }
    }

    _deleteReferences() {
        super._deleteReferences();
        delete this._props;
    }

}

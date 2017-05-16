import {mixin} from 'insector-utils';
import ModuleModel from '../module/model';
import {ActiveView} from '../mixins';

/**
 * AppModel
 */
export default class AppModel extends ModuleModel {

    constructor(data, props) {
        super(data, props);
        // Fetching flag
        this._isFetching = false;
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

// Adds 'activeView', 'activeViewProps', 'previousActiveView'
mixin(AppModel, ActiveView);

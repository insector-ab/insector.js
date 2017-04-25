import ModuleModel from 'insectorjs/module/model';
import {mixin} from 'insectorjs/utils';
import {ActiveView} from 'insectorjs/mixins';

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

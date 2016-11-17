import {Model, modelRegistry} from 'guins/model';
import ModuleModel from 'insectorjs/module/model';
import {nodeRegistry} from 'insectorjs/node/model';
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

    get systemRegistry() {
        return modelRegistry.getInstance(this.get('systemRegistry'));
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.systemRegistry = (new SystemRegistryModel()).data;
        return d;
    }

}

// Adds 'activeView', 'activeViewProps', 'previousActiveView'
mixin(AppModel, ActiveView);

/**
 * SystemRegistryModel
 */
export class SystemRegistryModel extends Model {

    get currentUser() {
        if (this.has('user')) {
            return nodeRegistry.getInstance(this.get('user'));
        }
        return null;
    }

    get debug() {
        return this.get('debug');
    }

    get versions() {
        return this.get('versions');
    }

    get version() {
        return this.get('version');
    }

    get versionReleaseDate() {
        return this.get('version_release_date');
    }

}

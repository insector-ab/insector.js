import {UNSET_IF_FALSE} from 'mozy/model';

/**
 * ActiveView
 */
export class ActiveView {

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

}

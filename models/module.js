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
        // Fetching flag
        this._isFetching = false;
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

    get isFetching() {
        return this._isFetching;
    }
    set isFetching(value) {
        if (value !== this._isFetching) {
            this._isFetching = value;
            this.dispatchChange('isFetching');
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

    get users() {
        if (!this.props.hasOwnProperty('users')) {
            throw Error('props.users not set, initiate Module with "users" attribute');
        }
        return this.props.users;
    }

    get currentUser() {
        if (!(this.props && this.props.hasOwnProperty('currentUser'))) {
            throw Error(this.constructor.name + ': props.currentUser not set, initiate Module with "currentUser" attribute');
        }
        return this.props.currentUser;
    }

    get currentUserId() {
        return this.currentUser ? this.currentUser.id : undefined;
    }

    get currentUserFirstname() {
        return this.currentUser ? this.currentUser.firstname : '';
    }

    removeFromParent() {
        let parent = this.props.parentModel;
        console.log('removeFromParent', parent, this.instanceKey, parent.has(this.instanceKey));
        if (parent && parent.has(this.instanceKey)) {
            parent.unset(this.instanceKey);
        }
    }

    getNodeProperties(node) {
        let createdDate, createdByName, createdByHref;
        let modifiedDate, modifiedByName, modifiedByHref;
        if (node.has('id')) {
            createdDate = node.createdAt.format('YYYY-MM-DD HH:mm');
            if (node.createdBy) {
                createdByName = node.createdBy.fullname;
                createdByHref = '/user/' + node.createdBy.id;
            }
            modifiedDate = node.modifiedAt.format('YYYY-MM-DD HH:mm');
            if (node.modifiedBy) {
                modifiedByName = node.modifiedBy.fullname;
                modifiedByHref = '/user/' + node.modifiedBy.id;
            }
        }
        return {
            id: {name: 'ID', value: node.id, noValueText: 'N/A (Unsaved)'},
            name: {name: 'Name', value: node.name},
            description: {name: 'Description', value: node.description},
            created: {name: 'Created', at: createdDate, by: createdByName, href: createdByHref},
            modified: {name: 'Modified', at: modifiedDate, by: modifiedByName, href: modifiedByHref}
        };
    }

    _deleteReferences() {
        super._deleteReferences();
        delete this._props;
    }

}


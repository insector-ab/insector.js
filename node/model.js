import moment from 'moment';
import {Model} from 'guins/model';
import {Registry, ModelRegistry} from 'guins/registry';
import {Factory} from 'guins/factory';

import {addConstantsToClass} from 'insectorjs/utils';
import {Graph} from 'insectorjs/graph';

/**
 * NodeState
 */
export class NodeState {}
addConstantsToClass(NodeState, {
    TEMPORARY: 'temporary',
    NORMAL: 'normal',
    AUTOSAVE: 'autosave',
    DELETED: 'deleted'
});

/**
 * Class NodeModel
 */
export class NodeModel extends Model {

    get id() {
        return this.get('id');
    }

    get identity() {
        if (this.has('discriminator')) {
            return this.get('discriminator');
        }
        return super.identity;
    }

    get nodeState() {
        return this.get('node_state');
    }
    set nodeState(value) {
        this.set('node_state', value);
    }

    get name() {
        return this.get('name');
    }
    set name(value) {
        return this.set('name', value);
    }

    get description() {
        return this.get('description');
    }
    set description(value) {
        return this.set('description', value);
    }

    get createdById() {
        return this.get('created_by_id');
    }

    // get createdBy() {
    //     try {
    //         return nodeRegistry.get(this.createdById);
    //     } catch (err) {}
    //     return null;
    // }

    // get createdByFullname() {
    //     if (this.createdBy) {
    //         return this.createdBy.fullname;
    //     } else if (this.has('created_by_firstname') || this.has('created_by_surname')) {
    //         return strip(this.get('created_by_firstname', '') + ' ' + this.get('created_by_surname', ''));
    //     }
    //     return null;
    // }

    get createdAt() {
        return moment(this.get('created_at'));
    }

    get modifiedById() {
        return this.get('modified_by_id');
    }

    // get modifiedBy() {
    //     try {
    //         return nodeRegistry.get(this.modifiedById);
    //     } catch (err) {}
    //     return null;
    // }

    // get modifiedByFullname() {
    //     if (this.modifiedBy) {
    //         return this.modifiedBy.fullname;
    //     } else if (this.has('modified_by_firstname') || this.has('modified_by_surname')) {
    //         return strip(this.get('modified_by_firstname', '') + ' ' + this.get('modified_by_surname', ''));
    //     }
    //     return null;
    // }

    get modifiedAt() {
        return moment(this.get('modified_at'));
    }

    get deletable() {
        return true;
    }

    get isPersisted() {
        return this.has('created_at');
    }

    get isModified() {
        return this.modified && (this.modified.isAfter(this.modifiedAt) || !this.isPersisted);
    }

    get isNew() {
        return !this.isPersisted && this._modified == null;
    }

    isModifiedBefore(datetime) {
        return this.modifiedAt && this.modifiedAt.isBefore(datetime);
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = NodeModel.identity;
        d.discriminator = NodeModel.discriminator;
        return d;
    }

}

NodeModel.identity = 'node.NodeModel';
NodeModel.discriminator = 'node';

/**
 * nodeGraph
 * @type {Graph}
 */
export var nodeGraph = new Graph({
    nodeRegistryKey: 'uuid',
    edgeRegistryKey: 'uuid',
    identityKey: 'discriminator'
});

/**
 * nodeIdentities
 * @type {Registry}
 */
export var nodeIdentities = new Registry();
// Register Classes/Constructors
nodeIdentities.register(NodeModel.discriminator, NodeModel);

/**
 * nodeFactory
 * @type {Factory}
 */
export var nodeFactory = new Factory(nodeIdentities, 'discriminator');

/**
 * nodeRegistry
 * @type {ModelRegistry}
 */
export var nodeRegistry = new ModelRegistry('uuid', nodeFactory);
// Do not allow Instances that cannot be created via factory
nodeRegistry.allowNonFactoryInstances = false;

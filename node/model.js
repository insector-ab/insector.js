import moment from 'moment';
import {Model, ModelRegistry, Factory} from 'mozy';

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

    get createdAt() {
        return moment(this.get('created_at'));
    }

    get modifiedById() {
        return this.get('modified_by_id');
    }

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
        return !this.isPersisted && this._modified == undefined;
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
export const nodeGraph = new Graph({identityKey: 'discriminator'});
/**
 * nodeIdentities
 * @type {Registry}
 */
export const nodeIdentities = new Map();
// Register Classes/Constructors
nodeIdentities.set(NodeModel.discriminator, NodeModel);
/**
 * nodeFactory
 * @type {Factory}
 */
export const nodeFactory = new Factory(nodeIdentities, 'discriminator');
/**
 * nodeRegistry
 * @type {ModelRegistry}
 */
export const nodeRegistry = new ModelRegistry('uuid', nodeFactory);

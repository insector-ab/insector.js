import {Model, ModelRegistry, Factory} from 'mozy';
import {addConstantsToClass} from 'insector-utils';
import Graph from './graph';

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
export default class NodeModel extends Model {

    get id() {
        return this.get('id');
    }

    get discriminator() {
        return this.get('discriminator');
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

    get createdByUuid() {
        return this.get('created_by_uuid');
    }

    get createdAt() {
        return this.get('created_at');
    }

    get modifiedByUuid() {
        return this.get('modified_by_uuid');
    }

    get modifiedAt() {
        return this.get('modified_at');
    }

    get deletable() {
        return true;
    }

    get isPersisted() {
        return this.has('created_at');
    }

    get isDeleted() {
        return this.nodeState === NodeState.DELETED;
    }

    get isNew() {
        return !this.isPersisted && this._modified === undefined;
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
export const nodeRegistry = new ModelRegistry(nodeFactory);

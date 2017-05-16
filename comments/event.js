
// Private attr
const ATTR_TYPE = Symbol('CommentEvent.type');

/**
 * UpdateType
 */
export class UpdateType {}
UpdateType.CREATED = 'UpdateType_CREATED';
UpdateType.SAVED = 'UpdateType_SAVED';
UpdateType.DELETED = 'UpdateType_DELETED';

/**
 * CommentEvent
 */
export default class CommentEvent {

    constructor(type) {
        this[ATTR_TYPE] = type;
    }

    get type() {
        return this[ATTR_TYPE];
    }
    /**
     * Check if event affects the number of nodes (increases or decreases).
     * @return {Boolean}
     */
    affectsCount() {
        return this.updateType === UpdateType.CREATED || this.updateType === UpdateType.DELETED;
    }
    /**
     * newCreatedEvent
     * @param  {Integer} nodeId
     * @return {CommentEvent}
     */
    static newCreatedEvent(nodeId) {
        let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
        e.nodeId = nodeId;
        e.updateType = UpdateType.CREATED;
        return e;
    }
    /**
     * newSavedEvent
     * @param  {Integer} nodeId
     * @return {CommentEvent}
     */
    static newSavedEvent(nodeId) {
        let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
        e.nodeId = nodeId;
        e.updateType = UpdateType.SAVED;
        return e;
    }
    /**
     * newDeletedEvent
     * @param  {Integer} nodeId
     * @return {CommentEvent}
     */
    static newDeletedEvent(nodeId) {
        let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
        e.nodeId = nodeId;
        e.updateType = UpdateType.DELETED;
        return e;
    }

}

CommentEvent.COMMENT_UPDATED = 'CommentEvent_COMMENT_UPDATED';

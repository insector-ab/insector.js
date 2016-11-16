import {Event} from 'guins/event';

/**
 * CommentEvent
 */
export class CommentEvent extends Event {

    // Check if event affects the number of nodes (increases or decreases)
    affectsCount() {
        return this.updateType === UpdateType.CREATED || this.updateType === UpdateType.DELETED;
    }

}
CommentEvent.COMMENT_UPDATED = 'CommentEvent_COMMENT_UPDATED';

/**
 * UpdateType
 */
export class UpdateType {}
UpdateType.CREATED = 'UpdateType_CREATED';
UpdateType.SAVED = 'UpdateType_SAVED';
UpdateType.DELETED = 'UpdateType_DELETED';

/**
 * newCreatedEvent
 * @param  {Integer} nodeId
 * @return {CommentEvent}
 */
CommentEvent.newCreatedEvent = function(nodeId) {
    let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
    e.nodeId = nodeId;
    e.updateType = UpdateType.CREATED;
    return e;
};

/**
 * newSavedEvent
 * @param  {Integer} nodeId
 * @return {CommentEvent}
 */
CommentEvent.newSavedEvent = function(nodeId) {
    let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
    e.nodeId = nodeId;
    e.updateType = UpdateType.SAVED;
    return e;
};
/**
 * newDeletedEvent
 * @param  {Integer} nodeId
 * @return {CommentEvent}
 */
CommentEvent.newDeletedEvent = function(nodeId) {
    let e = new CommentEvent(CommentEvent.COMMENT_UPDATED);
    e.nodeId = nodeId;
    e.updateType = UpdateType.DELETED;
    return e;
};

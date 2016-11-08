import {Event} from 'guins/event';

/**
 * CommmentsEvent
 */
export class CommentsEvent extends Event {

    // Check if event affects the number of nodes (increases or decreases)
    affectsCount() {
        return this.updateType === UpdateType.CREATED || this.updateType === UpdateType.DELETED;
    }

}
CommentsEvent.COMMENT_UPDATED = 'CommentsEvent_COMMENT_UPDATED';

export class UpdateType {}
UpdateType.CREATED = 'UpdateType_CREATED';
UpdateType.SAVED = 'UpdateType_SAVED';
UpdateType.DELETED = 'UpdateType_DELETED';

CommentsEvent.createCommentUpdatedEvent = function(nodeId, updateType) {
    let e = new CommentsEvent(CommentsEvent.COMMENT_UPDATED);
    e.nodeId = nodeId;
    e.updateType = updateType;
    return e;
};

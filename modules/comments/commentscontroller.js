import _ from 'lodash';
import $ from 'jquery';
import ModuleController from 'js/controllers/module';
import {systemMessage} from 'js/helpers';
import {CommentEvent, UpdateType} from './event';

/**
 * CommentsController
 */
export default class CommentsController extends ModuleController {

    events() {
        return {
            'react.change textarea': 'onTextareaChange',
            'click .btn-show-new-comment': 'onShowNewCommentClick',
            'click .btn-save-comment': 'onSaveCommentClick',
            'click .btn-delete-comment': 'onDeleteClick',
            'click .btn-show-all': 'onShowAllClick'
        };
    }

    initialize() {
        return this.loadComments();
    }

    saveComment() {
        this.model.commentForm.validate(this, validators).done((result, form) => {
            // validation failed
            if (!result) {
                this.model.dispatchChange('commentForm');
            } else { // validation success
                // post
                let url = '/api/v2/comments';
                let data = _.assign({nodeId: this.model.nodeId}, this.model.commentForm.inputValues);
                let xhr;
                if (!xhr) {
                    xhr = this._xhrController.whenPost(url, data).done((data) => {
                        this.model.commentForm.setInputValue('comment', '');
                        this.model.rawComments.push(data);
                        this.model.newCommentId = data.id;
                        this.model.showNewComment = false;
                        xhr = null;
                        this.dispatchDOMEvent(CommentEvent.newCreatedEvent(this.model.nodeId));
                    });
                }
            }
        });
    }

    loadComments() {
        if (!this.model.nodeId) {
            throw Error('nodeId required to load comments');
        }
        let url = '/api/v2/node/' + this.model.nodeId + '/comments';
        return this._xhrController.whenGet(url).done((data) => {
            this.model.rawComments = data;
        });
    }

    deleteComment(id) {
        let url = '/api/v2/comments/' + id;
        return this._xhrController.whenDelete(url).done((data) => {
            systemMessage('Comment deleted.');
            this.loadComments();
            this.dispatchDOMEvent(CommentEvent.newDeletedEvent(this.model.nodeId));
        });
    }

    onShowNewCommentClick(event) {
        this.model.showNewComment = !this.model.showNewComment;
    }

    onSaveCommentClick(event) {
        this.saveComment();
    }

    onTextareaChange(event, rEvent, component) {
        let key = rEvent.target.name;
        let value = rEvent.target.value;
        this.model.commentForm.setInputValue(key, value);
        this.model.dispatchChange('commentForm');
    }

    onDeleteClick(event) {
        let $el = $(event.currentTarget);
        let id = $el.attr('data-id');
        this.deleteComment(id);
    }

    onShowAllClick(event) {
        this.model.showAll = true;
    }

}

/**
 * custom form validators
 */
export let validators = {

    nodeIdSet: function(value, input, context, ... args) {
        if (!context.model.nodeId) {
            return false;
        }
        return true;
    }

};

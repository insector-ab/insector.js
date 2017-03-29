import $ from 'jquery';
import ModuleController from 'insectorjs/module/controller';
import {JSONService} from 'insectorjs/service';
import {CommentEvent} from './event';

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

    get apiService() {
        return JSONService.at('/api/v2');
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
                let url = '/comments/';
                let data = Object.assign({nodeId: this.model.nodeId}, this.model.commentForm.inputValues);
                let ajaxPromise;
                // FIX: Always false?
                if (!ajaxPromise) {
                    ajaxPromise = this.apiService.post(url, data).done((data) => {
                        this.model.commentForm.setInputValue('comment', '');
                        this.model.rawComments.push(data);
                        this.model.newCommentId = data.id;
                        this.model.showNewComment = false;
                        ajaxPromise = undefined;
                        this.dispatchDOMEvent(CommentEvent.newCreatedEvent(this.model.nodeId));
                    });
                }
            }
        });
    }

    loadComments() {
        if (!this.model.nodeId) {
            throw new Error('nodeId required to load comments');
        }
        let url = '/node/' + this.model.nodeId + '/comments';
        return this.apiService.get(url).done((data) => {
            this.model.rawComments = data;
        });
    }

    deleteComment(id) {
        let url = '/comments/' + id;
        return this.apiService.delete(url).done((data) => {
            // implement notify, systemMessage('Comment deleted.');
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

    nodeIdSet: function(value, input, context, ...args) {
        return context.model.has('nodeId');
    }

};

import {modelRegistry, modelIdentities} from 'mozy';
import {FormModel} from '../form/model';
import ModuleModel from '../module/model';

/**
 * CommentsModel
 */
export class CommentsModel extends ModuleModel {

    get nodeId() {
        return this.props.nodeId;
    }

    get rawComments() {
        return this.get('comments');
    }
    set rawComments(value) {
        this.set('comments', value);
    }

    get commentForm() {
        return modelRegistry.getModel(this.get('commentForm'));
    }

    get newCommentId() {
        return this.get('newCommentId');
    }
    set newCommentId(value) {
        this.set('newCommentId', value);
    }

    get showNewComment() {
        return this.get('showNewComment');
    }
    set showNewComment(value) {
        this.set('showNewComment', value);
    }

    get showAll() {
        return this.get('showAll');
    }
    set showAll(value) {
        this.set('showAll', value);
    }

    get limit() {
        return this.get('limit');
    }
    set limit(value) {
        this.set('limit', value);
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = CommentsModel.identity;
        d.showNewComment = false;
        d.showAll = false;
        d.limit = 5;
        d.comments = [];
        d.newCommentid = undefined;
        d.commentForm = (new FormModel({
            validation: ['nodeIdSet'],
            inputs: [
                {name: 'comment', validation: ['required']}
            ]
        })).getModelData();
        return d;
    }

}
CommentsModel.identity = 'comments.CommentsModel';

// Register Classes/Constructors
modelIdentities.set(CommentsModel.identity, CommentsModel);

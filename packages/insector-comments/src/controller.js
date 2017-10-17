import {ReactController} from 'insector-react-mvc';

/**
 * CommentsController
 */
export default class CommentsController extends ReactController {

    events() {
        return Object.assign(super.events(), {
            'input textarea': 'onTextareaInput',
            'click .btn-show-new-comment': 'onShowNewCommentClick',
            'click .btn-show-all': 'onShowAllClick'
        });
    }

    onShowNewCommentClick(event) {
        this.model.showNewComment = !this.model.showNewComment;
    }

    onTextareaInput(event) {
        const {name, value} = event.target;
        this.model.commentForm.setInputValue(name, value);
        this.model.dispatchChange('commentForm');
    }

    onShowAllClick(event) {
        this.model.showAll = !this.model.showAll;
    }

}

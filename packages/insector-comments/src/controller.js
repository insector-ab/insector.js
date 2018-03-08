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
        const {name, value} = event.originalEvent.target;
        const form = this.model.commentForm;
        form.set(name, value, {unsetIfFalsey: true});
    }

    onShowAllClick(event) {
        this.model.showAll = !this.model.showAll;
    }

}

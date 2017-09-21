import {ReactController} from 'insector-react-mvc';
import {ControlEvent} from 'insector-form';

/**
 * CommentsController
 */
export default class CommentsController extends ReactController {

    events() {
        return Object.assign(super.events(), {
            [`${ControlEvent.CHANGE} textarea`]: 'onTextareaChange',
            'click .btn-show-new-comment': 'onShowNewCommentClick',
            'click .btn-show-all': 'onShowAllClick'
        });
    }

    onShowNewCommentClick(event) {
        this.model.showNewComment = !this.model.showNewComment;
    }

    onTextareaChange(event, component) {
        let key = event.target.name;
        let value = event.target.value;
        this.model.commentForm.setInputValue(key, value);
        this.model.dispatchChange('commentForm');
    }

    onShowAllClick(event) {
        this.model.showAll = !this.model.showAll;
    }

}

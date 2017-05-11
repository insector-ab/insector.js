import $ from 'jquery';
import find from 'lodash.find';
import classNames from 'classnames';
import autosize from 'jquery-autosize';
import React from 'react';
import ReactDOM from 'react-dom';
import {ReactTextarea} from '../form/controls';
import {FormModel} from '../form/model';
import {getAttrs} from '../helpers';

/**
 * CommentList
 */
class CommentList extends React.Component {

    render() {
        let comments = this.props.comments;
        if (this.props.limit && this.props.limit > 0) {
            let i = comments.length - this.props.limit;
            comments = comments.slice((i < 0 ? 0 : i), comments.length);
        }
        let users = this.props.users;
        return (
            <div className="list-group m-b-0 comment-list">
                {comments.map((item, i) => {
                    // FIX: Create usersMap (in WebtoolsModel?)
                    let user = find(users, {id: item.created_by_id});
                    return (
                        <Comment key={item.id}
                                 id={item.id}
                                 text={item.description}
                                 createdAt={item.created_at}
                                 userId={item.created_by_id}
                                 userFullName={user ? user.fullname : 'Unknown'}
                                 isNew={this.props.newCommentId === item.id}
                                 canDelete={user && user.id === this.props.currentUserId} />
                    );
                })}
            </div>
        );
    }

}
CommentList.propTypes = {
    comments: PropTypes.array,
    users: PropTypes.array,
    limit: PropTypes.number,
    newCommentId: PropTypes.number,
    currentUserId: PropTypes.number
};

/**
 * Comment
 */
class Comment extends React.Component {

    render() {
        let cls = classNames(
            'media list-group-item comment-list-item',
            {'comment-list-item--new': this.props.isNew}
        );
        let userHref = '/user/' + this.props.userId;
        return (
            <div className={cls}>
                <div className="media-left">
                    <img className="media-object" src="/img/user.png" alt={this.props.userFullName} />
                </div>
                <div className="media-body">
                    {this.props.canDelete &&
                        <button type="button"
                                className="btn btn-xs btn-danger btn-transp btn-delete-comment"
                                data-id={this.props.id} >
                            <span className="fa fa-fw fa-trash" />
                        </button>
                    }
                    <div className="comment-list-item-body">
                        <a href={userHref} className="page-route">{this.props.userFullName} </a>
                        {this.props.text}
                    </div>
                    <div className="small comment-list-item-bottom">
                        <span className="comment-list-item-time">
                            <span className="fa fa-clock-o" /> {this.props.createdAt}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}
Comment.propTypes = {
    id: PropTypes.number,
    text: PropTypes.string,
    createdAt: PropTypes.string,
    userFullName: PropTypes.string,
    userId: PropTypes.number,
    isNew: PropTypes.bool,
    canDelete: PropTypes.bool
};

/**
 * NewCommentForm
 */
class NewCommentForm extends React.Component {

    render() {
        const attrs = getAttrs(this.props, NewCommentForm);
        attrs.className = classNames('container-fluid', attrs.className);
        const comment = this.props.formModel.getInput('comment');
        return (
            <div {... attrs}>
                <div className="row">
                    <div className="col-xs-10 p-h-0">
                        <ReactTextarea name="comment"
                                       rows="1"
                                       className="autosize field-comment form-control"
                                       placeholder={this.props.placeholder}
                                       value={comment.value} />
                    </div>
                    <div className="col-xs-2 p-h-0">
                        <button type="button"
                                className="btn btn-block btn-default btn-save-comment">
                            <span className="fa fa-fw fa-save" />
                            <span className="hidden-xs">Save</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const $el = $(ReactDOM.findDOMNode(this));
        const $fieldEl = $el.find('.field-comment');
        // Auto size it
        autosize($fieldEl);
        // Move focus
        $fieldEl.focus();
    }

}
NewCommentForm.propTypes = {
    formModel: PropTypes.instanceOf(FormModel),
    placeholder: PropTypes.string
};
NewCommentForm.defaultProps = {
    placeholder: 'Write a comment…'
};

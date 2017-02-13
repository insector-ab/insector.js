import $ from 'jquery';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import autosize from 'jquery-autosize';
import React from 'react';
import ReactDOM from 'react-dom';
import {ReactTextarea} from 'insectorjs/form/controls';
import {FormModel} from 'insectorjs/form/model';

/**
 * CommentList
 */
class CommentList extends React.Component {

    render() {
        let comments = this.props.comments;
        if (this.props.limit && this.props.limit > 0) {
            let i = comments.length - this.props.limit;
            comments = _.slice(comments, i >= 0 ? i : 0, comments.length);
        }
        let users = this.props.users;
        return (
            <div className="list-group m-b-0 comment-list">
                {comments.map((item, i) => {
                    // FIX: Create usersMap (in WebtoolsModel?)
                    let user = _.find(users, {id: item.created_by_id});
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
    comments: React.PropTypes.array,
    users: React.PropTypes.array,
    limit: React.PropTypes.number,
    newCommentId: React.PropTypes.number,
    currentUserId: React.PropTypes.number
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
                            <span className="fa fa-clock-o" /> {moment(this.props.createdAt).calendar()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}
Comment.propTypes = {
    id: React.PropTypes.number,
    text: React.PropTypes.string,
    createdAt: React.PropTypes.string,
    userFullName: React.PropTypes.string,
    userId: React.PropTypes.number,
    isNew: React.PropTypes.bool,
    canDelete: React.PropTypes.bool
};

/**
 * NewCommentForm
 */
class NewCommentForm extends React.Component {

    render() {
        const attrs = _.omit(this.props, 'children', 'formModel', 'placeholder');
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
    formModel: React.PropTypes.instanceOf(FormModel),
    placeholder: React.PropTypes.string
};
NewCommentForm.defaultProps = {
    placeholder: 'Write a comment…'
};

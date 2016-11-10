import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {Grid, Row, Col} from 'react-bootstrap';

import ReactModule from 'insectorjs/react/module';
import autosize from 'jquery-autosize';

import {Model} from 'guins/model';
import {ReactTextarea} from 'insectorjs/react/form';
import {FormModel} from 'insectorjs/models/form';

import {User} from 'js/models/node';
import {CommentsModel} from './commentsmodel';
import CommentsController from './commentscontroller';

/**
 * Comments
 */
export default class Comments extends ReactModule {

    constructor(props) {
        super(props, true);
    }

    render() {
        let attrs = _.omit(this.props, 'children', 'parentModel', 'nodeId', 'users', 'currentUser', 'placeholder');
        attrs.className = classNames(
            'comments',
            attrs.className || '',
            {'show-new-comment': this.model.showNewComment}
        );
        let comments = this.model.rawComments;
        return (
            <div ref="view" {... attrs}>

                <div className="comments-header">
                    <button type="button"
                            className="btn btn-sm btn-default btn-transp pull-right btn-show-new-comment">
                        <span className="fa fa-fw fa-comment" />
                        <span className=""> Comment</span>
                    </button>

                    <span className="fa fa-comments-o m-l-05" />
                    <span className="m-h-05">{comments.length} Comments</span>

                    <button type="button"
                            className="btn btn-sm btn-default btn-transp btn-show-all"
                            disabled={comments.length < 6}>
                        <span className="fa fa-angle-down" />
                        <span> Show all</span>
                    </button>
                </div>

                {comments.length > 0 &&
                    <CommentList comments={comments}
                                 users={this.model.users}
                                 limit={this.model.showAll ? 0 : this.model.limit}
                                 newCommentId={this.model.newCommentId}
                                 currentUserId={this.model.currentUserId} />
                }

                {this.model.showNewComment &&
                    <NewCommentForm formModel={this.model.commentForm}
                                    className="comments-form"
                                    placeholder={this.props.placeholder} />
                }

            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nodeId !== this.props.nodeId) {
            this.model = this._newModelInstance(nextProps);
            this.controller.initializeAndLaunch();
        }
    }

    _newModelInstance(props) {
        // If no nodeId, don't register model
        if (!props.nodeId) {
            return new CommentsModel({}, props);
        }
        let instanceKey = '_comments_' + props.nodeId;
        let m = this._defaultNewModelInstance(props, CommentsModel, instanceKey);
        return m;
    }

    _newControllerInstance(model) {
        return new CommentsController(model);
    }

}
Comments.propTypes = {
    parentModel: React.PropTypes.instanceOf(Model),
    nodeId: React.PropTypes.number,
    currentUser: React.PropTypes.instanceOf(User),
    users: React.PropTypes.array,
    placeholder: React.PropTypes.string
};

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
        let attrs = _.omit(this.props, 'children', 'formModel', 'placeholder');
        let comment = this.props.formModel.getInput('comment');
        return (
            <Grid fluid {... attrs}>
                <Row>
                    <Col xs={10} className="p-h-0">
                        <ReactTextarea name="comment"
                                       rows="1"
                                       className="autosize field-comment form-control"
                                       placeholder={this.props.placeholder}
                                       value={comment.value} />
                    </Col>
                    <Col xs={2} className="p-h-0">
                        <button type="button"
                                className="btn btn-block btn-default btn-save-comment">
                            <span className="fa fa-fw fa-save" />
                            <span className="hidden-xs">Save</span>
                        </button>
                    </Col>
                </Row>
            </Grid>
        );
    }

    componentDidMount() {
        let $el = $(ReactDOM.findDOMNode(this));
        let $fieldEl = $el.find('.field-comment');
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

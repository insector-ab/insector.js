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
 * CommentsModule
 */
export default class CommentsModule extends ReactModule {

    constructor(props) {
        super(props, true);
    }

    render() {
    let attrs = _.omit(this.props, ... _.keys(CommentsModule.propTypes));
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
CommentsModule.propTypes = {
    parentModel: React.PropTypes.instanceOf(Model),
    nodeId: React.PropTypes.number,
    currentUser: React.PropTypes.instanceOf(User),
    users: React.PropTypes.array,
    placeholder: React.PropTypes.string
};

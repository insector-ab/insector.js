import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {getAttrs} from 'insector-utils';
import {ReactView} from 'insector-react-mvc';

import CommentsModel from './model';
import {NewCommentForm, CommentList} from './components';

/**
 * CommentsView
 */
export default class CommentsView extends ReactView {

    events() {
        return Object.assign(super.events(), {
            'change showNewComment': 'onModelChange',
            'change showAll': 'onModelChange',
            'change limit': 'onModelChange',
            'change comments': 'onModelChange'
        });
    }

    render() {
        // Attrs
        const attrs = getAttrs(this.props, CommentsView);
        attrs.className = classNames(
            'comments',
            attrs.className || '',
            {'show-new-comment': this.model.showNewComment}
        );
        let comments = this.props.comments;
        return (
            <div {...attrs}>
                <div className="comments-header">
                    <button
                        type="button"
                        className="btn btn-sm btn-transp pull-right btn-show-new-comment"
                    >
                        <span className="fa fa-fw fa-comment" />
                        <span className=""> Comment</span>
                    </button>

                    <span className="fa fa-comments-o m-l-1" />
                    <span className="m-h-1">{comments.length} Comments</span>

                    <button
                        type="button"
                        className="btn btn-sm btn-transp btn-show-all"
                        disabled={comments.length <= this.props.limit}
                    >
                        <span className="fa fa-angle-down" />
                        <span> Show all</span>
                    </button>
                </div>

                {comments.length > 0 &&
                    <CommentList
                        comments={comments}
                        limit={this.model.showAll ? 0 : this.props.limit}
                        getUserIconElement={this.props.getUserIconElement}
                        getCreatedByElement={this.props.getCreatedByElement}
                        canDeleteComment={this.props.canDeleteComment}
                    />
                }

                {this.model.showNewComment &&
                    <NewCommentForm
                        model={this.model.commentForm}
                        placeholder={this.props.placeholder}
                    />
                }

            </div>
        );
    }

    onModelChange(eventType) {
        this.setState({});
    }

}
CommentsView.propTypes = {
    model: PropTypes.instanceOf(CommentsModel).isRequired,
    placeholder: PropTypes.string,
    limit: PropTypes.number,
    comments: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        text: PropTypes.string,
        createdAtText: PropTypes.string,
        createdByText: PropTypes.string
    })).isRequired,
    getUserIconElement: PropTypes.func,
    getCreatedByElement: PropTypes.func,
    canDeleteComment: PropTypes.func
};

CommentsView.defaultProps = {
    limit: 5
};

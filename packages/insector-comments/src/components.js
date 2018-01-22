import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {getAttrs} from 'insector-utils';
import {FormViewModel, FormTextarea} from 'insector-form';
import {ReactView} from 'insector-react-mvc';

/**
 * CommentList
 */
export class CommentList extends React.Component {

    render() {
        let comments = this.props.comments;
        // show all if not limit set
        if (this.props.limit && this.props.limit > 0) {
            let i = comments.length - this.props.limit;
            comments = comments.slice((i < 0 ? 0 : i), comments.length);
        }
        return (
            <div className="list-group m-b-0 comment-list">
                {comments.map((item, i) => {
                    // is last item in list new
                    const isNew = i === comments.length - 1 && Object.keys(this.refs).length > 0 && !this.refs.hasOwnProperty(item.uuid);
                    return (
                        <Comment
                            ref={item.uuid}
                            key={item.uuid}
                            comment={item}
                            getUserIconElement={this.props.getUserIconElement}
                            getCreatedByElement={this.props.getCreatedByElement}
                            canDeleteComment={this.props.canDeleteComment}
                            isNew={isNew}
                        />
                    );
                })}
            </div>
        );
    }
}
CommentList.propTypes = {
    comments: PropTypes.array,
    limit: PropTypes.number,
    getUserIconElement: PropTypes.func,
    getCreatedByElement: PropTypes.func,
    canDeleteComment: PropTypes.func
};

/**
 * Comment
 */
class Comment extends React.Component {
    render() {
        let cls = classNames(
            'media list-group-item comment-list-item',
            {'comment-list-item-new': this.props.isNew}
        );
        const comment = this.props.comment;
        return (
            <div className={cls}>
                <div className="media-left">
                    {this.props.getUserIconElement(comment)}
                </div>
                <div className="media-body">
                    {this.props.canDeleteComment(comment) &&
                        <button
                            type="button"
                            className="btn btn-xs btn-danger btn-transp btn-delete-comment"
                            data-uuid={comment.uuid}
                        >
                            <span className="fa fa-fw fa-trash" />
                        </button>
                    }
                    <div className="comment-list-item-body">
                        {this.props.getCreatedByElement(comment)}
                        {comment.text}
                    </div>
                    <div className="small comment-list-item-bottom">
                        <span className="comment-list-item-time">
                            <span className="fa fa-clock-o" /> {comment.createdAtText}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    comment: PropTypes.shape({
        uuid: PropTypes.string,
        text: PropTypes.string,
        createdAtText: PropTypes.string,
        createdByText: PropTypes.string
    }).isRequired,
    getUserIconElement: PropTypes.func,
    getCreatedByElement: PropTypes.func,
    canDeleteComment: PropTypes.func,
    isNew: PropTypes.bool
};

Comment.defaultProps = {
    getUserIconElement: function(comment) {
        return (
            <span className="fa fa-user-circle-o" />
        );
    },
    getCreatedByElement: function(comment) {
        return (
            <span className="fw-500">{comment.createdByText} </span>
        );
    },
    canDeleteComment: function(comment) {
        return true;
    }
};

/**
 * NewCommentForm
 */
export class NewCommentForm extends ReactView {

    events() {
        return Object.assign(super.events(), {
            'change text': 'onModelChange'
        });
    }

    render() {
        const attrs = getAttrs(this.props, NewCommentForm);
        attrs.className = classNames('container-fluid', 'comments-form', attrs.className);
        return (
            <div {... attrs}>
                <div className="row">
                    <div className="col-xs-10 p-h-0">
                        <FormTextarea
                            name="text"
                            rows="1"
                            className="autosize field-comment"
                            placeholder={this.props.placeholder}
                            value={this.props.model.get('text')}
                            autoSize={true}
                        />
                    </div>
                    <div className="col-xs-2 p-h-0">
                        <button
                            type="button"
                            className="btn btn-block btn-default btn-save-comment"
                        >
                            <span className="fa fa-fw fa-save" />
                            <span className="hidden-xs">Save</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    onModelChange() {
        this.setState({});
    }

}
NewCommentForm.propTypes = {
    model: PropTypes.instanceOf(FormViewModel).isRequired,
    placeholder: PropTypes.string
};
NewCommentForm.defaultProps = {
    placeholder: 'Write a comment…'
};

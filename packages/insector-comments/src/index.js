import React from 'react';
import PropTypes from 'prop-types';

import {MVCContainer} from 'insector-react-mvc';
import {getAttrs} from 'insector-utils';

import CommentsModel from './model';
import CommentsView from './view';
import CommentsController from './controller';

/**
 * Comments
 */
export default class Comments extends MVCContainer {

    get formModel() {
        return this.model.commentForm;
    }

    render() {
        const attrs = getAttrs(this.props, Comments);
        return (
            <CommentsView ref="view"
                          model={this.model}
                          {...attrs} />
        );
    }

    _newModelInstance(props) {
        if (!props.parentModel) {
            return new CommentsModel();
        }
        return props.parentModel.getSubViewModel(CommentsModel, '_comments_');
    }

    _newControllerInstance(model) {
        return new CommentsController(model);
    }

}
Comments.propTypes = {
    parentModel: PropTypes.shape({
        getSubViewModel: PropTypes.function
    })
};

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getAttrs} from 'insector-utils';

/**
 * Create a simple React wrapper component
 * @param  {String} className Component className
 * @return {function} React component
 */
export default function createWrapperComponent(className, tagName) {

    const Component = function(props) {
        const attrs = getAttrs(props, Component);
        attrs.className = classNames(className, attrs.className);
        const Tag = tagName || 'div';
        return (
            <Tag {...attrs}>
                {props.children}
            </Tag>
        );
    };

    Component.propTypes = {
        children: PropTypes.node
    };

    return Component;
}

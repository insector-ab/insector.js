import React from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import {getAttrs} from 'insector-utils';

/**
 * ReactInput
 */
export function ReactInput(props) {
    const attrs = getAttrs(props, ReactInput);
    return (
        <input
            type={props.type || 'text'}
            value={props.value}
           {...attrs}
        />
    );
}
ReactInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};
ReactInput.defaultProps = {
    value: ''
};

/**
 * ReactTextarea
 */
export function ReactTextarea(props) {
    const attrs = getAttrs(props, ReactTextarea);
    const CompCls = props.autoSize ? Textarea : 'textarea';
    return (
        <CompCls
            value={props.value}
            {...attrs}
        />
    );
}
ReactTextarea.propTypes = {
    value: PropTypes.string,
    autoSize: PropTypes.bool
};
ReactTextarea.defaultProps = {
    value: '',
    autoSize: false
};

/**
 * ReactSelect
 */
export function ReactSelect(props) {
    const attrs = getAttrs(props, ReactSelect);
    return (
        <select
            value={props.value}
            {...attrs}
        >
            {props.children}
        </select>
    );
}
ReactSelect.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    children: PropTypes.node
};
ReactSelect.defaultProps = {
    value: ''
};

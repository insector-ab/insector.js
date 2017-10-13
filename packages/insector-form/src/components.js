import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getAttrs} from 'insector-utils';
import {
    ReactInput,
    ReactSelect,
    ReactTextarea
} from './controls';

/**
 * FormGroup
 */
export function FormGroup(props) {
    const attrs = getAttrs(props, FormGroup);
    attrs.className = classNames('form-group', attrs.className);
    const leftColClasses = classNames('col-md-' + props.labelSize, 'control-label');
    const rightColClasses = classNames('col-md-' + (12 - props.labelSize));
    return (
        <div {...attrs}>
            <label className={leftColClasses} htmlFor={props.labelFor}>{props.label}</label>
            <div className={rightColClasses}>
                {props.children}
            </div>
        </div>
    );
}
FormGroup.propTypes = {
    label: PropTypes.string,
    labelSize: PropTypes.number,
    labelFor: PropTypes.string,
    children: PropTypes.node
};
FormGroup.defaultProps = {
    labelSize: 3
};

/**
 * CheckboxGroup
 */
export function CheckboxGroup(props) {
    const attrs = getAttrs(props, CheckboxGroup);
    attrs.className = classNames('checkbox', attrs.className || '');
    return (
        <div {... attrs}>
            <label>
                {props.children}
                {props.label}
            </label>
        </div>
    );
}
CheckboxGroup.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node
};

// ------------- React inputs ------------- //

/**
 * FormTextInput
 */
export function FormTextInput(props) {
    const attrs = getAttrs(props, FormTextInput);
    attrs.className = classNames('form-control', attrs.className || '');
    return (
        <ReactInput type="text"
                    {... attrs} />
    );
}
FormTextInput.propTypes = {};

/**
 * FormPasswordInput
 */
export function FormPasswordInput(props) {
    const attrs = getAttrs(props, FormPasswordInput);
    attrs.className = classNames('form-control', attrs.className || '');
    return (
        <ReactInput type="password"
                    {... attrs} />
    );
}
FormPasswordInput.propTypes = {};

/**
 * FormCheckbox
 */
export function FormCheckbox(props) {
    const attrs = getAttrs(props, FormCheckbox);
    return (
        <ReactInput type="checkbox"
                    {... attrs} />
    );
}
FormCheckbox.propTypes = {};

/**
 * FormSelect
 */
export function FormSelect(props) {
    const attrs = getAttrs(props, FormSelect);
    attrs.className = classNames('form-control', attrs.className || '');
    return (
        <ReactSelect {... attrs} >
            {props.children}
        </ReactSelect>
    );
}
FormSelect.propTypes = {
    children: PropTypes.node
};

/**
 * FormTextarea
 */
export function FormTextarea(props) {
    const attrs = getAttrs(props, FormTextarea);
    attrs.className = classNames('form-control', attrs.className || '');
    return (
        <ReactTextarea {... attrs} />
    );
}
FormTextarea.propTypes = {
    children: PropTypes.node
};

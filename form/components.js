import React from 'react';
import classNames from 'classnames';
import {ReactInput, ReactSelect} from 'insectorjs/form/controls';
import {getAttrs} from '../helpers';

/**
 * FormGroup
 */
export function FormGroup(props) {
    const attrs = getAttrs(props, FormGroup);
    attrs.className = classNames('form-group', attrs.className || '');

    const labelSize = parseInt(props.labelSize || '3');
    const leftColClasses = classNames(
        'col-md-' + labelSize,
        'control-label'
    );
    const rightColClasses = classNames(
        'col-md-' + (12 - labelSize)
    );

    return (
        <div {... attrs}>
            <label className={leftColClasses} htmlFor={props.labelFor}>{props.label}</label>
            <div className={rightColClasses}>
                {props.children}
            </div>
        </div>
    );
}
FormGroup.propTypes = {
    label: React.PropTypes.string,
    labelSize: React.PropTypes.number,
    labelFor: React.PropTypes.string,
    children: React.PropTypes.node
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
    label: React.PropTypes.string,
    children: React.PropTypes.node
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
    children: React.PropTypes.node
};

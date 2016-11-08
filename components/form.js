import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import {ReactInput, ReactSelect} from 'insectorjs/react/form';

/**
 * FormGroup
 */
export class FormGroup extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormGroup.propTypes));
        attrs.className = classNames('form-group', attrs.className || '');

        var labelSize = parseInt(this.props.labelSize || '3');
        var leftColClasses = classNames(
            'col-md-' + labelSize,
            'control-label'
        );
        var rightColClasses = classNames(
            'col-md-' + (12 - labelSize)
        );

        return (
            <div {... attrs}>
                <label className={leftColClasses} htmlFor={this.props.labelFor}>{this.props.label}</label>
                <div className={rightColClasses}>
                    {this.props.children}
                </div>
            </div>
        );
    }

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
export class CheckboxGroup extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(CheckboxGroup.propTypes));
        attrs.className = classNames('checkbox', attrs.className || '');
        return (
            <div {... attrs}>
                <label>
                    {this.props.children}
                    {this.props.label}
                </label>
            </div>
        );
    }

}
CheckboxGroup.propTypes = {
    label: React.PropTypes.string,
    children: React.PropTypes.node
};

// ------------- React inputs ------------- //

/**
 * FormTextInput
 */
export class FormTextInput extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormTextInput.propTypes));
        attrs.className = classNames('form-control', attrs.className || '');
        return (
            <ReactInput type="text"
                        {... attrs} />
        );
    }

}
FormTextInput.propTypes = {};

/**
 * FormPasswordInput
 */
export class FormPasswordInput extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormPasswordInput.propTypes));
        attrs.className = classNames('form-control', attrs.className || '');
        return (
            <ReactInput type="password"
                        {... attrs} />
        );
    }

}
FormPasswordInput.propTypes = {};

/**
 * FormCheckbox
 */
export class FormCheckbox extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormCheckbox.propTypes));
        return (
            <ReactInput type="checkbox"
                        {... attrs} />
        );
    }

}
FormCheckbox.propTypes = {};

/**
 * FormSelect
 */
export class FormSelect extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormSelect.propTypes));
        attrs.className = classNames('form-control', attrs.className || '');
        return (
            <ReactSelect {... attrs} >
                {this.props.children}
            </ReactSelect>
        );
    }

}
FormSelect.propTypes = {
    children: React.PropTypes.node
};

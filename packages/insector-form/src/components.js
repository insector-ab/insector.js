import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import {getAttrs} from 'insector-utils';

/**
 * AbstractInput
 */
export class AbstractInput extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    onChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        this.setState({value: event.target.value});
    }

}

/**
 * FormTextInput
 */
export class FormTextInput extends AbstractInput {

    render() {
        const attrs = getAttrs(this.props, FormTextInput);
        attrs.className = classNames('form-control', attrs.className);
        return (
            <input
                value={this.props.value}
                {...attrs}
                {...this.state}
                onChange={this.onChange}
            />
        );
    }

}
FormTextInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};
FormTextInput.defaultProps = {
    value: '',
    type: 'text'
};

/**
 * FormPasswordInput
 */
export function FormPasswordInput(props) {
    return <FormTextInput {...props} type="password" />;
}

/**
 * FormCheckbox
 */
export function FormCheckbox(props) {
    const attrs = getAttrs(props, FormCheckbox);
    attrs.className = classNames('checkbox', attrs.className);
    return (
        <div {...attrs}>
            <label>
                <input type="checkbox" checked={props.checked} /> {props.text}
            </label>
        </div>
    );
}
FormCheckbox.propTypes = {
    checked: PropTypes.bool
};

/**
 * FormSelect
 */
export class FormSelect extends AbstractInput {

    render() {
        const attrs = getAttrs(this.props, FormSelect);
        attrs.className = classNames('form-control', attrs.className);
        return (
            <select
                value={this.props.value}
                {...attrs}
                {...this.state}
                onChange={this.onChange}
            >
                {this.props.children}
            </select>
        );
    }

}
FormSelect.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    children: PropTypes.node
};
FormSelect.defaultProps = {
    value: ''
};

/**
 * FormTextarea
 */
export class FormTextarea extends AbstractInput {

    render() {
        const attrs = getAttrs(this.props, FormTextarea);
        attrs.className = classNames('form-control', attrs.className);
        const CompCls = this.props.autoSize ? Textarea : 'textarea';
        return (
            <CompCls
                value={this.props.value}
                {...attrs}
                {...this.state}
                onChange={this.onChange}
            />
        );
    }

}
FormTextarea.propTypes = {
    value: PropTypes.string,
    autoSize: PropTypes.bool
};
FormTextarea.defaultProps = {
    value: '',
    autoSize: false
};

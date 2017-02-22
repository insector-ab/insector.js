import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

import 'bootstrap-datepicker';

/**
 * AbstractFormControl
 */
export class AbstractFormControl extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    get el() {
        return ReactDOM.findDOMNode(this);
    }

    get $el() {
        return $(this.el);
    }

    getAttrs() {
        let attrs = _.omit(this.props, ..._.keys(this.constructor.propTypes));
        attrs.onChange = this.onChange;
        attrs.onBlur = this.onBlur;
        return attrs;
    }

    onChange(event) {
        this.dispatchEvent(event, 'react.change');
    }

    onBlur(event) {
        this.dispatchEvent(event, 'react.blur');
    }

    dispatchEvent(event, type, ...extraArgs) {
        // args
        let args = _.concat([event, this], extraArgs);
        // dispatch react synthetic event
        this.$el.trigger(type, args);
    }

}
AbstractFormControl.propTypes = {
    value: React.PropTypes.any
};

/**
 * ReactInput
 */
export class ReactInput extends AbstractFormControl {

    render() {
        let attrs = this.getAttrs();
        return (
            <input type={this.props.type || 'text'}
                   value={this.props.value}
                   {...attrs} />
        );
    }

}
ReactInput.propTypes = {
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ])
};
ReactInput.defaultProps = {
    value: ''
};

/**
 * ReactTextarea
 */
export class ReactTextarea extends AbstractFormControl {

    render() {
        let attrs = this.getAttrs();
        return (
            <textarea value={this.props.value}
                      {...attrs} />
        );
    }

}
ReactTextarea.propTypes = {
    value: React.PropTypes.string
};
ReactTextarea.defaultProps = {
    value: ''
};

/**
 * ReactSelect
 */
export class ReactSelect extends AbstractFormControl {

    render() {
        let attrs = this.getAttrs();
        return (
            <select value={this.props.value}
                    {...attrs} >
                {this.props.children}
            </select>
        );
    }

}
ReactSelect.propTypes = {
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    children: React.PropTypes.node
};
ReactSelect.defaultProps = {
    value: ''
};

/**
 * ReactDatepicker
 */
export class ReactDatepicker extends ReactInput {

    constructor(props) {
        super(props);
        this.onDateChange = this.onDateChange.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onHide = this.onHide.bind(this);
    }

    componentDidMount() {
        // Datepicker instance
        if (!this.datepicker) {
            let $el = $(ReactDOM.findDOMNode(this));
            this.datepicker = $el.datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true
            });
            this.datepicker.on('changeDate', this.onDateChange);
            this.datepicker.on('show', this.onShow);
            this.datepicker.on('hide', this.onHide);
        }
    }

    componentWillUnmount() {
        if (this.datepicker) {
            this.datepicker.off(undefined, undefined, this);
            delete this.datepicker;
        }
    }

    onChange(event) {
        // disable onChange behaviour
    }

    onDateChange(event) {
        super.onChange(event);
    }

    onShow(event) {
        this.dispatchEvent(event, 'react.datepicker.show');
        // this.$el.trigger('react.datepicker.show', [event, this]);
    }

    onHide(event) {
        this.dispatchEvent(event, 'react.datepicker.hide');
        // this.$el.trigger('react.datepicker.hide', [event, this]);
    }

}
ReactDatepicker.propTypes = {
    value: React.PropTypes.string
};

/**
 * ReactToggle
 */
export class ReactToggle extends ReactInput {

    componentDidMount() {
        // bootstrapToggle instance
        if (!this.toggle) {
            let $el = $(ReactDOM.findDOMNode(this));
            this.toggle = $el.bootstrapToggle({
                on: 'Yes',
                off: 'No',
                onstyle: 'success',
                offstyle: 'warning',
                size: 'small'
            });
            this.toggle.on('change', this.onChange);
        }
    }

    componentWillUnmount() {
        delete this.toggle;
    }

}
ReactToggle.propTypes = {
    value: React.PropTypes.string
};
ReactToggle.defaultProps = {
    type: 'checkbox'
};

/**
 * ReactAutocomplete
 */
export class ReactAutocomplete extends AbstractFormControl {

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        let p = this.props;
        // use default values
        let defaultProps = this.constructor.defaultProps;
        let wrapperProps = _.assign({}, defaultProps.wrapperProps, p.wrapperProps);
        let inputProps = _.assign({}, defaultProps.inputProps, p.inputProps);
        // wrapper className
        if (wrapperProps.className && p.className) {
            wrapperProps.className += ' ' + p.className;
        } else if (p.className) {
            wrapperProps.className = p.className;
        }
        return (
            <Autocomplete ref="autocomplete"
                          onChange={this.onChange}
                          onSelect={this.onSelect}
                          value={p.value ? p.value : ''}
                          items={p.items}
                          shouldItemRender={p.shouldItemRender}
                          getItemValue={p.getItemValue}
                          renderItem={p.renderItem}
                          renderMenu={p.renderMenu}
                          inputProps={inputProps}
                          wrapperProps={wrapperProps} />
        );
    }

    onSelect(value, item) {
        // dispatch, no event available
        this.dispatchEvent(undefined, 'react.autocomplete.select', value, item);
    }

    onChange(event, value) {
        this.dispatchEvent(event, 'react.change');
    }

}
// Autocomplete.propTypes = {
//     value: React.PropTypes.any,
//     onChange: React.PropTypes.func,
//     onSelect: React.PropTypes.func,
//     shouldItemRender: React.PropTypes.func,
//     sortItems: React.PropTypes.func,
//     getItemValue: React.PropTypes.func.isRequired,
//     renderItem: React.PropTypes.func.isRequired,
//     renderMenu: React.PropTypes.func,
//     menuStyle: React.PropTypes.object,
//     inputProps: React.PropTypes.object,
//     wrapperProps: React.PropTypes.object,
//     wrapperStyle: React.PropTypes.object,
//     autoHighlight: React.PropTypes.bool,
//     onMenuVisibilityChange: React.PropTypes.func,
//     open: React.PropTypes.bool,
//     debug: React.PropTypes.bool
// }
ReactAutocomplete.propTypes = {
    className: React.PropTypes.string,
    noValueText: React.PropTypes.string,
    value: React.PropTypes.any,
    items: React.PropTypes.array,
    shouldItemRender: React.PropTypes.func,
    sortItems: React.PropTypes.func,
    getItemValue: React.PropTypes.func.isRequired,
    renderItem: React.PropTypes.func.isRequired,
    renderMenu: React.PropTypes.func,
    inputProps: React.PropTypes.object,
    wrapperProps: React.PropTypes.object
};
ReactAutocomplete.defaultProps = {
    shouldItemRender: function(item, value) {
        return item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    getItemValue: function(item) {
        return item.name;
    },
    renderItem: function(item, isHighlighted) {
        let classes = classNames({'active': isHighlighted});
        return (
            <li className={classes}
                 key={item.id}
                 id={item.id}>
                <span>{item.name}</span>
            </li>
        );
    },
    renderMenu: function(items, value, style) {
        let children = items;
        // TODO: use noValueText from props
        if (children.length === 0) {
            children = <li><span className="text-novalue">No items matched</span></li>;
        }
        return (
            <ul className="dropdown-menu">
                {children}
            </ul>
        );
    },
    inputProps: {name: 'autocomplete', 'className': 'form-control'},
    wrapperProps: {className: 'autocomplete'}
};

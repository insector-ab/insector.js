import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import {Label} from 'react-bootstrap';
import {Mappable} from 'insectorjs/react/proptypes';

/**
 * PropertyList
 */
export default class PropertyList extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(PropertyList.propTypes));
        let value, propCls;
        attrs.className = classNames('property-list', attrs.className || '');

        return (
            <div {...attrs}>

                {this.renderTitle()}

                <dl className="dl-horizontal">
                    {this.props.items.map((item, i) => {
                        if (!item) {
                            return;
                        }
                        value = this._getValue(item);
                        propCls = this._isLabel(value, item) ? 'label-value' : null;
                        return [
                            (<dt key={2 * i} title={item.nameTitle || item.name} className={propCls}>{item.name}</dt>),
                            (<dd key={2 * i + 1} className={propCls}>{value}</dd>)
                        ];
                    })}

                    {this.props.items.length === 0 &&
                        [
                            (<dt key="0" className="text-novalue text-left">{this.props.noPropertiesText || 'No properties'}</dt>),
                            (<dd key="1" />)
                        ]
                    }

                </dl>

            </div>
        );
    }

    renderTitle() {
        let title = this.props.title || this.props.noTitleText;
        let Htag = 'h' + (this.props.hSize || 4);
        let cls = classNames(
            {light: this.props.hSize >= 4},
            {thin: this.props.hSize < 4},
            {'text-novalue': !this.props.title}
        );
        if (title) {
            return (
                <Htag className={cls}>
                    {this.props.children}
                    {title}
                </Htag>
            );
        }
    }

    _isLabel(value, item) {
        return value.type && value.type.name === 'Label';
    }

    _getValue(item) {
        let attrs = _.assign({
            title: item.valueTitle || item.value,
            href: item.href,
            className: item.href ? 'page-route' : undefined
        }, item.attrs || {});
        if (item.href && item.at) {
            return (<div>{item.at}<br />by <a {... attrs}>{item.by}</a></div>);
        }
        if (item.at) {
            return (<div {... attrs}>{item.at}</div>);
        }
        if (item.href) {
            return (<a {... attrs}>{item.value}</a>);
        }
        if (item.labelStyle) {
            attrs.className = classNames(item.labelStyle, attrs.className || '');
            return (<Label bsStyle={null} {... attrs}>{item.value}</Label>);
        }
        switch (item.value) {
            case true:
                return (<Label bsStyle={item.trueStyle || 'success'}>{item.trueText || 'Yes'}</Label>);
            case false:
                return (<Label bsStyle={item.trueStyle || 'warning'}>{item.falseText || 'No'}</Label>);
            case '':
            case null:
            case undefined:
                return (<span className="text-novalue">{item.noValueText || 'No value'}</span>);
            default:
                return (<div {... attrs}>{item.value}</div>);
        }
    }

}
PropertyList.propTypes = {
    title: React.PropTypes.string,
    items: Mappable,
    hSize: React.PropTypes.number,
    noTitleText: React.PropTypes.string,
    noPropertiesText: React.PropTypes.string,
    itemClassName: React.PropTypes.string,
    children: React.PropTypes.node
};

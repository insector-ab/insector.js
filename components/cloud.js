import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';

export class CloudGroup extends React.Component {

    render() {
        let attrs = _.clone(this.props);
        attrs.className = classNames('cloud-group', attrs.className || '');
        return (
            <div {...attrs}>
                {this.props.children}
            </div>
        );
    }

}
CloudGroup.propTypes = {
    children: React.PropTypes.node
};

export class CloudItem extends React.Component {

    render() {
        let attrs = _.clone(this.props);
        attrs.className = classNames('cloud-item', attrs.className || '');
        if (!attrs.hasOwnProperty('tabIndex')) {
            let cls = attrs.className.toString();
            if (!(cls.indexOf('disabled') > -1 || cls.indexOf('auto') > -1)) {
                attrs.tabIndex = 0;
            }
        }
        return (
            <div {...attrs}>
                <span className="cloud-item-text">{this.props.title}</span>
            </div>
        );
    }

}
CloudItem.propTypes = {
    title: React.PropTypes.string
};

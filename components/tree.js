import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';

export class Tree extends React.Component {

    render() {
        let attrs = _.clone(this.props);
        attrs.className = classNames('tree', attrs.className || '');
        return (
            <div {...attrs}>
                <TreeNode className="root" title={this.props.title} faIcon={this.props.faIcon} />
                <ul>
                    {this.props.children}
                </ul>
            </div>
        );
    }

}
Tree.propTypes = {
    children: React.PropTypes.node,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

export class TreeBranch extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'href', 'title', 'faIcon');
        return (
            <li {...attrs}>
                <TreeNode href={this.props.href} title={this.props.title} faIcon={this.props.faIcon} />

                {this.props.children &&
                    <ul>
                        {this.props.children}
                    </ul>
                }

            </li>
        );
    }

}
TreeBranch.propTypes = {
    children: React.PropTypes.node,
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

export class TreeNode extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'href', 'title', 'faIcon');
        attrs.className = classNames(
            {untitled: !this.props.title},
            attrs.className || ''
        );
        let els = [];
        // icon
        let iconClasses = classNames('icon', 'fa', 'fa-fw', this.props.faIcon || 'fa-circle-o');
        els.push(<span key={'icon'} className={iconClasses}></span>);
        // Title
        let title = this.props.title || 'Untitled';
        els.push(<span key={'title'}>{title}</span>);
        // Link?
        if (this.props.href) {
            els = [(<a key={'a'} className={classNames('title', 'page-route')} href={this.props.href}>{els}</a>)];
        } else {
            els = [(<div key={'div'} className="title">{els}</div>)];
        }
        return (
            <div {...attrs}>
                {els}
            </div>
        );
    }

}
TreeNode.propTypes = {
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

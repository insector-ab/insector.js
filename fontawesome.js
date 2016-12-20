import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';
import {Media, MediaLeft, MediaBody} from 'insectorjs/base/components';

/**
 * FAButton
 */
export function FAButton(props) {
    const attrs = _.omit(props, ... _.keys(FAButton.propTypes));
    attrs.type = attrs.type || 'button';
    attrs.title = attrs.title || props.text;
    attrs.className = classNames('btn', attrs.className || '');
    const iconCls = classNames('fa', props.faClassName || '', props.faIcon);
    return (
        <button {... attrs}>
            {props.faIcon &&
                <span className={iconCls} />
            }
            {props.text &&
                <span className="text">{props.text}</span>
            }
            {props.children}
        </button>
    );
}
FAButton.propTypes = {
    text: React.PropTypes.string.required,
    faIcon: React.PropTypes.string.required,
    faClassName: React.PropTypes.string,
    children: React.PropTypes.node
};
FAButton.defaultProps = {
    className: 'btn-default'
};

/**
 * FANavItem
 */
export function FANavItem(props) {
    const attrs = _.omit(props, ... _.keys(FANavItem.propTypes));
    attrs.title = attrs.title || props.text;
    const classes = classNames(
        {'page-route': props.href}
    );
    return (
        <li {... attrs}>
            <a href={props.href || '#'} tabIndex="0" className={classes}>
                {props.faIcon &&
                    <span className={classNames('fa', 'fa-fw', props.faIcon)} />
                }
                <span className="text">{props.text}</span>
                {props.children}
            </a>
        </li>
    );
}
FANavItem.propTypes = {
    href: React.PropTypes.string,
    faIcon: React.PropTypes.string,
    text: React.PropTypes.string,
    children: React.PropTypes.node
};
FANavItem.defaultProps = {
    text: 'FANavItem'
};

/**
 * FAMediaItem
 */
export function FAMediaItem(props) {
    let attrs = _.omit(props, ... _.keys(FAMediaItem.propTypes));
    attrs.className = classNames('fa-media', attrs.className || '');
    return (
        <Media {... attrs}>
            <MediaLeft>
                <span className={classNames('media-object fa fa-fw', props.faSize, props.faIcon)} />
            </MediaLeft>
            <MediaBody>
                {props.children}
            </MediaBody>
        </Media>
    );
}
FAMediaItem.propTypes = {
    faIcon: React.PropTypes.string,
    faSize: React.PropTypes.string,
    children: React.PropTypes.node
};
FAMediaItem.defaultProps = {
    faicon: 'fa-circle-thin'
};

// --------- Font Awesome Tree components --------- //

/**
 * FATree
 */
export function FATree(props) {
    let attrs = _.omit(props, ... _.keys(FATree.propTypes));
    attrs.className = classNames('tree', attrs.className || '');
    return (
        <div {...attrs}>
            <FATreeNode className="root" title={props.title} faIcon={props.faIcon} />
            <ul>
                {props.children}
            </ul>
        </div>
    );
}
FATree.propTypes = {
    children: React.PropTypes.node,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

/**
 * FATreeBranch
 */
export function FATreeBranch(props) {
    let attrs = _.omit(props, ... _.keys(FATreeBranch.propTypes));
    return (
        <li {...attrs}>
            <FATreeNode href={props.href} title={props.title} faIcon={props.faIcon} />
            {props.children &&
                <ul>
                    {props.children}
                </ul>
            }
        </li>
    );
}
FATreeBranch.propTypes = {
    children: React.PropTypes.node,
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

/**
 * FATreeNode
 */
export function FATreeNode(props) {
    let attrs = _.omit(props, ... _.keys(FATreeNode.propTypes));
    attrs.className = classNames(
        {untitled: !props.title},
        attrs.className || ''
    );
    let elements = [];
    // icon
    let iconClasses = classNames('icon', 'fa', 'fa-fw', props.faIcon || 'fa-circle-o');
    elements.push(<span key={'icon'} className={iconClasses}></span>);
    // Title
    let title = props.title || 'Untitled';
    elements.push(<span key={'title'}>{title}</span>);
    // Link?
    if (props.href) {
        elements = [(<a key={'a'} className={classNames('title', 'page-route')} href={props.href}>{elements}</a>)];
    } else {
        elements = [(<div key={'div'} className="title">{elements}</div>)];
    }
    return (
        <div {...attrs}>
            {elements}
        </div>
    );
}
FATreeNode.propTypes = {
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string
};

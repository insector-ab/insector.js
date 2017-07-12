import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getAttrs} from 'insector-utils';
import {Media, MediaLeft, MediaBody} from './media';

/**
 * FAButton
 */
export function FAButton(props) {
    const attrs = getAttrs(props, FAButton);
    attrs.type = attrs.type || 'button';
    attrs.title = attrs.title || props.text;
    attrs.className = classNames(
        'btn',
        (props.active ? props.btnActiveClassName : props.btnClassName),
        {active: props.active},
        attrs.className || ''
    );
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
    text: PropTypes.string,
    faIcon: PropTypes.string,
    faClassName: PropTypes.string,
    btnClassName: PropTypes.string,
    active: PropTypes.bool,
    btnActiveClassName: PropTypes.string,
    children: PropTypes.node
};
FAButton.defaultProps = {
    btnClassName: 'btn-default'
};

/**
 * FANavItem
 */
export function FANavItem(props) {
    const attrs = getAttrs(props, FANavItem);
    return (
        <li className={classNames('nav-item', {'active': props.active})}>
            <FALink {...attrs}>{props.children}</FALink>
        </li>
    );
}
FANavItem.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node
};

/**
 * FALink
 */
export function FALink(props) {
    const attrs = getAttrs(props, FALink);
    attrs.title = attrs.title || props.text;
    return (
        <a {...attrs}>
            {props.faIcon &&
                <span className={classNames('fa', 'fa-fw', props.faIcon)} />
            }
            {props.text &&
                <span className="text">{props.text}</span>
            }
            {props.children}
        </a>
    );
}
FALink.propTypes = {
    faIcon: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.node
};
FALink.defaultProps = {
    href: '#'
};

/**
 * FAMediaItem
 */
export function FAMediaItem(props) {
    let attrs = getAttrs(props, FAMediaItem);
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
    faIcon: PropTypes.string,
    faSize: PropTypes.string,
    children: PropTypes.node
};
FAMediaItem.defaultProps = {
    faicon: 'fa-circle-thin'
};

// --------- Font Awesome Tree components --------- //

/**
 * FATree
 */
export function FATree(props) {
    let attrs = getAttrs(props, FATree);
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
    children: PropTypes.node,
    title: PropTypes.string,
    faIcon: PropTypes.string
};

/**
 * FATreeBranch
 */
export function FATreeBranch(props) {
    let attrs = getAttrs(props, FATreeBranch);
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
    children: PropTypes.node,
    href: PropTypes.string,
    title: PropTypes.string,
    faIcon: PropTypes.string
};

/**
 * FATreeNode
 */
export function FATreeNode(props) {
    let attrs = getAttrs(props, FATreeNode);
    attrs.className = classNames(
        {untitled: !props.title},
        attrs.className || ''
    );
    let elements = [];
    // icon
    let iconClasses = classNames('icon', 'fa', 'fa-fw', props.faIcon || 'fa-circle-o');
    elements.push(<span key={'icon'} className={iconClasses} />);
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
    href: PropTypes.string,
    title: PropTypes.string,
    faIcon: PropTypes.string
};

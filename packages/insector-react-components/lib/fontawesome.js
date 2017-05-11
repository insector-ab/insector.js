'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FAButton = FAButton;
exports.FANavItem = FANavItem;
exports.FAMediaItem = FAMediaItem;
exports.FATree = FATree;
exports.FATreeBranch = FATreeBranch;
exports.FATreeNode = FATreeNode;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _insectorUtils = require('insector-utils');

var _media = require('./media');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * FAButton
 */
function FAButton(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FAButton);
    attrs.type = attrs.type || 'button';
    attrs.title = attrs.title || props.text;
    attrs.className = (0, _classnames2.default)('btn', props.active ? props.btnActiveClassName : props.btnClassName, { active: props.active }, attrs.className || '');
    var iconCls = (0, _classnames2.default)('fa', props.faClassName || '', props.faIcon);
    return _react2.default.createElement(
        'button',
        attrs,
        props.faIcon && _react2.default.createElement('span', { className: iconCls }),
        props.text && _react2.default.createElement(
            'span',
            { className: 'text' },
            props.text
        ),
        props.children
    );
}
FAButton.propTypes = {
    text: _propTypes2.default.string,
    faIcon: _propTypes2.default.string,
    faClassName: _propTypes2.default.string,
    btnClassName: _propTypes2.default.string,
    active: _propTypes2.default.bool,
    btnActiveClassName: _propTypes2.default.string,
    children: _propTypes2.default.node
};
FAButton.defaultProps = {
    btnClassName: 'btn-default'
};

/**
 * FANavItem
 */
function FANavItem(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FANavItem);
    attrs.className = (0, _classnames2.default)({ 'active': props.active }, attrs.className);
    attrs.title = attrs.title || props.text;
    return _react2.default.createElement(
        'li',
        attrs,
        _react2.default.createElement(
            'a',
            { href: props.href || '#', tabIndex: '0' },
            props.faIcon && _react2.default.createElement('span', { className: (0, _classnames2.default)('fa', 'fa-fw', props.faIcon) }),
            _react2.default.createElement(
                'span',
                { className: 'text' },
                props.text
            ),
            props.children
        )
    );
}
FANavItem.propTypes = {
    active: _propTypes2.default.bool,
    href: _propTypes2.default.string,
    faIcon: _propTypes2.default.string,
    text: _propTypes2.default.string,
    children: _propTypes2.default.node
};
FANavItem.defaultProps = {
    text: 'FANavItem'
};

/**
 * FAMediaItem
 */
function FAMediaItem(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FAMediaItem);
    attrs.className = (0, _classnames2.default)('fa-media', attrs.className || '');
    return _react2.default.createElement(
        _media.Media,
        attrs,
        _react2.default.createElement(
            _media.MediaLeft,
            null,
            _react2.default.createElement('span', { className: (0, _classnames2.default)('media-object fa fa-fw', props.faSize, props.faIcon) })
        ),
        _react2.default.createElement(
            _media.MediaBody,
            null,
            props.children
        )
    );
}
FAMediaItem.propTypes = {
    faIcon: _propTypes2.default.string,
    faSize: _propTypes2.default.string,
    children: _propTypes2.default.node
};
FAMediaItem.defaultProps = {
    faicon: 'fa-circle-thin'
};

// --------- Font Awesome Tree components --------- //

/**
 * FATree
 */
function FATree(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FATree);
    attrs.className = (0, _classnames2.default)('tree', attrs.className || '');
    return _react2.default.createElement(
        'div',
        attrs,
        _react2.default.createElement(FATreeNode, { className: 'root', title: props.title, faIcon: props.faIcon }),
        _react2.default.createElement(
            'ul',
            null,
            props.children
        )
    );
}
FATree.propTypes = {
    children: _propTypes2.default.node,
    title: _propTypes2.default.string,
    faIcon: _propTypes2.default.string
};

/**
 * FATreeBranch
 */
function FATreeBranch(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FATreeBranch);
    return _react2.default.createElement(
        'li',
        attrs,
        _react2.default.createElement(FATreeNode, { href: props.href, title: props.title, faIcon: props.faIcon }),
        props.children && _react2.default.createElement(
            'ul',
            null,
            props.children
        )
    );
}
FATreeBranch.propTypes = {
    children: _propTypes2.default.node,
    href: _propTypes2.default.string,
    title: _propTypes2.default.string,
    faIcon: _propTypes2.default.string
};

/**
 * FATreeNode
 */
function FATreeNode(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FATreeNode);
    attrs.className = (0, _classnames2.default)({ untitled: !props.title }, attrs.className || '');
    var elements = [];
    // icon
    var iconClasses = (0, _classnames2.default)('icon', 'fa', 'fa-fw', props.faIcon || 'fa-circle-o');
    elements.push(_react2.default.createElement('span', { key: 'icon', className: iconClasses }));
    // Title
    var title = props.title || 'Untitled';
    elements.push(_react2.default.createElement(
        'span',
        { key: 'title' },
        title
    ));
    // Link?
    if (props.href) {
        elements = [_react2.default.createElement(
            'a',
            { key: 'a', className: (0, _classnames2.default)('title', 'page-route'), href: props.href },
            elements
        )];
    } else {
        elements = [_react2.default.createElement(
            'div',
            { key: 'div', className: 'title' },
            elements
        )];
    }
    return _react2.default.createElement(
        'div',
        attrs,
        elements
    );
}
FATreeNode.propTypes = {
    href: _propTypes2.default.string,
    title: _propTypes2.default.string,
    faIcon: _propTypes2.default.string
};
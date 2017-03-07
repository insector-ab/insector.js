import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {getAttrs} from '../helpers';
import './style.scss';

// --------- Media components (composition) --------- //

/**
 * Media
 */
export function Media(props) {
    const attrs = getAttrs(props, Media);
    attrs.className = classNames('media', attrs.className || '');
    return (
        <div {...attrs}>
            {props.children}
        </div>
    );
}
Media.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaLeft
 */
export function MediaLeft(props) {
    const attrs = getAttrs(props, MediaLeft);
    attrs.className = classNames('media-left', attrs.className || '');
    return (
        <div {...attrs}>
            {props.children}
        </div>
    );
}
MediaLeft.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaBody
 */
export function MediaBody(props) {
    const attrs = getAttrs(props, MediaBody);
    attrs.className = classNames('media-body', attrs.className || '');
    return (
        <div {...attrs}>
            {props.children}
        </div>
    );
}
MediaBody.propTypes = {
    children: React.PropTypes.node
};

// --------- Tab components (composition) --------- //

/**
 * Tabs
 */
export function Tabs(props) {
    const attrs = getAttrs(props, Tabs);
    attrs.className = classNames(
        'nav',
        'nav-tabs',
        attrs.className || ''
    );
    return (
        <ul {...attrs}>
            {props.children}
        </ul>
    );
}
Tabs.propTypes = {
    children: React.PropTypes.node
};

/**
 * Tab
 */
export function Tab(props) {
    const attrs = getAttrs(props, Tab);
    attrs.className = classNames(
        {'active': props.active},
        attrs.className || ''
    );
    return (
        <li {...attrs}>
            <a title={props.title}
               href={props.href}
               className="page-route">{props.text}</a>
        </li>
    );
}
Tab.propTypes = {
    active: React.PropTypes.bool,
    title: React.PropTypes.string,
    text: React.PropTypes.string,
    href: React.PropTypes.string
};

// --------- Modal components (composition) --------- //

/**
 * Modal
 */
export class Modal extends React.Component {

    componentDidMount() {
        const $el = $(ReactDOM.findDOMNode(this));
        if (this.props.modalOptions) {
            $el.modal(this.props.modalOptions);
        } else {
            $el.modal('show');
        }
    }

    render() {
        const attrs = getAttrs(this.props, Modal);
        attrs.className = classNames('modal', 'fade', attrs.className || '');
        let dialogCls = classNames('modal-dialog', 'modal-' + this.props.size);
        return (
            <div {...attrs} data-modal-key={this.props.key}>
                <div className={dialogCls}>
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}
Modal.propTypes = {
    modalOptions: React.PropTypes.object,
    key: React.PropTypes.string,
    size: React.PropTypes.string,
    children: React.PropTypes.node
};
Modal.defaultProps = {
    size: 'md'
};

/**
 * ModalHeader
 */
export function ModalHeader(props) {
    const attrs = getAttrs(props, ModalHeader);
    attrs.className = classNames('modal-header', attrs.className || '');
    return (
        <div {...attrs}>
            <ModalCloseButton />
            {this.props.children}
        </div>
    );
}
ModalHeader.propTypes = {
    children: React.PropTypes.node
};

/**
 * ModalBody
 */
export function ModalBody(props) {
    const attrs = getAttrs(props, ModalBody);
    attrs.className = classNames('modal-body', attrs.className || '');
    return (
        <div {...attrs}>
            {props.closeButton &&
                <ModalCloseButton />
            }
            {props.children}
        </div>
    );
}
ModalBody.propTypes = {
    closeButton: React.PropTypes.bool,
    children: React.PropTypes.node
};

/**
 * ModalFooter
 */
export function ModalFooter(props) {
    const attrs = getAttrs(props, ModalFooter);
    attrs.className = classNames('modal-footer', attrs.className || '');
    return (
        <div {...attrs}>
            {props.children}
        </div>
    );
}
ModalFooter.propTypes = {
    children: React.PropTypes.node
};

/**
 * ModalCloseButton
 */
export function ModalCloseButton(props) {
    return (
        <button type="button" className="close modal-close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    );
}

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getAttrs} from 'insector-utils';
import createWrapperComponent from './create-wrapper-component';

/**
 * FormModal
 */
export function FormModal(props) {
    const attrs = getAttrs(props, FormModal);
    return (
        <Modal {...attrs}>
            <ModalHeader>
                <h4 className="m-v-0">
                    {props.titleIcon &&
                        <span className={classNames('fa', 'm-r-1', props.titleIcon)} />
                    }
                    <span>{props.title}</span>
                </h4>
            </ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <DefaultModalButtons
                    confirmButtonText={props.confirmButtonText}
                    confirmButtonStyle={props.confirmButtonStyle}
                    cancelButtonText={props.cancelButtonText}
                    cancelButtonStyle={props.cancelButtonStyle}
                />
            </ModalFooter>
        </Modal>
    );
}
FormModal.propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.string,
    confirmButtonText: PropTypes.string,
    confirmButtonStyle: PropTypes.string,
    cancelButtonText: PropTypes.string,
    cancelButtonStyle: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.node
};
FormModal.defaultProps = {
    titleIcon: 'fa-pencil',
    confirmButtonText: 'Save',
    confirmButtonStyle: 'btn-primary',
    cancelButtonText: 'Cancel',
    cancelButtonStyle: 'btn-default'
};

/**
 * ConfirmModal
 */
export function ConfirmModal(props) {
    const attrs = getAttrs(props, ConfirmModal);
    return (
        <Modal {...attrs}>
            <ModalBody closeButton={true}>
                {props.children}
                <DefaultModalButtons
                    confirmButtonText={props.confirmButtonText}
                    confirmButtonStyle={props.confirmButtonStyle}
                    cancelButtonText={props.cancelButtonText}
                    cancelButtonStyle={props.cancelButtonStyle}
                />
            </ModalBody>
        </Modal>
    );
}
ConfirmModal.propTypes = {
    confirmButtonText: PropTypes.string,
    confirmButtonStyle: PropTypes.string,
    cancelButtonText: PropTypes.string,
    cancelButtonStyle: PropTypes.string,
    children: PropTypes.node
};
ConfirmModal.defaultProps = {
    size: 'sm',
    confirmButtonText: 'OK',
    confirmButtonStyle: 'btn-primary',
    cancelButtonText: 'Cancel',
    cancelButtonStyle: 'btn-default'
};

/**
 * DefaultDeleteModal
 */
export function DefaultDeleteModal(props) {
    const attrs = getAttrs(props, DefaultDeleteModal);
    return (
        <DeleteModal {...attrs}>
            <div className="text-center">
                <span className="fa fa-2x fa-warning top-icon" />
                <div className="m-t-1 m-b-2">{props.children}</div>
            </div>
        </DeleteModal>
    );
}
DefaultDeleteModal.propTypes = {
    children: PropTypes.node
};

/**
 * DeleteModal
 */
export function DeleteModal(props) {
    const attrs = getAttrs(props, DeleteModal);
    return (
        <ConfirmModal {...attrs}>
            {props.children}
        </ConfirmModal>
    );
}
DeleteModal.propTypes = {
    children: PropTypes.node
};
DeleteModal.defaultProps = {
    size: 'sm',
    confirmButtonText: 'Delete',
    confirmButtonStyle: 'btn-danger'
};

/**
 * AlertModal
 */
export function AlertModal(props) {
    const attrs = getAttrs(props, AlertModal);
    attrs.size = attrs.size || 'sm';
    return (
        <Modal {...attrs}>
            <ModalBody>
                {props.children}
                <button
                    type="button"
                    className={classNames('modal-ok', 'btn', 'btn-block', props.okButtonStyle)}
                    data-dismiss="modal"
                >
                    {props.okButtonText}
                </button>
            </ModalBody>
        </Modal>
    );
}
AlertModal.propTypes = {
    okButtonText: PropTypes.string,
    okButtonStyle: PropTypes.string,
    children: PropTypes.node
};
AlertModal.defaultProps = {
    okButtonText: 'OK',
    okButtonStyle: 'btn-default'
};

/**
 * DefaultModalButtons
 */
export function DefaultModalButtons(props) {
    const attrs = getAttrs(props, DefaultModalButtons);
    attrs.className = classNames('text-right', attrs.className || '');
    const cancelStyles = classNames('btn', 'pull-left', props.cancelButtonStyle, 'modal-cancel');
    const confirmStyles = classNames('btn', props.confirmButtonStyle, 'modal-ok');
    return (
        <div {...attrs}>
            <button
                type="button"
                className={cancelStyles}
                tabIndex={-1}
                data-dismiss="modal"
            >
                {props.cancelButtonText}
            </button>
            <button
                type="button"
                className={confirmStyles}
            >
                {props.confirmButtonText}
            </button>
        </div>
    );
}
DefaultModalButtons.propTypes = {
    confirmButtonText: PropTypes.string,
    confirmButtonStyle: PropTypes.string,
    cancelButtonText: PropTypes.string,
    cancelButtonStyle: PropTypes.string
};
DefaultModalButtons.defaultProps = {
    confirmButtonText: 'OK',
    confirmButtonStyle: 'btn-primary',
    cancelButtonText: 'Cancel',
    cancelButtonStyle: 'btn-default'
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
        const dialogCls = classNames('modal-dialog', 'modal-' + this.props.size);
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
    modalOptions: PropTypes.object,
    key: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.node
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
            {props.children}
        </div>
    );
}
ModalHeader.propTypes = {
    children: PropTypes.node
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
    closeButton: PropTypes.bool,
    children: PropTypes.node
};

/**
 * ModalFooter
 */
export const ModalFooter = createWrapperComponent('modal-footer');

/**
 * ModalCloseButton
 */
export function ModalCloseButton(props) {
    return (
        <button
            type="button"
            className="close modal-close"
            data-dismiss="modal"
            aria-label="Close"
        >
            <span aria-hidden="true">&times;</span>
        </button>
    );
}

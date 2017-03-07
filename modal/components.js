import React from 'react';
import classNames from 'classnames';
import {Modal, ModalHeader, ModalBody, ModalFooter} from '../bootstrap/components';
import {getAttrs} from '../helpers';
import 'bootstrap-sass';
import './style.scss';

/**
 * FormModal
 */
export class FormModal extends React.Component {

    render() {
        let attrs = getAttrs(this.props, FormModal);
        return (
            <Modal {...attrs}>
                <ModalHeader>
                    <h4 className="m-v-0">
                        {this.props.titleIcon &&
                            <span className={classNames('fa', 'm-r-05', this.props.titleIcon)} />
                        }
                        <span>{this.props.title}</span>
                    </h4>
                </ModalHeader>
                <ModalBody>
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <DefaultModalButtons confirmButtonText={this.props.confirmButtonText}
                                         confirmButtonStyle={this.props.confirmButtonStyle}
                                         cancelButtonText={this.props.cancelButtonText}
                                         cancelButtonStyle={this.props.cancelButtonStyle} />
                </ModalFooter>
            </Modal>
        );
    }

}
FormModal.propTypes = {
    title: React.PropTypes.string,
    titleIcon: React.PropTypes.string,
    confirmButtonText: React.PropTypes.string,
    confirmButtonStyle: React.PropTypes.string,
    cancelButtonText: React.PropTypes.string,
    cancelButtonStyle: React.PropTypes.string,
    size: React.PropTypes.string,
    children: React.PropTypes.node
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
export class ConfirmModal extends React.Component {

    render() {
        let attrs = getAttrs(this.props, ConfirmModal);
        return (
            <Modal {...attrs}>
                <ModalBody closeButton={true}>
                    {this.props.children}
                    <DefaultModalButtons confirmButtonText={this.props.confirmButtonText}
                                         confirmButtonStyle={this.props.confirmButtonStyle}
                                         cancelButtonText={this.props.cancelButtonText}
                                         cancelButtonStyle={this.props.cancelButtonStyle} />
                </ModalBody>
            </Modal>
        );
    }

}
ConfirmModal.propTypes = {
    confirmButtonText: React.PropTypes.string,
    confirmButtonStyle: React.PropTypes.string,
    cancelButtonText: React.PropTypes.string,
    cancelButtonStyle: React.PropTypes.string,
    children: React.PropTypes.node
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
export class DefaultDeleteModal extends React.Component {

    render() {
        let attrs = getAttrs(this.props, DefaultDeleteModal);
        return (
            <DeleteModal {...attrs}>
                <div className="text-center">
                    <span className="fa fa-2x fa-warning top-icon" />
                    <div className="m-t-1 m-b-2">{this.props.children}</div>
                </div>
            </DeleteModal>
        );
    }

}
DefaultDeleteModal.propTypes = {
    children: React.PropTypes.node
};

/**
 * DeleteModal
 */
export class DeleteModal extends React.Component {

    render() {
        let attrs = getAttrs(this.props, DeleteModal);
        return (
            <ConfirmModal {...attrs}>
                {this.props.children}
            </ConfirmModal>
        );
    }

}
DeleteModal.propTypes = {
    children: React.PropTypes.node
};
DeleteModal.defaultProps = {
    size: 'sm',
    confirmButtonText: 'Delete',
    confirmButtonStyle: 'btn-danger'
};

/**
 * AlertModal
 */
export class AlertModal extends React.Component {

    render() {
        let attrs = getAttrs(this.props, AlertModal);
        attrs.size = attrs.size || 'sm';
        return (
            <Modal {...attrs}>
                <ModalBody>
                    {this.props.children}
                    <button type="button"
                            className={classNames('modal-ok', 'btn', 'btn-block', this.props.okButtonStyle)}
                            data-dismiss="modal">{this.props.okButtonText}</button>
                </ModalBody>
            </Modal>
        );
    }

}
AlertModal.propTypes = {
    okButtonText: React.PropTypes.string,
    okButtonStyle: React.PropTypes.string,
    children: React.PropTypes.node
};
AlertModal.defaultProps = {
    okButtonText: 'OK',
    okButtonStyle: 'btn-default'
};

/**
 * DefaultModalButtons
 */
export class DefaultModalButtons extends React.Component {

    render() {
        let attrs = getAttrs(this.props, DefaultModalButtons);
        attrs.className = classNames('text-right', attrs.className || '');
        let cancelStyles = classNames('btn', 'pull-left', this.props.cancelButtonStyle, 'modal-cancel');
        let confirmStyles = classNames('btn', this.props.confirmButtonStyle, 'modal-ok');
        return (
            <div {...attrs}>
                <button type="button" className={cancelStyles} tabIndex={-1} data-dismiss="modal">
                    {this.props.cancelButtonText}
                </button>
                <button type="button" className={confirmStyles}>
                    {this.props.confirmButtonText}
                </button>
            </div>
        );
    }

}
DefaultModalButtons.propTypes = {
    confirmButtonText: React.PropTypes.string,
    confirmButtonStyle: React.PropTypes.string,
    cancelButtonText: React.PropTypes.string,
    cancelButtonStyle: React.PropTypes.string
};
DefaultModalButtons.defaultProps = {
    confirmButtonText: 'OK',
    confirmButtonStyle: 'btn-primary',
    cancelButtonText: 'Cancel',
    cancelButtonStyle: 'btn-default'
};

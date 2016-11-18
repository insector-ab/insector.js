import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

/**
 * FormModal
 */
export class FormModal extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FormModal.propTypes));
        return (
            <Modal {... attrs}>
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
        let attrs = _.omit(this.props, ... _.keys(ConfirmModal.propTypes));
        return (
            <Modal {... attrs}>
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
        let attrs = _.omit(this.props, ... _.keys(DefaultDeleteModal.propTypes));
        return (
            <DeleteModal {... attrs}>
                <div className="modal-message text-center">
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
        let attrs = _.omit(this.props, ... _.keys(DeleteModal.propTypes));
        return (
            <ConfirmModal {... attrs}>
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
        let attrs = _.omit(this.props, ... _.keys(AlertModal.propTypes));
        attrs.size = attrs.size || 'sm';
        return (
            <Modal {... attrs}>
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
 * CloseButton
 */
export class CloseButton extends React.Component {

    render() {
        return (
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        );
    }

}

/**
 * Modal, composition version
 */
export class Modal extends React.Component {

    componentDidMount() {
        let $el = $(ReactDOM.findDOMNode(this));
        if (this.props.modalOptions) {
            $el.modal(this.props.modalOptions);
        } else {
            $el.modal('show');
        }
    }

    render() {
        let attrs = _.omit(this.props, ... _.keys(Modal.propTypes));
        attrs.className = classNames('modal', 'fade', attrs.className || '');
        let dialogCls = classNames('modal-dialog', 'modal-' + this.props.size);
        return (
            <div {... attrs}>
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
    size: React.PropTypes.string,
    children: React.PropTypes.node
};
Modal.defaultProps = {
    size: 'md'
};

/**
 * ModalHeader
 */
export class ModalHeader extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(ModalHeader.propTypes));
        attrs.className = classNames('modal-header', attrs.className || '');
        return (
            <div {... attrs}>
                <CloseButton />
                {this.props.children}
            </div>
        );
    }

}
ModalHeader.propTypes = {
    children: React.PropTypes.node
};

/**
 * ModalBody
 */
export class ModalBody extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(ModalBody.propTypes));
        attrs.className = classNames('modal-body', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.closeButton &&
                    <CloseButton />
                }
                {this.props.children}
            </div>
        );
    }

}
ModalBody.propTypes = {
    closeButton: React.PropTypes.bool,
    children: React.PropTypes.node
};

/**
 * ModalFooter
 */
export class ModalFooter extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(ModalFooter.propTypes));
        attrs.className = classNames('modal-footer', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.children}
            </div>
        );
    }

}
ModalFooter.propTypes = {
    children: React.PropTypes.node
};

/**
 * DefaultModalButtons
 */
export class DefaultModalButtons extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(DefaultModalButtons.propTypes));
        attrs.className = classNames('text-right', attrs.className || '');
        let cancelStyles = classNames('btn', 'pull-left', this.props.cancelButtonStyle);
        let confirmStyles = classNames('modal-ok', 'btn', this.props.confirmButtonStyle);
        return (
            <div {... attrs}>
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

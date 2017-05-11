'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModalFooter = exports.Modal = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.FormModal = FormModal;
exports.ConfirmModal = ConfirmModal;
exports.DefaultDeleteModal = DefaultDeleteModal;
exports.DeleteModal = DeleteModal;
exports.AlertModal = AlertModal;
exports.DefaultModalButtons = DefaultModalButtons;
exports.ModalHeader = ModalHeader;
exports.ModalBody = ModalBody;
exports.ModalCloseButton = ModalCloseButton;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _insectorUtils = require('insector-utils');

var _createWrapperComponent = require('./create-wrapper-component');

var _createWrapperComponent2 = _interopRequireDefault(_createWrapperComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * FormModal
 */
function FormModal(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, FormModal);
    return _react2.default.createElement(
        Modal,
        attrs,
        _react2.default.createElement(
            ModalHeader,
            null,
            _react2.default.createElement(
                'h4',
                { className: 'm-v-0' },
                props.titleIcon && _react2.default.createElement('span', { className: (0, _classnames2.default)('fa', 'm-r-1', props.titleIcon) }),
                _react2.default.createElement(
                    'span',
                    null,
                    props.title
                )
            )
        ),
        _react2.default.createElement(
            ModalBody,
            null,
            props.children
        ),
        _react2.default.createElement(
            ModalFooter,
            null,
            _react2.default.createElement(DefaultModalButtons, { confirmButtonText: props.confirmButtonText,
                confirmButtonStyle: props.confirmButtonStyle,
                cancelButtonText: props.cancelButtonText,
                cancelButtonStyle: props.cancelButtonStyle })
        )
    );
}
FormModal.propTypes = {
    title: _propTypes2.default.string,
    titleIcon: _propTypes2.default.string,
    confirmButtonText: _propTypes2.default.string,
    confirmButtonStyle: _propTypes2.default.string,
    cancelButtonText: _propTypes2.default.string,
    cancelButtonStyle: _propTypes2.default.string,
    size: _propTypes2.default.string,
    children: _propTypes2.default.node
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
function ConfirmModal(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, ConfirmModal);
    return _react2.default.createElement(
        Modal,
        attrs,
        _react2.default.createElement(
            ModalBody,
            { closeButton: true },
            props.children,
            _react2.default.createElement(DefaultModalButtons, { confirmButtonText: props.confirmButtonText,
                confirmButtonStyle: props.confirmButtonStyle,
                cancelButtonText: props.cancelButtonText,
                cancelButtonStyle: props.cancelButtonStyle })
        )
    );
}
ConfirmModal.propTypes = {
    confirmButtonText: _propTypes2.default.string,
    confirmButtonStyle: _propTypes2.default.string,
    cancelButtonText: _propTypes2.default.string,
    cancelButtonStyle: _propTypes2.default.string,
    children: _propTypes2.default.node
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
function DefaultDeleteModal(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, DefaultDeleteModal);
    return _react2.default.createElement(
        DeleteModal,
        attrs,
        _react2.default.createElement(
            'div',
            { className: 'text-center' },
            _react2.default.createElement('span', { className: 'fa fa-2x fa-warning top-icon' }),
            _react2.default.createElement(
                'div',
                { className: 'm-t-1 m-b-2' },
                props.children
            )
        )
    );
}
DefaultDeleteModal.propTypes = {
    children: _propTypes2.default.node
};

/**
 * DeleteModal
 */
function DeleteModal(props) {
    var attrs = (0, _insectorUtils.getAttrs)(this.props, DeleteModal);
    return _react2.default.createElement(
        ConfirmModal,
        attrs,
        props.children
    );
}
DeleteModal.propTypes = {
    children: _propTypes2.default.node
};
DeleteModal.defaultProps = {
    size: 'sm',
    confirmButtonText: 'Delete',
    confirmButtonStyle: 'btn-danger'
};

/**
 * AlertModal
 */
function AlertModal(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, AlertModal);
    attrs.size = attrs.size || 'sm';
    return _react2.default.createElement(
        Modal,
        attrs,
        _react2.default.createElement(
            ModalBody,
            null,
            props.children,
            _react2.default.createElement(
                'button',
                { type: 'button',
                    className: (0, _classnames2.default)('modal-ok', 'btn', 'btn-block', props.okButtonStyle),
                    'data-dismiss': 'modal' },
                props.okButtonText
            )
        )
    );
}
AlertModal.propTypes = {
    okButtonText: _propTypes2.default.string,
    okButtonStyle: _propTypes2.default.string,
    children: _propTypes2.default.node
};
AlertModal.defaultProps = {
    okButtonText: 'OK',
    okButtonStyle: 'btn-default'
};

/**
 * DefaultModalButtons
 */
function DefaultModalButtons(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, DefaultModalButtons);
    attrs.className = (0, _classnames2.default)('text-right', attrs.className || '');
    var cancelStyles = (0, _classnames2.default)('btn', 'pull-left', props.cancelButtonStyle, 'modal-cancel');
    var confirmStyles = (0, _classnames2.default)('btn', props.confirmButtonStyle, 'modal-ok');
    return _react2.default.createElement(
        'div',
        attrs,
        _react2.default.createElement(
            'button',
            { type: 'button', className: cancelStyles, tabIndex: -1, 'data-dismiss': 'modal' },
            props.cancelButtonText
        ),
        _react2.default.createElement(
            'button',
            { type: 'button', className: confirmStyles },
            props.confirmButtonText
        )
    );
}
DefaultModalButtons.propTypes = {
    confirmButtonText: _propTypes2.default.string,
    confirmButtonStyle: _propTypes2.default.string,
    cancelButtonText: _propTypes2.default.string,
    cancelButtonStyle: _propTypes2.default.string
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

var Modal = exports.Modal = function (_React$Component) {
    _inherits(Modal, _React$Component);

    function Modal() {
        _classCallCheck(this, Modal);

        return _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
    }

    _createClass(Modal, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var $el = (0, _jquery2.default)(_reactDom2.default.findDOMNode(this));
            if (this.props.modalOptions) {
                $el.modal(this.props.modalOptions);
            } else {
                $el.modal('show');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var attrs = (0, _insectorUtils.getAttrs)(this.props, Modal);
            attrs.className = (0, _classnames2.default)('modal', 'fade', attrs.className || '');
            var dialogCls = (0, _classnames2.default)('modal-dialog', 'modal-' + this.props.size);
            return _react2.default.createElement(
                'div',
                _extends({}, attrs, { 'data-modal-key': this.props.key }),
                _react2.default.createElement(
                    'div',
                    { className: dialogCls },
                    _react2.default.createElement(
                        'div',
                        { className: 'modal-content' },
                        this.props.children
                    )
                )
            );
        }
    }]);

    return Modal;
}(_react2.default.Component);

Modal.propTypes = {
    modalOptions: _propTypes2.default.object,
    key: _propTypes2.default.string,
    size: _propTypes2.default.string,
    children: _propTypes2.default.node
};
Modal.defaultProps = {
    size: 'md'
};

/**
 * ModalHeader
 */
function ModalHeader(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, ModalHeader);
    attrs.className = (0, _classnames2.default)('modal-header', attrs.className || '');
    return _react2.default.createElement(
        'div',
        attrs,
        _react2.default.createElement(ModalCloseButton, null),
        props.children
    );
}
ModalHeader.propTypes = {
    children: _propTypes2.default.node
};

/**
 * ModalBody
 */
function ModalBody(props) {
    var attrs = (0, _insectorUtils.getAttrs)(props, ModalBody);
    attrs.className = (0, _classnames2.default)('modal-body', attrs.className || '');
    return _react2.default.createElement(
        'div',
        attrs,
        props.closeButton && _react2.default.createElement(ModalCloseButton, null),
        props.children
    );
}
ModalBody.propTypes = {
    closeButton: _propTypes2.default.bool,
    children: _propTypes2.default.node
};

/**
 * ModalFooter
 */
var ModalFooter = exports.ModalFooter = (0, _createWrapperComponent2.default)('modal-footer');

/**
 * ModalCloseButton
 */
function ModalCloseButton(props) {
    return _react2.default.createElement(
        'button',
        { type: 'button', className: 'close modal-close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
        _react2.default.createElement(
            'span',
            { 'aria-hidden': 'true' },
            '\xD7'
        )
    );
}
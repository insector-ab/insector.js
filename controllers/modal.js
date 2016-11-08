import $ from 'jquery';
import ReactController from 'insectorjs/react/controller';

/**
 * ModalController
 */
export default class ModalController extends ReactController {

    constructor(model) {
        super(model);
        this._handlers = {};
    }

    events() {
        return {
            'click .modal-ok:not(.disabled)': 'onOKClick',
            'hidden.bs.modal': 'onModalHidden'
        };
    }

    onOKClick(event) {
        let $el = $(event.target).closest('div.modal');
        let id = $el.attr('id');
        this.invokeHandlers(id, 'ok');
    }

    onModalHidden(event) {
        let $el = $(event.target).closest('div.modal');
        let id = $el.attr('id');
        this.invokeHandlers(id, 'hidden');
        // delete refs to handlers
        delete this._handlers[id];
        // hide modal
        this.model.set(id, false);
    }

    show(id) {
        // new handlers object
        this._handlers[id] = {
            ok: [],
            hidden: []
        };
        let handlers = {
            ok: (handler) => {
                this._handlers[id]['ok'].push(handler);
                return handlers;
            },
            hidden: (handler) => {
                this._handlers[id]['hidden'].push(handler);
                return handlers;
            }
        };
        // mark as visible
        this.model.set(id, true);
        return handlers;
    }

    hide(id) {
        let $el = this.$('div.modal#' + id);
        $el.modal('hide');
    }

    invokeHandlers(id, type) {
        let handlers = this.getHandlers(id, type);
        if (handlers) {
            for (let i = 0, il = handlers.length; i < il; i++) {
                handlers[i]();
            }
        }
    }

    getHandlers(id, type) {
        if (this._handlers.hasOwnProperty(id)) {
            return this._handlers[id][type];
        }
        return null;
    }

}

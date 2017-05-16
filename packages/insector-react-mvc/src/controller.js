import $ from 'jquery';
import ReactDOM from 'react-dom';
import isFunction from 'lodash.isfunction';
import uniqueId from 'lodash.uniqueid';
import result from 'lodash.result';

/**
 * ReactController
 */
export default class ReactController {

    constructor(model, view) {
        // public
        this.cid = uniqueId('controller');
        // private
        this._model = model;
        this._view = view;
        this._delegatedEl = undefined;
    }

    events() {
        return {};
    }

    get model() {
        return this._model;
    }
    set model(value) {
        if (value !== this._model) {
            // Remove listeners from current model
            this._removeModelEventListeners();
            // Set new model
            this._model = value;
            // Add listeners to new model
            this._addModelEventListeners();
        }
    }

    get view() {
        return this._view;
    }
    set view(value) {
        this._view = value;
    }

    get element() {
        return ReactDOM.findDOMNode(this.view);
    }

    dispatchDOMEvent(event, target) {
        // console.log(this.constructor.name, 'dispatchDOMEvent', event.type);
        event.target = target || this.element;
        $(event.target).trigger(event.type, event);
    }

    delegateEvents(targetEl) {
        targetEl = targetEl || this.element;
        let events = result(this, 'events');
        let key;
        // Events, but no target found, throw error.
        if (events && !targetEl) {
            throw new Error('Could not delegate controller events. No target element.');
        }
        // Events found, delegate
        if (events) {
            // Undelegate
            this.undelegateEvents();
            let method, match, eventName, selector;
            // Delegate
            for (key in events) {
                if (!events.hasOwnProperty(key)) { continue; }
                method = events[key];
                if (!isFunction(method)) { method = this[ events[key] ]; }
                if (!method) { continue; }
                match = key.match(/^(\S+)\s*(.*)$/);
                eventName = match[1];
                selector = match[2];
                method = method.bind(this);
                eventName += '.delegateEvents' + this.cid;
                if (selector === '') {
                    $(targetEl).on(eventName, method);
                } else {
                    $(targetEl).on(eventName, selector, method);
                }
            }
            // Save new target
            this._delegatedEl = targetEl;
        }
        // Return
        return this;
    }

    undelegateEvents() {
        if (this._delegatedEl) {
            $(this._delegatedEl).off('.delegateEvents' + this.cid);
        }
        return this;
    }

    dispose() {
        this.removeModelEventListeners();
        this.removeViewEventListeners();
        // delete refs
        this._deleteReferences();
    }

    addModelEventListeners(model) {
        // Abstract
    }

    removeModelEventListeners(model) {
        // Abstract
    }

    addViewEventListeners(targetEl) {
        this.delegateEvents(targetEl);
    }

    removeViewEventListeners() {
        this.undelegateEvents();
    }

    _deleteReferences() {
        delete this._model;
        delete this._component;
        delete this._delegatedEl;
    }

}

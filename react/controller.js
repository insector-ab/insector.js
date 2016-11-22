import $ from 'jquery';
import _ from 'lodash';
import ReactDOM from 'react-dom';

/**
 * ReactController
 */
export default class ReactController {

    constructor(model, component) {
        // public
        this.cid = _.uniqueId('controller');
        // private
        this._model = model;
        this._component = component;
        this._delegatedEl = null;
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
            this._removeEventListeners();
            // Set new model
            this._model = value;
            // Add listeners to new model
            this._addEventListeners();
        }
    }

    get component() {
        return this._component;
    }
    set component(value) {
        this._component = value;

        // set component in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].component = value;
            }
        }
    }

    get componentEl() {
        return ReactDOM.findDOMNode(this.component);
    }

    get view() {
        return this.component;
    }

    $(selector) {
        return $(this.componentEl).find(selector);
    }

    dispatchDOMEvent(event, target) {
        console.log(this.constructor.name, 'dispatchDOMEvent', event.type);
        event.target = target || this.componentEl;
        $(event.target).trigger(event.type, event);
    }

    componentWillMount() {
        // call componentWillMount in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].componentWillMount();
            }
        }
    }

    // split up _addEventListeners into addModelEventListeners & addViewEventListeners
    // run _addModelEventListeners in componentWillMount
    // run _addViewEventListeners in componentDidMount
    componentDidMount() {
        // Listeners
        this._addEventListeners();
        // call componentDidMount in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].componentDidMount();
            }
        }
    }

    componentWillUnmount() {
        // Listeners
        this._removeEventListeners();

        // call componentWillUnmount in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].componentWillUnmount();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // Add abstract method to handle new props?
        // e.g. if new ID set, load new data ...

        // call componentWillReceiveProps in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].componentWillReceiveProps(nextProps);
            }
        }
    }

    componentDidUpdate() {
        // ABSTRACT
    }

    delegateEvents(targetEl) {
        targetEl = targetEl || this.componentEl;
        let events = _.result(this, 'events');
        let key;
        // Events, but no target found, throw error.
        if (events && !targetEl) {
            throw Error('Could not delegate controller events. No target element.');
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
                if (!_.isFunction(method)) { method = this[ events[key] ]; }
                if (!method) { continue; }
                match = key.match(/^(\S+)\s*(.*)$/);
                eventName = match[1];
                selector = match[2];
                method = _.bind(method, this);
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

        // call delegateEvents in subcontrollers
        for (key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].delegateEvents(targetEl);
            }
        }

        // Return
        return this;
    }

    undelegateEvents() {
        if (this._delegatedEl) {
            $(this._delegatedEl).off('.delegateEvents' + this.cid);
        }
        // call undelegateEvents in subcontrollers
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            if (this[key] instanceof ReactController) {
                this[key].undelegateEvents();
            }
        }

        return this;
    }

    dispose() {
        this._removeEventListeners();
        // Check subcontrollers on this, recursively
        for (let attr in this) {
            if (_.isObject(this[attr]) && this[attr].hasOwnProperty('dispose')) {
                this[attr].dispose();
            }
        }
        // delete refs
        this._deleteReferences();
    }

    _addEventListeners() {
        // Abstract
    }

    _removeEventListeners() {
        // Abstract
    }

    _deleteReferences() {
        delete this._model;
        delete this._component;
        delete this._eventsTargetEl;
    }

}

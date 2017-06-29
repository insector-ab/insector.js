import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import uniqueId from 'lodash.uniqueid';
import result from 'lodash.result';

/**
 * ReactView
 */
export default class ReactView extends React.Component {

    constructor(props) {
        super(props);
        // Unique client id
        this.cid = uniqueId('view');
    }

    get model() {
        if (isObject(this.props) && this.props.hasOwnProperty('model')) {
            return this.props.model;
        }
        if (this.hasOwnProperty('_model')) {
            return this._model;
        }
    }

    get element() {
        return ReactDOM.findDOMNode(this);
    }

    events() {
        return {};
    }

    dispose() {
        this.removeEventListeners();
        this._dispose();
        this._deleteReferences();
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', this.constructor.name, this.cid);
        if (nextProps.model !== this.model) {
            // Remove listeners from current model
            this.removeEventListeners();
            // If new model
            if (nextProps.model) {
                // Add to new model
                this.addEventListeners(nextProps.model);
            }
        }
    }

    componentDidMount() {
        // Add listeners
        this.addEventListeners();
    }

    componentWillUnmount() {
        // Dispose
        this.dispose();
    }

    addEventListeners(model) {
        this._delegateEvents(model || this.model);
    }

    removeEventListeners() {
        this._undelegateEvents();
    }

    _delegateEvents(target) {
        target = target || this.model;
        const events = this._getResolvedEvents();
        // Events found, delegate
        if (events) {
            // Events, but no target found, throw error.
            if (!target) {
                throw new Error('Could not delegate controller events. No target model.');
            }
            // Undelegate
            this._undelegateEvents();
            // Delegate
            Object.keys(events).forEach(key => {
                target.addListener(key, events[key]);
            });
            // Save target
            this._delegatedTarget = target;
        }
        // Return
        return this;
    }

    _undelegateEvents(target) {
        target = target || this._delegatedTarget || this.model;
        // Undelegate
        if (this._resolvedEvents) {
            Object.keys(this._resolvedEvents).forEach(key => {
                target.removeListener(key, this._resolvedEvents[key]);
            });
        }
        // Return
        return this;
    }

    _getResolvedEvents() {
        if (!this._resolvedEvents) {
            const events = result(this, 'events');
            if (!events) {
                return;
            }
            this._resolvedEvents = {};
            Object.keys(events).forEach(key => {
                this._resolvedEvents[key] = this._getEventHandler(key, events);
            });
        }
        return this._resolvedEvents;
    }

    _getEventHandler(key, events) {
        events = events || result(this, 'events');
        let handler = events[key];
        if (!isFunction(handler)) {
            handler = this[ events[key] ];
        }
        if (!handler) {
            throw new Error('Could not find handler for event "' + key + '".');
        }
        return handler.bind(this);
    }

    _dispose() {
        // Abstract
    }

    _deleteReferences() {
        delete this.cid;
        delete this._model;
        delete this._delegatedTarget;
        // Resolved event handlers
        Object.keys(this._resolvedEvents || {}).forEach(key => {
            delete this._resolvedEvents[key];
        });
        delete this._resolvedEvents;
    }

}
ReactView.propTypes = {
    model: PropTypes.object
};
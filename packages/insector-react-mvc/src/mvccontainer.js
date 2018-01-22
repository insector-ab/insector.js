import React from 'react';
import uniqueId from 'lodash.uniqueid';

/**
 * MVCContainer
 */
export default class MVCContainer extends React.Component {

    constructor(props) {
        super(props);
        // Unique client id
        this.cid = uniqueId('moduleview');
        // Model
        const model = this._newModelInstance(props);
        // Controller
        this._controller = this._newControllerInstance(model, props);
        // Initialize promise
        this._initializePromise = undefined;
        // Binds
        this.onInitializeFulfilled = this.onInitializeFulfilled.bind(this);
        this.onInitializeRejected = this.onInitializeRejected.bind(this);
    }

    get model() {
        return this.controller && this.controller.model;
    }

    get view() {
        if (!this.refs.hasOwnProperty('view')) {
            throw new Error('No ref attribute in ' + this.constructor.name + '.render: <MVCContainer ref="view" />.');
        }
        return this.refs.view;
    }

    get controller() {
        return this._controller;
    }

    render() {
        return <div ref="view" />;
    }

    get needsInitializing() {
        return !(this.model.initialized || this._initializePromise);
    }

    doInitialize(props) {
        if (this._initializePromise) {
            throw new Error('doInitialize called while initializing.');
        }
        this._initializePromise = this.controller.initialize(props)
                                                 .then(this.onInitializeFulfilled,
                                                       this.onInitializeRejected);
    }

    dispose() {
        this._dispose();
        this._deleteReferences();
    }

    componentWillMount() {
        // Add model event listeners
        this.controller.addModelEventListeners(this.model);
        // Initialize
        if (this.needsInitializing) {
            this.doInitialize(this.props);
        }
    }

    componentDidMount() {
        // Set view in controller
        this.controller.view = this.view;
        // Add view event listeners
        this.controller.addViewEventListeners(this.view.element);
        // Initialized, launch directly
        if (this.model.initialized) {
            this.controller.launch(this.props);
        // Error if no promise
        } else if (!this._initializePromise) {
            throw new Error('MVCContainer.componentDidMount(): No this._initializePromise found and model not initialized, so controller will not launch.');
        }
    }

    componentWillUnmount() {
        // Dispose (Removes controller event listeners)
        this.dispose();
    }

    onInitializeFulfilled() {
        this._initializePromise = undefined;
        // Update model
        if (this.model) {
            this.model.initialized = true;
        }
        // Launch
        if (this.controller) {
            this.controller.launch(this.props);
        }
    }

    onInitializeRejected(reason) {
        throw new Error(`${this.constructor.name} initialize was rejected. Reason: "${reason}"`);
    }

    _newModelInstance(props) {
        // Abstract
    }

    _newControllerInstance(model, props) {
        // Abstract
    }

    _dispose() {
        // Dispose model
        if (typeof this.model.dispose === 'function') {
            this.model.dispose();
        }
        // Dispose controller
        if (typeof this.controller.dispose === 'function') {
            this.controller.dispose();
        }
    }

    _deleteReferences() {
        // delete refs
        delete this.cid;
        delete this._controller;
        delete this._initializePromise;
        // Binds
        delete this.onInitializeFulfilled;
        delete this.onInitializeRejected;
    }

}

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
        this._model = this._newModelInstance(props);
        // Controller
        this._controller = this._newControllerInstance(this._model, props);
        // Initialize promise
        this._initializePromise = undefined;
        // Binds
        this.onInitializeFulfilled = this.onInitializeFulfilled.bind(this);
        this.onInitializeRejected = this.onInitializeRejected.bind(this);
    }

    get model() {
        return this._model;
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

    dispose() {
        this._dispose();
        this._deleteReferences();
    }

    componentWillMount() {
        // Initialize
        if (!this.model.initialized && !this._initializePromise) {
            this._initializePromise = this.controller.initialize(this.props)
                                                     .then(this.onInitializeFulfilled,
                                                           this.onInitializeRejected);
        }
    }

    componentDidMount() {
        // Set view in controller
        this.controller.view = this.view;
        // Add view event listeners
        this.controller.addViewEventListeners(this.view.element);
        // Initialized, launch directly
        if (this.model.initialized) {
            this.controller.launch();
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
        this.controller.launch(this.props);
    }

    onInitializeRejected() {
        throw new Error(this.constructor.name + ' initialize was rejected.');
    }

    _newModelInstance(props) {
        // Abstract
    }

    _newControllerInstance(model, props) {
        // Abstract
    }

    _dispose() {
        // Dispose controller
        if (typeof this.controller.dispose === 'function') {
            this.controller.dispose();
        }
        // Dispose model
        if (typeof this.model.dispose === 'function') {
            this.model.dispose();
        }
    }

    _deleteReferences() {
        // delete refs
        delete this.cid;
        delete this._model;
        delete this._controller;
        delete this._initializePromise;
        // Binds
        delete this.onInitializeFulfilled;
        delete this.onInitializeRejected;
    }

}

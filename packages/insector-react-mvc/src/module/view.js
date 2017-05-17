import React from 'react';
import isFunction from 'lodash.isfunction';
import uniqueId from 'lodash.uniqueid';

/**
 * ModuleView
 */
export default class ModuleView extends React.Component {

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
        this.onInitializeDone = this.onInitializeDone.bind(this);
        this.onInitializeFail = this.onInitializeFail.bind(this);
    }

    get model() {
        return this._model;
    }

    get view() {
        if (!this.refs.hasOwnProperty('view')) {
            throw new Error('No ref attribute in ' + this.constructor.name + '.render: <Module ref="view" />.');
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
        if (!this.model.initialized) {
            if (!this._initializePromise) {
                let $promise = this.controller.initialize();

                if (!$promise || !isFunction($promise.done)) {
                    throw new Error('ModuleController.initialize() should always return a promise');
                }
                this._initializePromise = $promise;
                this._initializePromise.fail(this.onInitializeFail);
            }
        }
    }

    componentDidMount() {
        // Set view in controller
        this.controller.view = this.view;
        // Add view event listeners
        this.controller.addViewEventListeners(this.view.element);

        // initializing, launches when done
        if (this._initializePromise) {
            this._initializePromise.done(this.onInitializeDone);
        // Initialized, launch directly
        } else if (this.model.initialized) {
            this.controller.launch();
        // Error
        } else {
            throw new Error('ModuleView.componentDidMount() No this._initializePromise found and model not initialized, module will not launch.');
        }
    }

    componentWillUnmount() {
        // Dispose (Removes controller event listeners)
        this.dispose();
    }

    onInitializeDone(data, textStatus, jqXHR) {
        this._initializePromise = undefined;
        // Update model
        if (this.model) {
            this.model.initialized = true;
        }
        // Launch
        this.controller.launch();
    }

    onInitializeFail(promise, textStatus, statusTitle) {
        // ABSTRACT
    }

    _newModelInstance(props) {
        // Abstract
    }

    _newControllerInstance(model, props) {
        // Abstract
    }

    _dispose() {
        // Dispose controller
        if (this.controller.hasOwnProperty('dispose')) {
            this.controller.dispose();
        }
        // Dispose model
        if (this.model.hasOwnProperty('dispose')) {
            this.model.dispose();
        }
    }

    _deleteReferences() {
        super._deleteReferences();
        // delete refs
        delete this.cid;
        delete this._model;
        delete this._controller;
        delete this._initializePromise;
        // Binds
        delete this.onInitializeDone;
        delete this.onInitializeFail;
    }

}

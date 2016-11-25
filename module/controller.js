import $ from 'jquery';
import _ from 'lodash';
import ReactController from 'insectorjs/react/controller';

/**
 * ModuleController
 */
export default class ModuleController extends ReactController {

    constructor(model, component) {
        super(model, component);
        // Promise
        this._initializePromise = null;
        // Bind
        this.onInitializeDone = this.onInitializeDone.bind(this);
        this.onInitializeFail = this.onInitializeFail.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        // Initialize
        if (!this.model.initialized) {
            if (!this._initializePromise) {
                let $promise = this.initialize();

                if (!$promise || !_.isFunction($promise.done)) {
                    throw new Error('ModuleController.initialize() should always return a promise');
                }
                this._initializePromise = $promise;
            }
            this._initializePromise.fail(this.onInitializeFail);
            // this._initializePromise.done(this.onInitializeDone);
            // this._initializePromise = null;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this._initializePromise.done(this.onInitializeDone);

        // if (!this._initializePromise && this.model.initialized) {
        //     this.launch();
        // }
    }

    // Restructure? initialize() in componentWillMount & launch() in componentDidMount
    // initializeAndLaunch() {
    //     // Initialize
    //     if (!this.model.initialized) {
    //         if (!this._initializePromise) {
    //             let $promise = this.initialize();

    //             if (!$promise || !_.isFunction($promise.done)) {
    //                 throw new Error('ModuleController.initialize() should always return a promise');
    //             }
    //             this._initializePromise = $promise;
    //         }
    //         this._initializePromise.done(this.onInitializeDone);
    //         this._initializePromise.fail(this.onInitializeFail);
    //         this._initializePromise = null;
    //     } else {
    //         this.launch();
    //     }
    // }

    // Called when component will mount and ModuleModel is not initialized
    // intialize should always return a promise
    // Override and do stuff
    initialize() {
        return $.Deferred().resolve().promise();
    }

    // Called when component is mounted and initialized promise is resolved
    // Override and do stuff
    launch() {
    }

    onInitializeDone(data, textStatus, jqXHR) {
        this._initializePromise = null;
        // Update model
        if (this.model) {
            this.model.initialized = true;
        }
        // Launch
        this.launch();
    }

    onInitializeFail(promise, textStatus, statusTitle) {
        // ABSTRACT
    }

    _deleteReferences() {
        super._deleteReferences();
        // Binds
        delete this.onInitializeDone;
        delete this.onInitializeFail;
    }

}

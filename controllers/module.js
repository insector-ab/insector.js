import $ from 'jquery';
import _ from 'lodash';
import ReactController from 'insectorjs/react/controller';
import XHRController from 'insectorjs/controllers/xhr';
import ModalController from 'insectorjs/controllers/modal';

/**
 * ModuleController
 */
export default class ModuleController extends ReactController {

    constructor(model, component) {
        super(model, component);
        // Promise
        this._initializePromise = null;
        // XHR controller
        this._xhrController = new XHRController(model);
        // Modal controller
        this._modalController = new ModalController(model);
        // Bind
        this.onInitializeDone = this.onInitializeDone.bind(this);
        this.onInitializeFail = this.onInitializeFail.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.initializeAndLaunch();
    }

    get model() {
        return super.model;
    }
    set model(value) {
        super.model = value;
        // set model in sub controllers
        this._xhrController.model = value;
        this._modalController.model = value;
    }

    // Restructure? initialize() in componentWillMount & launch() in componentDidMount
    initializeAndLaunch() {
        // Initialize
        if (!this.model.initialized) {
            if (!this._initializePromise) {
                let $promise = this.initialize();

                if (!$promise || !_.isFunction($promise.done)) {
                    throw new Error('ModuleController.initialize() should always return a promise');
                }
                this._initializePromise = $promise;
            }
            this._initializePromise.done(this.onInitializeDone);
            this._initializePromise.fail(this.onInitializeFail);
            this._initializePromise = null;
        } else {
            this.launch();
        }
    }

    // Called when component is mounted and ModuleModel is not initialized
    // intialize should always return a promise
    // Override and do stuff
    initialize() {
        let promise = $.Deferred();
        promise.resolve();
        return promise;
    }

    // Called when component is mounted, after initialized promise is resolved
    // Override and do stuff
    launch() {
    }

    dispose() {
        super.dispose();
        this._xhrController.dispose();
        this._modalController.dispose();
    }

    onInitializeDone(data, textStatus, jqXHR) {
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
        // Sub controllers
        delete this._xhrController;
        delete this._modalController;
        // Binds
        delete this.onInitializeDone;
        delete this.onInitializeFail;
    }

}

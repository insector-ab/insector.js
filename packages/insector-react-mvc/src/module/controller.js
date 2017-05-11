import $ from 'jquery';
import isFunction from 'lodash.isfunction';
import ReactController from '../controller';

/**
 * ModuleController
 */
export default class ModuleController extends ReactController {

    constructor(model, targetComponent) {
        super(model, targetComponent);
        // Promise
        this._initializePromise = undefined;
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

                if (!$promise || !isFunction($promise.done)) {
                    throw new Error('ModuleController.initialize() should always return a promise');
                }
                this._initializePromise = $promise;
                this._initializePromise.fail(this.onInitializeFail);
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        // initializing, launches when done
        if (this._initializePromise) {
            this._initializePromise.done(this.onInitializeDone);
        } else if (this.model.initialized) {
            this.launch();
        } else {
            throw new Error('ModuleController.componentDidMount() No this._initializePromise found and model not initialized, module will not launch()');
        }
    }

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
        this._initializePromise = undefined;
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

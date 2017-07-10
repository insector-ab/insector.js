import $ from 'jquery';
import ReactController from '../controller';
import AppEvent from './event';

/**
 * AppController
 */
export default class AppController extends ReactController {

    constructor(model) {
        super(model);
        // Bind
        this.onWindowPopState = this.onWindowPopState.bind(this);
        this.onWindowError = this.onWindowError.bind(this);
    }

    events() {
        return {
            'routeto.insector.app': 'onRouteTo',
            'updatedocumenttitle.insector.app': 'onUpdateDocumentTitle'
        };
    }

    initialize() {
        let superPromise = super.initialize();
        let deferred = $.Deferred();
        // Load dependencies
        this._loadDependencies().done(() => {
            // Define routes
            this._defineRoutes();
            // resolve
            deferred.resolve();
        });
        // Return promise
        return $.when(superPromise, deferred.promise());
    }

    launch() {
        super.launch();
        // Show page
        this.dispatchDOMEvent(AppEvent.createRouteToEvent(window.location.pathname));
    }

    routeTo(path) {
        throw new Error('Abstract method AppController.routeTo not implemented.');
    }

    setDocumentTitle(title) {
        document.title = String(title);
    }

    onInitializeFail(promise, textStatus, statusTitle) {
        // FIX
        // Try launch anyway
        this.launch();
    }

    onRouteTo(event, appEvent) {
        // Open in new window?
        if (appEvent.inNewWindow) {
            window.open(appEvent.route);
        } else {
            // Route
            this.routeTo(appEvent.route);
        }
    }

    onUpdateDocumentTitle(event, appEvent) {
        setTimeout(() => {
            // console.log('onUpdateDocumentTitle (delayed 100 ms)', appEvent.title);
            this.setDocumentTitle(appEvent.title);
        }, 100);
    }

    onWindowPopState(event) {
        // Abstract
    }

    onWindowError(event) {
        // Abstract
    }

    // Always return promise
    _loadDependencies() {
        return $.Deferred().resolve().promise();
    }

    _defineRoutes() {
        throw new Error('Abstract method AppController._defineRoutes not implemented.');
    }

    addViewEventListeners(targetEl) {
        super.addViewEventListeners(targetEl);
        targetEl = targetEl || this.element;
        // Window events
        window.addEventListener('popstate', this.onWindowPopState);
        window.addEventListener('error', this.onWindowError);
    }

    removeViewEventListeners() {
        super.removeViewEventListeners();
        // Window events
        window.removeEventListener('popstate', this.onWindowPopState);
        window.removeEventListener('error', this.onWindowError);
    }

    _deleteReferences() {
        super._deleteReferences();
        delete this.onRouteTo;
        delete this.onUpdateDocumentTitle;
        delete this.onWindowPopState;
    }

}

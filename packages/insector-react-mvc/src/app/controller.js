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
        this.onClick = this.onClick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
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

    onClick(event) {
        return this._checkRouting('.page-route', event);
    }

    onDblClick(event) {
        return this._checkRouting('.dbl-page-route', event);
    }

    onKeyDown(event) {
        switch (event.which) {
            case 13: // enter-key
                this._checkRouting('.page-route', event);
                this._checkRouting('.dbl-page-route', event);
                break;
        }
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

    _checkRouting(classname, event) {
        const $targetEl = $(event.target);
        const $linkEl = $targetEl.closest('a');
        const $pageRouteEl = $targetEl.closest(classname);
        // Check .page-route click
        if ($pageRouteEl.length) {
            if ($pageRouteEl.attr('disabled') === 'disabled') {
                event.preventDefault();
            } else {
                return this._pageRouteHandler($pageRouteEl, event);
            }
        // If link with href="#" prevent default
        } else if ($linkEl.length && $linkEl.attr('href') === '#') {
            event.preventDefault();
        }
        return false;
    }

    _pageRouteHandler($el, event) {
        // href
        const href = $el.attr('href') || $el.attr('data-href');
        // open in new window?
        const isTargetBlankLink = $el.is('a') && $el.attr('target') === '_blank';
        if (isTargetBlankLink) {
            return false;
        }
        const metaKeyOnNonLink = (event.metaKey || $el.attr('data-target') === '_blank') && !$el.is('a');
        if (metaKeyOnNonLink) {
            window.open(href);
            return false;
        }
        if (event.metaKey) {
            return;
        }
        // Stop event
        event.preventDefault();
        // Route
        this.routeTo(href);
        return false;
    }

    _defineRoutes() {
        throw new Error('Abstract method AppController._defineRoutes not implemented.');
    }

    addViewEventListeners(targetEl) {
        super.addViewEventListeners(targetEl);
        targetEl = targetEl || this.element;
        // Add click handlers in capture phase
        targetEl.addEventListener('click', this.onClick, true);
        targetEl.addEventListener('dblclick', this.onDblClick, true);
        targetEl.addEventListener('keydown', this.onKeyDown, true);
        // Window events
        window.addEventListener('popstate', this.onWindowPopState);
        window.addEventListener('error', this.onWindowError);
    }

    removeViewEventListeners() {
        super.removeViewEventListeners();
        // Remove click handlers in capture phase
        this.element.removeEventListener('click', this.onClick, true);
        this.element.removeEventListener('dblclick', this.onDblClick, true);
        this.element.removeEventListener('keydown', this.onKeyDown, true);
        // Window events
        window.removeEventListener('popstate', this.onWindowPopState);
        window.removeEventListener('error', this.onWindowError);
    }

    _deleteReferences() {
        super._deleteReferences();
        delete this.onClick;
        delete this.onDblClick;
        delete this.onKeyDown;
        delete this.onRouteTo;
        delete this.onUpdateDocumentTitle;
        delete this.onWindowPopState;
    }

}

import $ from 'jquery';
import page from 'page';
import {EventPhase} from 'insectorjs/utils';
import ModuleController from 'insectorjs/module/controller';
import AppEvent from './event';

/**
 * AppController
 */
export default class AppController extends ModuleController {

    constructor(model) {
        super(model);
        // Bind
        this.onClick = this.onClick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onRouteTo = this.onRouteTo.bind(this);
        this.onUpdateDocumentTitle = this.onUpdateDocumentTitle.bind(this);
        this.onWindowPopState = this.onWindowPopState.bind(this);
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

    onClick(event) {
        return this.checkRouting('.page-route', event);
    }

    onDblClick(event) {
        return this.checkRouting('.dbl-page-route', event);
    }

    onKeyDown(event) {
        switch (event.which) {
            case 13: // enter-key
                this.checkRouting('.page-route', event);
                this.checkRouting('.dbl-page-route', event);
                break;
        }
    }

    checkRouting(classname, event) {
        // console.log('checkRouting', event);
        let $pageRouteEl = $(event.target).closest(classname);
        // Check .page-route click
        if ($pageRouteEl.length) {
            if ($pageRouteEl.attr('disabled') === 'disabled') {
                event.preventDefault();
            } else {
                return this.pageRouteHandler($pageRouteEl, event);
            }
        }
        return false;
    }

    pageRouteHandler($el, event) {
        // href
        let href = $el.attr('href') || $el.attr('data-href');
        // open in new window?
        let isTargetBlankLink = $el.is('a') && $el.attr('target') === '_blank';
        if (isTargetBlankLink) {
            return false;
        }
        let metaKeyOnNonLink = (event.metaKey || $el.attr('data-target') === '_blank') && !$el.is('a');
        if (metaKeyOnNonLink) {
            window.open(href);
            return false;
        }
        if (event.metaKey) {
            return;
        }
        // Stop event
        event.preventDefault();
        page.show(href);
        return false;
    }

    setDocumentTitle(title) {
        document.title = String(title);
    }

    // Trigger via $(document) instead?
    notifyAppEventReceivers(event) {
        // trigger event for each .app-event-receiver el found
        $('.app-event-receiver').each((i, el) => {
            $(el).triggerHandler(event.type, event);
        });
    }

    onInitializeFail(promise, textStatus, statusTitle) {
        // FIX
        // Try launch anyway
        this.launch();
    }

    onRouteTo(event, appEvent) {
        console.log('onRouteTo', appEvent.route);
        // Open in new window?
        if (appEvent.inNewWindow) {
            window.open(appEvent.route);
        } else {
            page.show(appEvent.route);
        }
    }

    onUpdateDocumentTitle(event, appEvent) {
        setTimeout(() => {
            console.log('onUpdateDocumentTitle (delayed 100 ms)', appEvent.title);
            this.setDocumentTitle(appEvent.title);
        }, 100);
    }

    onWindowPopState(event) {
        // Hide any open modals
        this.$('.modal').modal('hide');
    }

    // Always return promise
    _loadDependencies() {
        return $.Deferred().resolve().promise();
    }

    _defineRoutes() {
        throw Error('ABSTRACT method _defineRoutes called');
    }

    _addEventListeners() {
        super._addEventListeners();
        // Add click handlers in capture phase
        this.componentEl.addEventListener('click', this.onClick, EventPhase.CAPTURE);
        this.componentEl.addEventListener('dblclick', this.onDblClick, EventPhase.CAPTURE);
        this.componentEl.addEventListener('keydown', this.onKeyDown, EventPhase.CAPTURE);
        // App events
        $(this.componentEl).on(AppEvent.ROUTE_TO, this.onRouteTo);
        $(this.componentEl).on(AppEvent.UPDATE_DOCUMENT_TITLE, this.onUpdateDocumentTitle);
        // Window history back event
        $(window).on('popstate', this.onWindowPopState);
    }

    _removeEventListeners() {
        super._removeEventListeners();
        // Remove click handlers in capture phase
        this.componentEl.removeEventListener('click', this.onClick, EventPhase.CAPTURE);
        this.componentEl.removeEventListener('dblclick', this.onDblClick, EventPhase.CAPTURE);
        this.componentEl.removeEventListener('keydown', this.onKeyDown, EventPhase.CAPTURE);
        // App events
        $(this.componentEl).off(AppEvent.ROUTE_TO, this.onRouteTo);
        $(this.componentEl).off(AppEvent.UPDATE_DOCUMENT_TITLE, this.onUpdateDocumentTitle);
        // Window history back event
        $(window).off('popstate', this.onWindowPopState);
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

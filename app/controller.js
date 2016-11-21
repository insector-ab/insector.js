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
        // Ajax events
        this.onAjaxStart = this.onAjaxStart.bind(this);
        this.onAjaxError = this.onAjaxError.bind(this);
        this.onAjaxSuccess = this.onAjaxSuccess.bind(this);
        this.onAjaxStop = this.onAjaxStop.bind(this);
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

    onAjaxStart(event) {
        console.log('onAjaxStart', event);
        this.model.isFetching = true;
    }

    onAjaxError(... args) {
        console.log('onAjaxError', args);
        this.handleHTTPError(... args);
    }

    onAjaxSuccess(event, jqXHR, ajaxOptions, data) {
        console.log('onAjaxSuccess', data);
    }

    onAjaxStop(event) {
        console.log('onAjaxStop', event);
        this.model.isFetching = false;
    }

    // Always return promise
    _loadDependencies() {
        return $.Deferred().resolve().promise();
    }

    _checkRouting(classname, event) {
        // console.log('_checkRouting', event);
        let $pageRouteEl = $(event.target).closest(classname);
        // Check .page-route click
        if ($pageRouteEl.length) {
            if ($pageRouteEl.attr('disabled') === 'disabled') {
                event.preventDefault();
            } else {
                return this._pageRouteHandler($pageRouteEl, event);
            }
        }
        return false;
    }

    _pageRouteHandler($el, event) {
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
        // Global ajax events
        $(document).on('ajaxStart', this.onAjaxStart);
        $(document).on('ajaxError', this.onAjaxError);
        $(document).on('ajaxSuccess', this.onAjaxSuccess);
        $(document).on('ajaxStop', this.onAjaxStop);
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
        // Global ajax events
        $(document).off('ajaxStart', this.onAjaxStart);
        $(document).off('ajaxError', this.onAjaxError);
        $(document).off('ajaxSuccess', this.onAjaxSuccess);
        $(document).off('ajaxStop', this.onAjaxStop);
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

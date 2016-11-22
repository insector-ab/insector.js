import {Event} from 'guins/event';

/**
 * AppEvent
 */
export default class AppEvent extends Event {

    static createRouteToEvent(route, inNewWindow) {
        let e = new AppEvent(AppEvent.ROUTE_TO);
        e.route = route;
        e.inNewWindow = inNewWindow;
        return e;
    }

    static createUpdateDocumentTitleEvent(title) {
        let e = new AppEvent(AppEvent.UPDATE_DOCUMENT_TITLE);
        e.title = title;
        return e;
    }

}
AppEvent.ROUTE_TO = 'routeto.insector.app';
AppEvent.UPDATE_DOCUMENT_TITLE = 'updatedocumenttitle.insector.app';

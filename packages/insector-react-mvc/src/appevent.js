/**
 * AppEvent
 */
export default class AppEvent {

    static createRouteToEvent(route, inNewWindow) {
        return new window.CustomEvent(AppEvent.ROUTE_TO, {
            bubbles: true,
            cancelable: true,
            detail: {route, inNewWindow}
        });
    }

    static createUpdateDocumentTitleEvent(title) {
        return new window.CustomEvent(AppEvent.UPDATE_DOCUMENT_TITLE, {
            bubbles: true,
            cancelable: true,
            detail: {title}
        });
    }

}

AppEvent.ROUTE_TO = 'routeto.insector';
AppEvent.UPDATE_DOCUMENT_TITLE = 'updatedocumenttitle.insector';

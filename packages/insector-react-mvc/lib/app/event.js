'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Private attr
var ATTR_TYPE = Symbol('AppEvent.type');

/**
 * AppEvent
 */

var AppEvent = function () {
    function AppEvent(type) {
        _classCallCheck(this, AppEvent);

        this[ATTR_TYPE] = type;
    }

    _createClass(AppEvent, [{
        key: 'type',
        get: function get() {
            return this[ATTR_TYPE];
        }
    }], [{
        key: 'createRouteToEvent',
        value: function createRouteToEvent(route, inNewWindow) {
            var e = new AppEvent(AppEvent.ROUTE_TO);
            e.route = route;
            e.inNewWindow = inNewWindow;
            return e;
        }
    }, {
        key: 'createUpdateDocumentTitleEvent',
        value: function createUpdateDocumentTitleEvent(title) {
            var e = new AppEvent(AppEvent.UPDATE_DOCUMENT_TITLE);
            e.title = title;
            return e;
        }
    }]);

    return AppEvent;
}();

exports.default = AppEvent;


AppEvent.ROUTE_TO = 'routeto.insector.app';
AppEvent.UPDATE_DOCUMENT_TITLE = 'updatedocumenttitle.insector.app';
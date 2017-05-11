'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ActiveView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('mozy/model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ActiveView
 */
var ActiveView = exports.ActiveView = function () {
    function ActiveView() {
        _classCallCheck(this, ActiveView);
    }

    _createClass(ActiveView, [{
        key: 'activeView',
        get: function get() {
            return this.get('activeView');
        },
        set: function set(value) {
            this.set('activeView', value, _model.UNSET_IF_FALSE);
        }
    }, {
        key: 'activeViewProps',
        get: function get() {
            return this.get('activeViewProps');
        },
        set: function set(value) {
            this.set('activeViewProps', value, _model.UNSET_IF_FALSE);
        }
    }, {
        key: 'previousActiveView',
        get: function get() {
            return this._previousData['activeView'];
        }
    }]);

    return ActiveView;
}();
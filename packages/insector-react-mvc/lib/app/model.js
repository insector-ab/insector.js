'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _insectorUtils = require('insector-utils');

var _model = require('../module/model');

var _model2 = _interopRequireDefault(_model);

var _mixins = require('../mixins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AppModel
 */
var AppModel = function (_ModuleModel) {
    _inherits(AppModel, _ModuleModel);

    function AppModel(data, props) {
        _classCallCheck(this, AppModel);

        // Fetching flag
        var _this = _possibleConstructorReturn(this, (AppModel.__proto__ || Object.getPrototypeOf(AppModel)).call(this, data, props));

        _this._isFetching = false;
        return _this;
    }

    _createClass(AppModel, [{
        key: 'isFetching',
        get: function get() {
            return this._isFetching;
        },
        set: function set(value) {
            if (value !== this._isFetching) {
                this._isFetching = value;
                this.dispatchChange('isFetching');
            }
        }
    }]);

    return AppModel;
}(_model2.default);

// Adds 'activeView', 'activeViewProps', 'previousActiveView'


exports.default = AppModel;
(0, _insectorUtils.mixin)(AppModel, _mixins.ActiveView);
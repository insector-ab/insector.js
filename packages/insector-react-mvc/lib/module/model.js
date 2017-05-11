'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mozy = require('mozy');

var _model = require('mozy/model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ModuleModel, for use with
 * ReactModule (/react/module.js)
 */
var ModuleModel = function (_Model) {
    _inherits(ModuleModel, _Model);

    function ModuleModel() {
        _classCallCheck(this, ModuleModel);

        return _possibleConstructorReturn(this, (ModuleModel.__proto__ || Object.getPrototypeOf(ModuleModel)).apply(this, arguments));
    }

    _createClass(ModuleModel, [{
        key: 'getSubModuleModel',


        /**
         * getSubModuleModel
         * @param {mozy.Model} ModelCls Constructor to instantiate
         * @param {String} instanceKey Key to set on parent model
         * @param {Object} data Constructor param
         * @return {mozy.Model} Model instance
         */
        value: function getSubModuleModel(ModelCls, instanceKey) {
            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            // Get data
            var d = this.get(instanceKey, data);
            // Get model
            var m = _mozy.modelRegistry.getModel(d, ModelCls);
            // Set instance key
            m.instanceKey = instanceKey;
            // store module instance data on parent Model
            this.set(instanceKey, m.getModelData(), _model.SET_SILENT);
            // Return
            return m;
        }
    }, {
        key: 'instanceKey',
        get: function get() {
            return this.get('instanceKey');
        },
        set: function set(value) {
            this.set('instanceKey', value);
        }
    }, {
        key: 'initialized',
        get: function get() {
            return this.get('initialized', false);
        },
        set: function set(value) {
            this.set('initialized', value, _model.UNSET_IF_FALSE);
        }
    }]);

    return ModuleModel;
}(_model2.default);

exports.default = ModuleModel;
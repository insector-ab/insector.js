'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mixin = mixin;
exports.addConstantsToClass = addConstantsToClass;
exports.importConstantsToClass = importConstantsToClass;
exports.getAttrs = getAttrs;

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.filter');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * mixin
 * @param  {Class} TargetCls [description]
 * @param  {Class} MixinCls  [description]
 */
function mixin(TargetCls, MixinCls) {
    var target = TargetCls.prototype;
    var source = MixinCls.prototype;
    Object.getOwnPropertyNames(source).forEach(function (name) {
        if (name !== 'constructor') {
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        }
    });
}

/**
 * Define Constant Class methods
 */
function defineConstantsClassMethods(Cls) {
    // Check if Cls has constant
    Cls.has = function (constantName) {
        return typeof this.__lookupGetter__(constantName) !== 'undefined';
    };
    // Check if Cls has constant value
    Cls.hasValue = function (constantValue) {
        return this.allValues.indexOf(constantValue) > -1;
    };
    // 'allKeys' getter. List of defined constant keys on Cls.
    Object.defineProperty(Cls, 'allKeys', {
        get: function get() {
            if (!this.hasOwnProperty('_allKeys_')) {
                this['_allKeys_'] = (0, _lodash4.default)(Object.keys(Cls), function (k) {
                    return k.match(/^[A-Z0-9_]+$/);
                });
            }
            return this['_allKeys_'];
        }
    });
    // 'allValues' getter. List of defined constant values on Cls.
    Object.defineProperty(Cls, 'allValues', {
        get: function get() {
            var _this = this;

            if (!this.hasOwnProperty('_allValues_')) {
                this['_allValues_'] = this.allKeys.map(function (key) {
                    return _this[key];
                });
            }
            return this['_allValues_'];
        }
    });
}

/**
 * addConstantsToClass
 */
function addConstantsToClass(Cls, keyValues) {
    // Create constants
    for (var key in keyValues) {
        if (keyValues.hasOwnProperty(key)) {
            Object.defineProperty(Cls, key, {
                value: keyValues[key],
                writable: false,
                enumerable: true,
                configurable: false
            });
        }
    }
    // If no class methods defined
    if (!Cls.hasOwnProperty('has')) {
        defineConstantsClassMethods(Cls);
    }
}

/**
 * importConstantsToClass
 * @param {Class} Cls
 * @param {Class} FromCls
 * @param {Array} keys
 */
function importConstantsToClass(Cls, FromCls, keys) {
    for (var key, i = 0, il = keys.length; i < il; i++) {
        key = keys[i];
        Cls[key] = FromCls[key];
    }
    // If no class methods defined
    if (!Cls.hasOwnProperty('has')) {
        defineConstantsClassMethods(Cls);
    }
}

/**
 * Return attributes present in props but not in defined propTypes.
 */
function getAttrs(props, cls) {
    return _lodash2.default.apply(undefined, [props].concat(_toConsumableArray(Object.keys(cls.propTypes))));
}
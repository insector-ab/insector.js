import _ from 'lodash';
import {ArgumentError} from 'guins/error';
import classNames from 'classnames';

/**
 * Extend prototype
 * @param  {Object} obj      [Object/Class to extend]
 * @param  {Object args} ... [Objects to extend obj with]
 * @return {Object}
 */
export function extend(obj) {
    var source, prop, propDesc;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                propDesc = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, propDesc);
            }
        }
    }
    return obj;
};

/**
 * mixin
 * @param  {Class} TargetCls [description]
 * @param  {Class} MixinCls  [description]
 */
export function mixin(TargetCls, MixinCls) {
    let target = TargetCls.prototype;
    let source = MixinCls.prototype;
    Object.getOwnPropertyNames(source).forEach(function(name) {
        if (name !== 'constructor') {
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        }
    });
}

/**
 * EventPhase
 */
export class EventPhase {}
EventPhase.CAPTURE = true;
EventPhase.BUBBLE = false;

/**
 * addSymbolsToClass
 */
export function addSymbolsToClass(Cls, keyValues) {
    // existing maps?
    if (!Cls._symbolMap_) {
        Cls._symbolMap_ = {};
        Cls._valueMap_ = {};
    }
    // Create symbols and map
    for (var key in keyValues) {
        if (keyValues.hasOwnProperty(key)) {
            Cls[key] = Symbol(); // ConstantCls.CONSTANT = Symbol()
            Cls._symbolMap_[Cls[key]] = keyValues[key]; // symbolMap[ Symbol() ] = 'value'
            Cls._valueMap_[keyValues[key]] = Cls[key]; // valueMap[ 'value' ] = Symbol()
        }
    }
    // From value method
    Cls.fromValue = function(value, defaultValue) {
        if (Cls._valueMap_.hasOwnProperty(value)) {
            return Cls._valueMap_[value];
        }
        if (typeof defaultValue !== 'undefined') {
            return defaultValue;
        }
        throw new ArgumentError(Cls.name + ' symbol for value "' + value + '" not found.');
    };
    // To value
    Cls.toValue = function(sym) {
        if (Cls.has(sym)) {
            return Cls._symbolMap_[sym];
        }
        throw new ArgumentError('Symbol not found on "' + Cls.name + '".');
    };
    // Check if Cls has symbol
    Cls.has = function(sym) {
        return Cls._symbolMap_.hasOwnProperty(sym);
    };
    // 'allKeys' getter. List of defined symbol keys on Cls.
    Object.defineProperty(Cls, 'allKeys', {
        get: function() {
            return _.filter(_.keys(Cls), function(k) { return k.match(/^[A-Z0-9_]+$/); });
        }
    });
}

/**
 * importSymbolsToClass
 * @param  {Class} Cls              [description]
 * @param  {Class} FromCls          [description]
 * @param  {List of strings} keys   [description]
 */
export function importSymbolsToClass(Cls, FromCls, keys) {
    // existing maps?
    if (!Cls._symbolMap_) {
        Cls._symbolMap_ = {};
        Cls._valueMap_ = {};
    }
    for (let key, val, sym, i = 0, il = keys.length; i < il; i++) {
        key = keys[i];
        sym = FromCls[key];
        Cls[key] = sym; // Set ref to FromCls.CONSTANT (same Symbol)
        Cls._symbolMap_[sym] = FromCls._symbolMap_[sym]; // Copy value from FromCls
        val = Cls._symbolMap_[sym];
        Cls._valueMap_[val] = sym;
    }
}

/**
 * getHiddenClasses
 * @param  {String} size    ['xs','sm' or 'md']
 * @return {classNames}
 */
export function getHiddenClasses(size) {
    let classes = [];
    if (size === 'xs' || size === 'sm' || size === 'md') {
        classes.push('hidden-xs');
    }
    if (size === 'sm' || size === 'md') {
        classes.push('hidden-sm');
    }
    if (size === 'md') {
        classes.push('hidden-md');
    }
    return classNames(... classes);
}

/**
 * getVisibleClasses
 * @param  {String} size    ['sm','md' or 'lg']
 * @param  {String} display ['block','inline' or 'inline-block']
 * @return {classNames}
 */
export function getVisibleClasses(size, display) {
    let suffix = display ? ('-' + display) : '';
    let classes = [];
    if (size === 'lg' || size === 'md' || size === 'sm') {
        classes.push('visible-lg' + suffix);
    }
    if (size === 'md' || size === 'sm') {
        classes.push('visible-md' + suffix);
    }
    if (size === 'sm') {
        classes.push('visible-sm' + suffix);
    }
    return classNames(... classes);
}

/**
 * Check if value is Symbol
 * @param  {*} value
 * @return {Boolean}
 */
export function isSymbol(value) {
    try {
        return value.toString().substr(0, 7) === 'Symbol(';
    } catch (err) {}
    return false;
}

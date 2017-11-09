import omit from 'lodash.omit';
import UIController from './ui-controller';
import {
    getResolveFunction,
    resolveRoutes,
    resolveEventHandlers
} from './resolve-handlers';

/**
 * Exports
 */
export { UIController };
export {
    getResolveFunction,
    resolveRoutes,
    resolveEventHandlers
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
 * Define Constant Class methods
 */
function defineConstantsClassMethods(Cls) {
    // Check if Cls has constant
    Cls.has = function(constantName) {
        return typeof this.__lookupGetter__(constantName) !== 'undefined';
    };
    // Check if Cls has constant value
    Cls.hasValue = function(constantValue) {
        return this.allValues.indexOf(constantValue) > -1;
    };
    // 'allKeys' getter. List of defined constant keys on Cls.
    Object.defineProperty(Cls, 'allKeys', {
        get: function() {
            if (!this.hasOwnProperty('_allKeys_')) {
                this['_allKeys_'] = Object.keys(Cls).filter(k => k.match(/^[A-Z0-9_]+$/));
            }
            return this['_allKeys_'];
        }
    });
    // 'allValues' getter. List of defined constant values on Cls.
    Object.defineProperty(Cls, 'allValues', {
        get: function() {
            if (!this.hasOwnProperty('_allValues_')) {
                this['_allValues_'] = this.allKeys.map(key => {
                    return this[key];
                });
            }
            return this['_allValues_'];
        }
    });
}

/**
 * addConstantsToClass
 */
export function addConstantsToClass(Cls, keyValues) {
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
export function importConstantsToClass(Cls, FromCls, keys) {
    for (let key, i = 0, il = keys.length; i < il; i++) {
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
export function getAttrs(props, cls) {
    return omit(props, ...Object.keys(cls.propTypes));
}

/**
 * Remove origin from url string.
 */
export function trimOrigin(url) {
    // origin, e.g. "https://www.wingframe.com"
    const origin = window.location.origin;
    // If first part of string is origin, return next part
    if (url.substring(0, origin.length) === origin) {
        return url.substr(origin.length);
    }
    return url;
}

/**
 * Add callback for "document ready" state
 */
export function documentReady(callback) {
    // If not loading, callback()
    if (document.readyState !== 'loading') {
        callback();
    // else, add listener
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

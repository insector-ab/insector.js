import _ from 'lodash';
import accounting from 'accounting';
import {slugify} from 'underscore.string';

/**
 * Format money
 */
export function formatEuro(value, config = {}) {
    return accounting.formatMoney(value, _.assign({symbol: '€', format: '%s %v', thousand: '.', decimal: ','}, config));
}

export function formatDollar(value, config = {}) {
    return accounting.formatMoney(value, _.assign({symbol: '$', format: '%s %v', thousand: ',', decimal: '.'}, config));
}

export function formatPound(value, config = {}) {
    return accounting.formatMoney(value, _.assign({symbol: '£', format: '%s %v', thousand: ',', decimal: '.'}, config));
}

export function formatKronor(value, config = {}) {
    return accounting.formatMoney(value, _.assign({symbol: 'Kr', format: '%v %s', thousand: ' ', decimal: ','}, config));
}

export function formatMoney(value, currency, config = {}) {
    switch (currency) {
        case 'EUR': return formatEuro(value);
        case 'USD': return formatDollar(value);
        case 'GBP': return formatPound(value);
        case 'SEK': return formatKronor(value);
    }
    return accounting.formatMoney(value, _.assign({symbol: currency, format: '%s %v'}, config));
}

/**
 * Return attributes present in props but not in denifed propTypes.
 */
export function getAttrs(props, cls) {
    return _.omit(props, ...Object.keys(cls.propTypes));
}

/*
 * Takes string e.g. "In Progress" and returns "in-progress"
 * Transform text into an ascii slug which can be used in safely in URLs.
 * Replaces whitespaces, accentuated, and special characters with a dash.
 * Limited set of non-ascii characters are transformed to similar versions in the ascii character set such as ä to a.
 */
export function toCSS(value) {
    return slugify(value);
}

// DOMObserver example:
// DOMObserver( document.body ,function(mutations){
//     console.log('DOM updated:', mutations);
// });

// var DOMObserver = (function(){
//     return function(obj, callback){
//         // define a new observer
//         var obs = new window.MutationObserver(function(mutations, observer){
//             callback(mutations);
//         });
//         // have the observer observe foo for changes in children
//         obs.observe(obj, {
//             attributes: true,
//             childList: true,
//             characterData: true,
//             subtree:true
//         });
//     };
// })();

// export function recursiveSetData($el, obj, includeHidden = true) {
//     let $childEl;
//     // Iterate children
//     $el.children().each(function(index, childEl) {
//         $childEl = $(childEl);
//         // attributes to look for
//         let name = $childEl.attr('name');
//         let dataPropName = $childEl.attr('data-prop-name');
//         let dataDictName = $childEl.attr('data-dict-name');
//         let dataListName = $childEl.attr('data-list-name');
//         let dataListItem = $childEl.attr('data-list-item'); // this attribute is key-less
//         let inputType = $childEl.attr('type');
//         let key = name || dataPropName || dataDictName || dataListName;
//         let item, newObj;
//         // If element is an input (has attribute "name"),
//         if (typeof name !== 'undefined' && name !== false) {
//             let val = $childEl.val();
//             if ((inputType === 'hidden' && !includeHidden) || $childEl.hasClass('form-serialize-exclude')) {
//                 return;
//             }
//             if (inputType === 'checkbox' || inputType === 'radio') {
//                 if ($childEl.prop('checked')) {
//                     item = val;
//                 }
//             } else {
//                 try { // try if value in input is json string
//                     item = JSON.parse(val);
//                 } catch (err) {
//                     item = val;
//                 }
//             }
//         } else if (typeof dataPropName !== 'undefined' && dataPropName !== false) {
//             if ($childEl.children().length === 0) {
//                 item = $childEl.text();
//             } else {
//                 item = $childEl.html();
//             }
//         } else if (typeof dataDictName !== 'undefined' && dataDictName !== false) {
//             item = newObj = {};
//         } else if (typeof dataListName !== 'undefined' && dataListName !== false) {
//             item = newObj = [];
//         } else if (typeof dataListItem !== 'undefined' && dataListItem !== false) {
//             item = newObj = {};
//         }
//         // add or set
//         if (item) {
//             if (_.isArray(obj)) {
//                 obj.push(item);
//             } else {
//                 obj[key] = item;
//             }
//         }
//         // recursive call
//         recursiveSetData($childEl, newObj || obj);
//     });
// }

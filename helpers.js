import omit from 'lodash.omit';
import accounting from 'accounting';

/**
 * Format money
 */
export function formatEuro(value, config = {}) {
    return accounting.formatMoney(value, Object.assign({symbol: '€', format: '%s %v', thousand: '.', decimal: ','}, config));
}

export function formatDollar(value, config = {}) {
    return accounting.formatMoney(value, Object.assign({symbol: '$', format: '%s %v', thousand: ',', decimal: '.'}, config));
}

export function formatPound(value, config = {}) {
    return accounting.formatMoney(value, Object.assign({symbol: '£', format: '%s %v', thousand: ',', decimal: '.'}, config));
}

export function formatKronor(value, config = {}) {
    return accounting.formatMoney(value, Object.assign({symbol: 'Kr', format: '%v %s', thousand: ' ', decimal: ','}, config));
}

export function formatMoney(value, currency, config = {}) {
    switch (currency) {
        case 'EUR': return formatEuro(value);
        case 'USD': return formatDollar(value);
        case 'GBP': return formatPound(value);
        case 'SEK': return formatKronor(value);
    }
    return accounting.formatMoney(value, Object.assign({symbol: currency, format: '%s %v'}, config));
}

/**
 * Return attributes present in props but not in denifed propTypes.
 */
export function getAttrs(props, cls) {
    return omit(props, ...Object.keys(cls.propTypes));
}

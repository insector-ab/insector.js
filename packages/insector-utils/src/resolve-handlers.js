/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import closest from 'component-closest';

/**
 * Higher Order Function for getting resolvers
 */
export function getResolveFunction(getHandler, defaultParseString) {
  return function(strings, context, parseString) {
    return strings.map(str => {
      return getHandler.call(
        context,
        (parseString || defaultParseString)(str)
      );
    });
  };
}

/**
 * Convert route strings to RexExps and handlers.
 * Example strings:
 * "change .component > .selector: onComponentChange"
 * "click: onClick"
 */
export const resolveRoutes = getResolveFunction(getRouteHandler, defaultParseRouteString);

/**
 * getRouteHandler
 */
export function getRouteHandler({ pathnameRegExp, handlerName }) {
  // Handler method
  const handler = (pathname, ...args) => {
    const matches = pathname.match(pathnameRegExp);
    if (matches) {
      this[handlerName](...matches);
    }
  };
  // Return handler
  return handler;
}

/**
 * Parse route params from string.
 */
export function defaultParseRouteString(routeStr) {
  /* eslint-disable no-unused-vars */
  const [all, pathnameRegExp, handlerName] = routeStr.match(defaultRouteHandlerRegexp);
  /* eslint-enable no-unused-vars */
  return {pathnameRegExp, handlerName};
}

/**
 * Route handler string regexp.
 * Pattern:
 * "$pathnameRegExp: $handlerName"
 * Matches strings:
 * "^/project/new$: onNewProjectRoute"
 * "^/user/[\w\-]+$: onUserRoute"
 */
export const defaultRouteHandlerRegexp = /^(.+):\s(\S+)$/;

/**
 * Convert event handler strings to bound event handlers.
 * Example strings:
 * "change .component > .selector: onComponentChange"
 * "click: onClick"
 */
export const resolveEventHandlers = getResolveFunction(getEventHandler, defaultParseEventHandlerString);

/**
 * getEventHandler
 */
export function getEventHandler({ eventType, selector, handlerName, useCapture }) {
  // Handler method
  const handler = (event, ...args) => {
    if (!selector || !!closest(event.target, selector, event.currentTarget)) {
      this[handlerName](event, ...args);
    }
  };
  // Set attributes on handler for easy add/remove listeners
  handler.eventType = eventType;
  handler.useCapture = useCapture;
  // Return handler
  return handler;
}

/**
 * Parse event handler params from string.
 */
export function defaultParseEventHandlerString(eventHandlerStr) {
  /* eslint-disable no-unused-vars */
  const [all, eventType, selector, handlerName] = eventHandlerStr.match(defaultEventHandlerRegexp);
  /* eslint-enable no-unused-vars */
  return {eventType, selector, handlerName, useCapture: false};
}

/**
 * Event handler string regexp.
 * Pattern:
 * "$eventType $selector: $handlerName"
 * Matches strings:
 * "change .component > .selector: onComponentChange"
 * "click: onClick"
 */
export const defaultEventHandlerRegexp = /^(\S+)\s*(.*):\s(\S+)$/;


// export default class EventDelegator {

//     constructor(target, scope) {
//         this._target = target;
//         this._scope = scope;
//     }

//     delegate(eventType, eventHandler)

//     delegate(events) {
//         const events = this._getResolvedEvents();
//         // Events found, delegate
//         if (events) {
//             // Events, but no target found, throw error.
//             if (!target) {
//                 throw new Error('Could not delegate controller events. No target model.');
//             }
//             // Undelegate
//             this._undelegateEvents();
//             // Delegate
//             Object.keys(events).forEach(key => {
//                 target.addListener(key, events[key]);
//             });
//             // Save target
//             this._delegatedTarget = target;
//         }
//         // Return
//         return this;
//     }

//     _undelegateEvents(target) {
//         target = target || this._delegatedTarget || this.model;
//         // Undelegate
//         if (this._resolvedEvents) {
//             Object.keys(this._resolvedEvents).forEach(key => {
//                 target.removeListener(key, this._resolvedEvents[key]);
//             });
//         }
//         // Return
//         return this;
//     }

//     _getResolvedEvents() {
//         if (!this._resolvedEvents) {
//             const events = _.result(this, 'events');
//             if (!events) {
//                 return;
//             }
//             this._resolvedEvents = {};
//             Object.keys(events).forEach(key => {
//                 this._resolvedEvents[key] = this._getEventHandler(key, events);
//             });
//         }
//         return this._resolvedEvents;
//     }

//     _getEventHandler(key, events) {
//         events = events || _.result(this, 'events');
//         let handler = events[key];
//         if (!_.isFunction(handler)) {
//             handler = this[ events[key] ];
//         }
//         if (!handler) {
//             throw new Error('Could not find handler for event "' + key + '".');
//         }
//         return handler.bind(this);
//     }

// }


// Private attr
const ATTR_TYPE = Symbol('ControlEvent.type');
const ATTR_ORIGINAL_EVENT = Symbol('ControlEvent.originalEvent');

/**
 * ControlEvent
 */
export default class ControlEvent {

    constructor(type, originalEvent) {
        this[ATTR_TYPE] = type;
        this[ATTR_ORIGINAL_EVENT] = originalEvent;
    }

    get type() {
        return this[ATTR_TYPE];
    }

    get originalEvent() {
        return this[ATTR_ORIGINAL_EVENT];
    }

    get target() {
        return this.originalEvent.target;
    }

    static createChangeEvent(originalEvent) {
        return new ControlEvent(ControlEvent.CHANGE, originalEvent);
    }

    static createFocusEvent(originalEvent) {
        return new ControlEvent(ControlEvent.FOCUS, originalEvent);
    }

    static createBlurEvent(originalEvent) {
        return new ControlEvent(ControlEvent.BLUR, originalEvent);
    }

}

ControlEvent.CHANGE = 'ControlEvent_CHANGE';
ControlEvent.FOCUS = 'ControlEvent_FOCUS';
ControlEvent.BLUR = 'ControlEvent_BLUR';

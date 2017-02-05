// Private attr
const ATTR_TYPE = Symbol();

/**
 * Event
 */
export default class Event {

    constructor(type) {
        this[ATTR_TYPE] = type;
    }

    get type() {
        return this[ATTR_TYPE];
    }

}

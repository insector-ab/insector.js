import uniqueId from 'lodash.uniqueid';
import assert from 'assert';

import ReactView from './view';

/**
 * ReactModule
 */
export default class ReactModule extends ReactView {

    constructor(props) {
        super(props);
        // Model
        let model = this._newModelInstance(props);
        // Controller
        this._controller = this._newControllerInstance(model, props);
    }

    get model() {
        return this.controller && this.controller.model;
    }

    get controller() {
        return this._controller;
    }

    get targetComponent() {
        assert(this.refs.hasOwnProperty('view'), 'No ref attribute in ' + this.constructor.name + '.render: <Module ref="view" />.');
        return this.refs.view;
    }

    render() {
        return <div ref="view" />;
    }

    componentWillMount() {
        // controller event handler
        this.controller.componentWillMount();
    }

    componentDidMount() {
        // Set view in controller
        this.controller.component = this.targetComponent;
        // Super (calls _addEventListeners)
        super.componentDidMount();
        // controller event handler
        this.controller.componentDidMount();
    }

    componentWillUnmount() {
        // controller event handler
        this.controller.componentWillUnmount();
        // Unset view in controller
        this.controller.component = undefined;
        // Super (calls _removeEventListeners)
        super.componentWillUnmount();
    }

    componentWillReceiveProps(nextProps) {
        // controller handles new props
        this.controller.componentWillReceiveProps(nextProps);
        // setting new props on model
        this.model.props = nextProps;
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        this.controller.componentDidUpdate(prevProps, prevState);
    }

    _newModelInstance(props) {
        // Abstract
    }

    _newControllerInstance(model, props) {
        // Abstract
    }

    _getUniqueClientID() {
        return uniqueId('module');
    }

    _dispose() {
        // Dispose controller
        if (this.controller.hasOwnProperty('dispose')) {
            this.controller.dispose();
        }
        // Dispose model
        if (this.model.hasOwnProperty('dispose')) {
            this.model.dispose();
        }
        // Dispose super
        super._dispose();
    }

    _deleteReferences() {
        super._deleteReferences();
        // delete refs
        delete this._controller;
    }

    _addEventListeners(model) {
        super._addEventListeners(model);
        // Delegate events to Module DOM element
        this.controller.delegateEvents(this.el);
    }

    _removeEventListeners() {
        super._removeEventListeners();
        // Undelegate events from Module DOM element
        this.controller.undelegateEvents();
    }

}

import React from 'react';
import uniqueId from 'lodash.uniqueid';

// Privates
let _model,
    _controller;

/**
 * ModuleView
 */
export default class ModuleView extends React.Component {

    constructor(props) {
        super(props);
        // Model
        _model = this._newModelInstance(props);
        // Controller
        _controller = this._newControllerInstance(_model, props);
    }

    get model() {
        return _model;
    }

    get view() {
        if (!this.refs.hasOwnProperty('view')) {
            throw new Error('No ref attribute in ' + this.constructor.name + '.render: <Module ref="view" />.');
        }
        return this.refs.view;
    }

    get controller() {
        return _controller;
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
        this.controller.targetComponent = this.view;
        // controller event handler
        this.controller.componentDidMount();
    }

    componentWillUnmount() {
        // controller event handler
        this.controller.componentWillUnmount();
        // Unset view in controller
        this.controller.targetComponent = undefined;
    }

    componentWillReceiveProps(nextProps) {
        // controller handles new props
        this.controller.componentWillReceiveProps(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        // Abstract
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
        this.controller.delegateEvents(this.element);
    }

    _removeEventListeners() {
        super._removeEventListeners();
        // Undelegate events from Module DOM element
        this.controller.undelegateEvents();
    }

}

import _ from 'lodash';
import React from 'react';
import assert from 'assert';

import {SetterFlag, modelRegistry} from 'guins/model';

import ReactView from './view';

/**
 * ReactModule
 */
export default class ReactModule extends ReactView {

    constructor(props, modelListenerProps) {
        super(props, modelListenerProps);
        // Model
        let model = this._newModelInstance(props);
        // Controller
        this._controller = this._newControllerInstance(model, props);
    }

    get model() {
        return this.controller.model;
    }
    set model(value) {
        if (value !== this.controller.model) {
            // console.log('ReactModule.model setting', value);
            // Remove listeners from current model
            this._removeEventListeners();
            // Set new model
            this.controller.model = value;
            // Add listeners to new model
            this._addEventListeners();
            // notify
            this.model.dispatchChange('model');
        }
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
        super.componentWillMount();
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
        this.controller.component = null;
        // Super (calls _removeEventListeners)
        super.componentWillUnmount();
    }

    componentWillReceiveProps(nextProps) {
        // setting new props on model
        this.model.props = nextProps;
        // controller handles new props
        this.controller.componentWillReceiveProps(nextProps);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.controller.componentDidUpdate();
    }

    _newModelInstance(props) {
        // Abstract
    }

    _defaultNewModelInstance(props, ModelCls, instanceKey, data = {}) {
        // Standalone/debug
        if (!props.parentModel) {
            return new ModelCls(data, props);
        }
        // Restore or create instance
        // let m = modelRegistry.getModel( props.parentModel.get(instanceKey, data), ModelCls );
        // keep until registry supports more arguments than data
        let m;
        let d = props.parentModel.get(instanceKey, data);
        if (!modelRegistry.isRegistered(d.uuid)) {
            m = new ModelCls(d, props);
            m.instanceKey = instanceKey;
            modelRegistry.registerInstance(m);
        } else {
            m = modelRegistry.get(d.uuid);
            m.props = props;
        }
        // If not same data instance, update.
        if (m.data !== d) {
            m.data = d;
        }
        // store module instance data on parent Model
        props.parentModel.set(instanceKey, m.data, SetterFlag.SILENT);

        return m;
    }

    _newControllerInstance(model, props) {
        // Abstract
    }

    _getUniqueClientID() {
        return _.uniqueId('module');
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

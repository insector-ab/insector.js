import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {PropertyChangeEvent} from 'guins/event';
import {ExtendableError} from 'guins/error';

/**
 * ReactView
 */
export default class ReactView extends React.Component {

    constructor(props, modelListenerProps) {
        super(props);
        // Unique client id
        this.cid = this._getUniqueClientID();
        // Model event properties handler cares about
        this._modelListenerProps = this._getModelListenerProps(modelListenerProps);
        // Bind
        this.onModelChange = this.onModelChange.bind(this);
    }

    get model() {
        if (_.isObject(this.props) && this.props.hasOwnProperty('model')) {
            return this.props.model;
        }
        if (this.hasOwnProperty('_model')) {
            return this._model;
        }
        return null;
    }

    get componentEl() {
        return ReactDOM.findDOMNode(this);
    }

    $(selector) {
        return $(this.componentEl).find(selector);
    }

    render() {
        return (
            <div />
        );
    }

    dispose() {
        this._dispose();
        this._deleteReferences();
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', this.constructor.name, this.cid);
        // Remove listeners from current model
        this._removeEventListeners();
        // Add to new model
        this._addEventListeners(nextProps.model);
    }

    componentWillMount() {
        console.log(this.constructor.name, 'componentWillMount()');
    }

    componentDidMount() {
        console.log(this.constructor.name, 'componentDidMount()');
        this._addEventListeners();
    }

    componentWillUnmount() {
        this._removeEventListeners();
    }

    componentDidUpdate() {
        // console.log(this.constructor.name, 'componentDidUpdate()', this.model.cid);
    }

    onModelChange(event) {
        // console.log('onModelChange', event.property, this.constructor.name, this.cid);
        if (this._modelListenerProps) {
            // If boolean true, react to all events
            if (this._modelListenerProps === true) {
                this.setState({});
            } else if (this._modelListenerProps.indexOf(event.property) !== -1 || event.property === undefined) { // If list of properties, check list. If undefined prop, update.
                this.setState({});
            }
        }
    }

    _getUniqueClientID() {
        return _.uniqueId('view');
    }

    _getModelListenerProps(value) {
        if (value === true) {
            return true;
        }
        if (_.isEmpty(value)) {
            return false;
        }
        return value;
    }

    _dispose() {
        // Abstract
    }

    _deleteReferences() {
        delete this._model;
        delete this.onModelChange;
    }

    // FIX: split up _addEventListeners into addModelEventListeners & addViewEventListeners
    // run _addModelEventListeners in componentWillMount
    // run _addViewEventListeners in componentDidMount
    _addEventListeners(model) {
        model = model || this.model;
        if (this._modelListenerProps) {
            if (!model) {
                throw new ReactViewError('modelListenerProps was specified but model is missing.', {
                    view: this.constructor.name,
                    modelListenerProps: this._modelListenerProps,
                    model: model
                });
            }
            model.addListener(PropertyChangeEvent.PROPERTY_CHANGE, this.onModelChange);
        }
    }

    _removeEventListeners() {
        if (this._modelListenerProps) {
            this.model.removeListener(PropertyChangeEvent.PROPERTY_CHANGE, this.onModelChange);
        }
    }

}
ReactView.propTypes = {
    model: React.PropTypes.object
};

/**
 * ReactViewError
 */
class ReactViewError extends ExtendableError {

    constructor(message, data) {
        super([message, JSON.stringify(data)].join('\n'));
    }

}

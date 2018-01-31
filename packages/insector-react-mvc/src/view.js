/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import React from 'react';
import PropTypes from 'prop-types';
import {resolveModelEventHandlers} from 'resolve-handlers';

/**
 * ReactView
 */
export default class ReactView extends React.Component {

  constructor(...args) {
    super(...args);
    // Resolve model event handlers
    this._resolvedEventHandlers = resolveModelEventHandlers(this.getModelEventHandlerStrings(), this);
    // Bind
    this.onInvalidation = this.onInvalidation.bind(this);
  }

  get model() {
    return this.props.model;
  }

  getModelEventHandlerStrings() {
    return [];
  }

  componentWillReceiveProps(nextProps) {
    // If model change
    if (nextProps.model !== this.model) {
      // Remove listeners from current model
      this.removeModelListeners();
      // If new model
      if (nextProps.model) {
        // Add to new model
        this.addModelListeners(nextProps.model);
      }
    }
  }

  componentDidMount() {
    // Add listeners
    this.addModelListeners();
  }

  componentWillUnmount() {
    // Dispose
    this.dispose();
  }

  invalidate() {
    // Cancel animation frame
    window.cancelAnimationFrame(this._frame);
    // Request animation frame
    this._frame = window.requestAnimationFrame(this.onInvalidation);
  }

  onInvalidation() {
    this.setState({});
  }

  addModelListeners(model) {
    model = model || this.model;
    if (model) {
      this._resolvedEventHandlers.forEach(eventHandler => {
        model.addListener(eventHandler.eventType, eventHandler);
      });
    }
  }

  removeModelListeners() {
    if (this.model) {
      this._resolvedEventHandlers.forEach(eventHandler => {
        this.model.removeListener(eventHandler.eventType, eventHandler);
      });
    }
  }

  dispose() {
    window.cancelAnimationFrame(this._frame);
    this.removeModelListeners();
    this._dispose();
    this._deleteReferences();
  }

  _dispose() {
    // Abstract
  }

  _deleteReferences() {
    // Resolved event handlers
    Object.keys(this._resolvedEvents || {}).forEach(key => {
      delete this._resolvedEvents[key];
    });
    delete this._resolvedEvents;
  }

}
ReactView.propTypes = {
  model: PropTypes.shape({
    addListener: PropTypes.func,
    removeListener: PropTypes.func
  })
};

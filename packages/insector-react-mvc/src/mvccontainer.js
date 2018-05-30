/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import React from 'react';

/**
 * MVCContainer
 */
export default class MVCContainer extends React.Component {

  constructor(props) {
    super(props);
    // Model
    this.model = this._newModelInstance(props);
  }

  componentDidMount() {
    // Instantiate controller
    this.controller = this._newControllerInstance(this);
    // Notify of mount
    this.controller.componentDidMount();
  }

  componentWillUnmount() {
    // Remove controller
    if (this.controller) {
      if (typeof this.controller.dispose === 'function') {
        this.controller.dispose();
      }
      delete this.controller;
    }
    // Remove model
    delete this.model;
  }

  render() {
    return <div ref="view" />;
  }

  _newModelInstance(props) {
    // Abstract
  }

  _newControllerInstance(container) {
    // Abstract
  }

}

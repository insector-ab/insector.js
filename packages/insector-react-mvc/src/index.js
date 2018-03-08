/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import React from 'react';

import MVCContainer from './mvccontainer';
import ReactController from './controller';
import ReactView from './view';
import ViewModel from './viewmodel';

// Exports
export { MVCContainer };
export { ReactController };
export { ReactView };
export { ViewModel };

/**
 * wrapView
 */
export function wrapView(View, {modelFactory, controllerFactory} = {}) {
  // Container
  return class Container extends React.Component {

    constructor(props) {
      super(props);
      if (modelFactory) {
        this.model = modelFactory(this);
      }
    }

    render() {
      return (
        <View
          ref="view"
          model={this.model}
          {...this.props}
        />
      );
    }

    componentDidMount() {
      if (controllerFactory) {
        this.controller = controllerFactory(this);
      }
    }

    componentWillUnmount() {
      if (this.controller) {
        if (typeof this.controller.dispose === 'function') {
          this.controller.dispose();
        }
        delete this.controller;
      }
    }

  };
}

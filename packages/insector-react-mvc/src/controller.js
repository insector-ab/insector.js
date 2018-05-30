/* eslint indent: ["error", 2, {"SwitchCase": 1}] */
import ReactDOM from 'react-dom';
import ElementController from 'element-controller';

/**
 * ReactController
 */
export default class ReactController extends ElementController {

  constructor(mountedContainer) {
    // super takes DOM element
    super(ReactDOM.findDOMNode(mountedContainer));
    // Container ref
    this.container = mountedContainer;
    // Binds
    this.bindHandlers('onInitializeFulfilled', 'onInitializeRejected');
  }

  get model() {
    return this.container.model;
  }

  get view() {
    if (!this.container.refs.view) {
      throw new Error(
        `No ref attribute in ${this.container.constructor.name}.render:
        <div ref="view" />.`
      );
    }
    return this.container.refs.view;
  }

  componentDidMount() {
    // If initialized, launch directly
    if (this.model.initialized) {
      this.launch();
    // else, initialize
    } else {
      this.initialize()
        .then(
          this.onInitializeFulfilled,
          this.onInitializeRejected
        );
    }
  }

  // Called when container mounted if model not initialized.
  // Should always return a promise.
  initialize() {
    return Promise.resolve();
  }

  // Called when container mounted and initialize promise fulfilled.
  launch() {
    // ABSTRACT
  }

  // Bind helper
  bindHandlers(...handlers) {
    handlers.forEach(h => { this[h] = this[h].bind(this); });
  }

  onInitializeFulfilled() {
    // Set initialized on model
    this.model.initialized = true;
    // Launch
    this.launch();
  }

  onInitializeRejected(reason) {
    throw new Error(
      `${this.constructor.name} initialize was rejected.
      Reason: "${reason}"`
    );
  }

  _deleteReferences() {
    super._deleteReferences();
    delete this.container;
    delete this.onInitializeFulfilled;
    delete this.onInitializeRejected;
  }

}

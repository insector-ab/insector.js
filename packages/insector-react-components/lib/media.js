'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaBody = exports.MediaLeft = exports.Media = undefined;

var _createWrapperComponent = require('./create-wrapper-component');

var _createWrapperComponent2 = _interopRequireDefault(_createWrapperComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// --------- Media components (composition) --------- //

var Media = exports.Media = (0, _createWrapperComponent2.default)('media');
var MediaLeft = exports.MediaLeft = (0, _createWrapperComponent2.default)('media-left');
var MediaBody = exports.MediaBody = (0, _createWrapperComponent2.default)('media-body');
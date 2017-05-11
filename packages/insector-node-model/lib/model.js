'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nodeRegistry = exports.nodeFactory = exports.nodeIdentities = exports.nodeGraph = exports.NodeState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.getNodeRelationListHandler = getNodeRelationListHandler;

var _mozy = require('mozy');

var _insectorUtils = require('insector-utils');

var _graph = require('./graph');

var _graph2 = _interopRequireDefault(_graph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * NodeState
 */
var NodeState = exports.NodeState = function NodeState() {
    _classCallCheck(this, NodeState);
};

(0, _insectorUtils.addConstantsToClass)(NodeState, {
    TEMPORARY: 'temporary',
    NORMAL: 'normal',
    AUTOSAVE: 'autosave',
    DELETED: 'deleted'
});

/**
 * Class NodeModel
 */

var NodeModel = function (_Model) {
    _inherits(NodeModel, _Model);

    function NodeModel() {
        _classCallCheck(this, NodeModel);

        return _possibleConstructorReturn(this, (NodeModel.__proto__ || Object.getPrototypeOf(NodeModel)).apply(this, arguments));
    }

    _createClass(NodeModel, [{
        key: 'isModifiedBefore',
        value: function isModifiedBefore(datetime) {
            return this.modifiedAt && this.modifiedAt.isBefore(datetime);
        }
    }, {
        key: '_getDefaults',
        value: function _getDefaults() {
            var d = _get(NodeModel.prototype.__proto__ || Object.getPrototypeOf(NodeModel.prototype), '_getDefaults', this).call(this);
            d.identity = NodeModel.identity;
            d.discriminator = NodeModel.discriminator;
            return d;
        }
    }, {
        key: 'id',
        get: function get() {
            return this.get('id');
        }
    }, {
        key: 'identity',
        get: function get() {
            if (this.has('discriminator')) {
                return this.get('discriminator');
            }
            return _get(NodeModel.prototype.__proto__ || Object.getPrototypeOf(NodeModel.prototype), 'identity', this);
        }
    }, {
        key: 'nodeState',
        get: function get() {
            return this.get('node_state');
        },
        set: function set(value) {
            this.set('node_state', value);
        }
    }, {
        key: 'name',
        get: function get() {
            return this.get('name');
        },
        set: function set(value) {
            return this.set('name', value);
        }
    }, {
        key: 'description',
        get: function get() {
            return this.get('description');
        },
        set: function set(value) {
            return this.set('description', value);
        }
    }, {
        key: 'createdById',
        get: function get() {
            return this.get('created_by_id');
        }
    }, {
        key: 'createdAt',
        get: function get() {
            return this.get('created_at');
        }
    }, {
        key: 'modifiedById',
        get: function get() {
            return this.get('modified_by_id');
        }
    }, {
        key: 'modifiedAt',
        get: function get() {
            return this.get('modified_at');
        }
    }, {
        key: 'deletable',
        get: function get() {
            return true;
        }
    }, {
        key: 'isPersisted',
        get: function get() {
            return this.has('created_at');
        }
    }, {
        key: 'isModified',
        get: function get() {
            return this.modified && (this.modified.isAfter(this.modifiedAt) || !this.isPersisted);
        }
    }, {
        key: 'isNew',
        get: function get() {
            return !this.isPersisted && this._modified === undefined;
        }
    }]);

    return NodeModel;
}(_mozy.Model);

exports.default = NodeModel;


NodeModel.identity = 'node.NodeModel';
NodeModel.discriminator = 'node';

/**
 * nodeGraph
 * @type {Graph}
 */
var nodeGraph = exports.nodeGraph = new _graph2.default({ identityKey: 'discriminator' });
/**
 * nodeIdentities
 * @type {Registry}
 */
var nodeIdentities = exports.nodeIdentities = new Map();
// Register Classes/Constructors
nodeIdentities.set(NodeModel.discriminator, NodeModel);
/**
 * nodeFactory
 * @type {Factory}
 */
var nodeFactory = exports.nodeFactory = new _mozy.Factory(nodeIdentities, 'discriminator');
/**
 * nodeRegistry
 * @type {ModelRegistry}
 */
var nodeRegistry = exports.nodeRegistry = new _mozy.ModelRegistry('uuid', nodeFactory);
/**
 * getNodeRelationListHandler
 */
function getNodeRelationListHandler(nodeDataMap, nodeModelRegistry) {
    return {
        getModel: function getModel(key) {
            var data = nodeDataMap.get(key);
            if (!data) {
                throw new Error('Node data for key ' + key + 'not found.');
            }
            return nodeModelRegistry.getModel(data);
        },
        getItem: function getItem(model) {
            return model.uuid;
        }
    };
}
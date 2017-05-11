'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.defaultFilterBy = defaultFilterBy;

var _lodash = require('lodash.find');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.sortby');

var _lodash4 = _interopRequireDefault(_lodash3);

var _mozy = require('mozy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Re-write. Don't extend Model.
 */
var Graph = function (_Model) {
    _inherits(Graph, _Model);

    function Graph(data) {
        _classCallCheck(this, Graph);

        // init relation map
        var _this = _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, data));

        _this.generateRelationMap();
        return _this;
    }

    _createClass(Graph, [{
        key: 'getNodeItemByKey',
        value: function getNodeItemByKey(key) {
            return this.nodeMap[key];
        }
    }, {
        key: 'generateRelationMap',
        value: function generateRelationMap() {
            this.relationMap = {};
            for (var key in this.edgeMap) {
                if (this.edgeMap.hasOwnProperty(key)) {
                    this.registerEdge(this.edgeMap[key]);
                }
            }
        }
    }, {
        key: 'updateData',
        value: function updateData(data) {
            _get(Graph.prototype.__proto__ || Object.getPrototypeOf(Graph.prototype), 'update', this).call(this, data);
            this.generateRelationMap();
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.relationMap = {};
            this.updateData({ nodeMap: {}, edgeMap: {} });
        }
    }, {
        key: 'addNodes',
        value: function addNodes(nodes) {
            var il = nodes.length;
            for (var i = il - 1; i >= 0; i--) {
                this.addNodeItem(nodes[i]);
            }
        }
    }, {
        key: 'addEdges',
        value: function addEdges(edges) {
            var il = edges.length;
            for (var i = il - 1; i >= 0; i--) {
                this.addEdgeItem(edges[i]);
            }
        }
    }, {
        key: 'addEdgeItem',
        value: function addEdgeItem(edgeItem) {
            // check if nodeItems exist
            var parentKey = edgeItem['parent_' + this.nodeRegistryKey];
            if (!this.nodeMap.hasOwnProperty(parentKey)) {
                throw new Error('Node with key:' + parentKey + ' is missing from graph');
            }
            var childKey = edgeItem['child_' + this.nodeRegistryKey];
            if (!this.nodeMap.hasOwnProperty(childKey)) {
                throw new Error('Node with key:' + childKey + ' is missing from graph');
            }
            this.edgeMap[edgeItem[this.edgeRegistryKey]] = edgeItem;
            this.registerEdge(edgeItem);
        }
    }, {
        key: 'addNodeItem',
        value: function addNodeItem(nodeItem) {
            this.nodeMap[nodeItem[this.nodeRegistryKey]] = nodeItem;
        }
    }, {
        key: 'removeEdgeItem',
        value: function removeEdgeItem(edgeItem) {
            this.unregisterEdge(edgeItem);
            delete this.edgeMap[edgeItem[this.edgeRegistryKey]];
        }
    }, {
        key: 'removeNodeItem',
        value: function removeNodeItem(nodeItem) {
            var nodeKey = nodeItem[this.nodeRegistryKey];
            // remove all related edges
            var edge = void 0,
                parentKey = void 0,
                childKey = void 0;
            for (var key in this.edgeMap) {
                if (!this.edgeMap.hasOwnProperty(key)) {
                    continue;
                }
                edge = this.edgeMap[key];
                parentKey = edge['parent_' + this.nodeRegistryKey];
                childKey = edge['child_' + this.nodeRegistryKey];
                if (parentKey === nodeKey || childKey === nodeKey) {
                    this.removeEdgeItem(edge);
                }
            }
            delete this.relationMap[nodeKey];
            delete this.nodeMap[nodeKey];
        }
    }, {
        key: 'registerEdge',
        value: function registerEdge(edge) {
            var target = {};
            target[this.edgeRegistryKey] = edge[this.edgeRegistryKey];
            // store edge where node set as parent
            var parentKey = edge['parent_' + this.nodeRegistryKey];
            if (!this.relationMap.hasOwnProperty(parentKey)) {
                this.relationMap[parentKey] = { 'childEdges': [], 'parentEdges': [] };
            }
            // unique
            if (!(0, _lodash2.default)(this.relationMap[parentKey].childEdges, target)) {
                this.relationMap[parentKey].childEdges.push(edge);
            }

            // store edge where node set as child
            var childKey = edge['child_' + this.nodeRegistryKey];
            if (!this.relationMap.hasOwnProperty(childKey)) {
                this.relationMap[childKey] = { 'childEdges': [], 'parentEdges': [] };
            }
            // unique
            if (!(0, _lodash2.default)(this.relationMap[childKey].parentEdges, target)) {
                this.relationMap[childKey].parentEdges.push(edge);
            }
        }
    }, {
        key: 'unregisterEdge',
        value: function unregisterEdge(edge) {
            var childEdges = void 0,
                parentEdges = void 0,
                i = void 0;
            // remove from parents
            var parentKey = edge['parent_' + this.nodeRegistryKey];
            childEdges = this.relationMap[parentKey].childEdges;
            i = childEdges.indexOf(edge);
            if (i > -1) {
                childEdges.splice(i, 1);
            }
            // remove from children
            var childKey = edge['child_' + this.nodeRegistryKey];
            parentEdges = this.relationMap[childKey].parentEdges;
            i = parentEdges.indexOf(edge);
            if (i > -1) {
                parentEdges.splice(i, 1);
            }
        }
    }, {
        key: 'getRelations',
        value: function getRelations(key) {
            if (!this.relationMap.hasOwnProperty(key)) {
                return { 'childEdges': [], 'parentEdges': [] };
            }
            return this.relationMap[key];
        }
    }, {
        key: 'getChildren',
        value: function getChildren(node, filterBy, sortBy) {
            return this.getRelatedItems('node', 'child', node, filterBy, sortBy);
        }
    }, {
        key: 'getParents',
        value: function getParents(node, filterBy, sortBy) {
            return this.getRelatedItems('node', 'parent', node, filterBy, sortBy);
        }
    }, {
        key: 'getChildEdges',
        value: function getChildEdges(node, filterBy, sortBy) {
            return this.getRelatedItems('edge', 'child', node, filterBy, sortBy);
        }
    }, {
        key: 'getParentEdges',
        value: function getParentEdges(node, filterBy, sortBy) {
            return this.getRelatedItems('edge', 'parent', node, filterBy, sortBy);
        }
    }, {
        key: 'getRelatedItems',
        value: function getRelatedItems(itemType, direction, node, filterBy, sortBy) {
            var key = direction + 'Edges';
            // all edges in direction
            var edges = this.getRelations(node[this.nodeRegistryKey])[key];
            // filter edges, get nodes
            var edge = void 0,
                relatedNode = void 0,
                i = void 0;
            var result = [];
            var li = edges.length - 1;
            for (i = li; i >= 0; i--) {
                edge = edges[i];
                relatedNode = this.nodeMap[edge[direction + '_' + this.nodeRegistryKey]];
                // filter node / edges
                if (filterBy && !filterBy(relatedNode, edge)) {
                    continue;
                }
                // edges
                if (itemType === 'edge') {
                    result.push(edge);
                } else if (itemType === 'node') {
                    // nodes
                    result.push(relatedNode);
                } else {
                    throw new Error('Unknown itemType');
                }
            }
            // sort
            if (sortBy) {
                return (0, _lodash4.default)(result, sortBy);
            }
            return result;
        }
    }, {
        key: '_getDefaults',
        value: function _getDefaults() {
            var d = _get(Graph.prototype.__proto__ || Object.getPrototypeOf(Graph.prototype), '_getDefaults', this).call(this);
            d.identity = Graph.identity;
            d.nodeRegistryKey = 'uuid';
            d.edgeRegistryKey = 'uuid';
            d.nodeMap = {};
            d.edgeMap = {};
            return d;
        }
    }, {
        key: 'edgeMap',
        get: function get() {
            return this.get('edgeMap');
        }
    }, {
        key: 'nodeMap',
        get: function get() {
            return this.get('nodeMap');
        }

        // used to register/find unique node identifier

    }, {
        key: 'nodeRegistryKey',
        get: function get() {
            return this.get('nodeRegistryKey');
        }

        // used to register/find unique edge identifier

    }, {
        key: 'edgeRegistryKey',
        get: function get() {
            return this.get('edgeRegistryKey');
        }
    }]);

    return Graph;
}(_mozy.Model);

exports.default = Graph;

Graph.identity = 'graph.Graph';
_mozy.modelIdentities.set(Graph.identity, Graph);
/**
 * Graph multiton
 */
// Store multitons
Graph._instances = new Map();
// Multiton getter
Graph.get = function (name) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Instance exists?
    if (Graph._instances.has(name)) {
        return Graph._instances.get(name);
    }
    // Create new Graph
    var graph = new Graph(data);
    // Register
    Graph._instances.set(name, graph);
    // return
    return graph;
};

Graph.addNodes = function (graph, nodes) {
    graph.addNodes(nodes);
};

Graph.addEdges = function (graph, edges) {
    graph.addEdges(edges);
};

/**
 * Default filter methods
 */
function defaultFilterBy(item, key, value) {
    return value ? item[key] === value : true;
}
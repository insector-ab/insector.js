import _ from 'lodash';
import {Model, modelIdentities} from 'mozy';

/**
 * Re-write. Don't extend Model.
 */
export class Graph extends Model {

    constructor(data) {
        super(data);
        // init relation map
        this.generateRelationMap();
    }

    get edgeMap() {
        return this.get('edgeMap');
    }

    get nodeMap() {
        return this.get('nodeMap');
    }

    // used to register/find unique node identifier
    get nodeRegistryKey() {
        return this.get('nodeRegistryKey');
    }

    // used to register/find unique edge identifier
    get edgeRegistryKey() {
        return this.get('edgeRegistryKey');
    }

    getNodeItemByKey(key) {
        return this.nodeMap[key];
    }

    generateRelationMap() {
        this.relationMap = {};
        for (let key in this.edgeMap) {
            if (this.edgeMap.hasOwnProperty(key)) {
                this.registerEdge(this.edgeMap[key]);
            }
        }
    }

    updateData(data) {
        super.update(data);
        this.generateRelationMap();
    }

    clear() {
        this.relationMap = {};
        this.updateData({nodeMap: {}, edgeMap: {}});
    }

    addNodes(nodes) {
        let il = nodes.length;
        for (let i = il - 1; i >= 0; i--) {
            this.addNodeItem(nodes[i]);
        }
    }

    addEdges(edges) {
        let il = edges.length;
        for (let i = il - 1; i >= 0; i--) {
            this.addEdgeItem(edges[i]);
        }
    }

    addEdgeItem(edgeItem) {
        // check if nodeItems exist
        let parentKey = edgeItem['parent_' + this.nodeRegistryKey];
        if (!this.nodeMap.hasOwnProperty(parentKey)) {
            throw new Error('Node with key:' + parentKey + ' is missing from graph');
        }
        let childKey = edgeItem['child_' + this.nodeRegistryKey];
        if (!this.nodeMap.hasOwnProperty(childKey)) {
            throw new Error('Node with key:' + childKey + ' is missing from graph');
        }
        this.edgeMap[edgeItem[this.edgeRegistryKey]] = edgeItem;
        this.registerEdge(edgeItem);
    }

    addNodeItem(nodeItem) {
        this.nodeMap[nodeItem[this.nodeRegistryKey]] = nodeItem;
    }

    removeEdgeItem(edgeItem) {
        this.unregisterEdge(edgeItem);
        delete this.edgeMap[edgeItem[this.edgeRegistryKey]];
    }

    removeNodeItem(nodeItem) {
        let nodeKey = nodeItem[this.nodeRegistryKey];
        // remove all related edges
        let edge, parentKey, childKey;
        for (let key in this.edgeMap) {
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

    registerEdge(edge) {
        let target = {};
        target[this.edgeRegistryKey] = edge[this.edgeRegistryKey];
        // store edge where node set as parent
        let parentKey = edge['parent_' + this.nodeRegistryKey];
        if (!this.relationMap.hasOwnProperty(parentKey)) {
            this.relationMap[parentKey] = {'childEdges': [], 'parentEdges': []};
        }
        // unique
        if (!_.find(this.relationMap[parentKey].childEdges, target)) {
            this.relationMap[parentKey].childEdges.push(edge);
        }

        // store edge where node set as child
        let childKey = edge['child_' + this.nodeRegistryKey];
        if (!this.relationMap.hasOwnProperty(childKey)) {
            this.relationMap[childKey] = {'childEdges': [], 'parentEdges': []};
        }
        // unique
        if (!_.find(this.relationMap[childKey].parentEdges, target)) {
            this.relationMap[childKey].parentEdges.push(edge);
        }
    }

    unregisterEdge(edge) {
        let childEdges, parentEdges, i;
        // remove from parents
        let parentKey = edge['parent_' + this.nodeRegistryKey];
        childEdges = this.relationMap[parentKey].childEdges;
        i = childEdges.indexOf(edge);
        if (i > -1) {
            childEdges.splice(i, 1);
        }
        // remove from children
        let childKey = edge['child_' + this.nodeRegistryKey];
        parentEdges = this.relationMap[childKey].parentEdges;
        i = parentEdges.indexOf(edge);
        if (i > -1) {
            parentEdges.splice(i, 1);
        }
    }

    getRelations(key) {
        if (!this.relationMap.hasOwnProperty(key)) {
            return {'childEdges': [], 'parentEdges': []};
        }
        return this.relationMap[key];
    }

    getChildren(node, filterBy, sortBy) {
        return this.getRelatedItems('node', 'child', node, filterBy, sortBy);
    }

    getParents(node, filterBy, sortBy) {
        return this.getRelatedItems('node', 'parent', node, filterBy, sortBy);
    }

    getChildEdges(node, filterBy, sortBy) {
        return this.getRelatedItems('edge', 'child', node, filterBy, sortBy);
    }

    getParentEdges(node, filterBy, sortBy) {
        return this.getRelatedItems('edge', 'parent', node, filterBy, sortBy);
    }

    getRelatedItems(itemType, direction, node, filterBy, sortBy) {
        let key = direction + 'Edges';
        // all edges in direction
        let edges = this.getRelations(node[this.nodeRegistryKey])[key];
        // filter edges, get nodes
        let edge, relatedNode, i;
        let result = [];
        let li = edges.length - 1;
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
            } else if (itemType === 'node') { // nodes
                result.push(relatedNode);
            } else {
                throw new Error('Unknown itemType');
            }
        }
        // sort
        if (sortBy) {
            return _.sortBy(result, sortBy);
        }
        return result;
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = Graph.identity;
        d.nodeRegistryKey = 'uuid';
        d.edgeRegistryKey = 'uuid';
        d.nodeMap = {};
        d.edgeMap = {};
        return d;
    }

}
Graph.identity = 'graph.Graph';
modelIdentities.set(Graph.identity, Graph);

/**
 * Default filter methods
 */
export function filterBy(item, key, value) {
    return value ? item[key] === value : true;
}

/**
 * Graph multiton
 */
// Store multitons
Graph._instances = new Map();
// Multiton getter
Graph.get = function(name, data = {}) {
    // Instance exists?
    if (Graph._instances.has(name)) {
        return Graph._instances.get(name);
    }
    // Create new Graph
    let graph = new Graph(data);
    // Register
    Graph._instances.set(name, graph);
    // return
    return graph;
};

Graph.addNodes = function(graph, nodes) {
    graph.addNodes(nodes);
};

Graph.addEdges = function(graph, edges) {
    graph.addEdges(edges);
};


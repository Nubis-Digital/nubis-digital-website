/**
 * Node Portal Management Module for 3D Scroll Parallax System
 * Manages portal nodes, clustering, and node visual effects
 */

import { ParallaxConfig, VisualConstants } from './config.js';
import { Spatial } from './utils.js';

/**
 * Node Portal Manager
 */
export class NodePortalManager {
    constructor() {
        this.portalNodes = new Map();
        this.nodeMapping = new Map();
        this.initialized = false;
    }

    /**
     * Initialize node attributes for portal effects
     * @param {Object} neuralNetwork - Neural network THREE.js object
     * @param {Array} nodes - All nodes
     */
    initializeNodeAttributes(neuralNetwork, nodes) {
        if (this.initialized || !neuralNetwork || !neuralNetwork.geometry) return;

        // Check for THREE.js availability
        if (typeof THREE === 'undefined') {
            console.error('THREE.js not available for node portal initialization');
            return;
        }

        // Add size attribute if it doesn't exist
        if (!neuralNetwork.geometry.attributes.size) {
            const sizes = new Float32Array(nodes.length);
            for (let i = 0; i < nodes.length; i++) {
                sizes[i] = 1.0; // Default size
            }
            neuralNetwork.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            // Enable per-vertex sizing
            if (neuralNetwork.material) {
                neuralNetwork.material.size = 0.12;
                neuralNetwork.material.needsUpdate = true;
            }
        }

        this.initialized = true;
        console.log('Node portal attributes initialized');
    }

    /**
     * Find nodes that are well-positioned for portal effects
     * @param {Array} nodes - All neural network nodes
     * @returns {Array} Filtered visible nodes
     */
    findVisibleNodes(nodes) {
        if (!nodes) return [];

        return nodes.filter((node, index) => {
            // Select nodes in the front half of the network
            // and every 3rd node for better distribution
            return node.z > -5 && index % 3 === 0;
        });
    }

    /**
     * Find nearby nodes for clustering effect
     * @param {Object} sourceNode - Source node
     * @param {Array} allNodes - All nodes in the network
     * @param {number} maxCount - Maximum nearby nodes to find
     * @param {number} maxDistance - Maximum distance for clustering
     * @returns {Array} Array of nearby nodes with distance info
     */
    findNearbyNodes(sourceNode, allNodes, maxCount = ParallaxConfig.clusterMaxNodes, maxDistance = ParallaxConfig.clusterMaxDistance) {
        if (!allNodes) return [];

        // Calculate distances from source node
        const nodesWithDistance = allNodes
            .map((node, index) => {
                if (node === sourceNode) return null;

                const distance = Spatial.distance3D(sourceNode, node);

                return {
                    node,
                    index,
                    distance
                };
            })
            .filter(item => item !== null && item.distance <= maxDistance);

        // Sort by distance and take the closest nodes
        return nodesWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxCount);
    }

    /**
     * Map a block to a specific node
     * @param {Object} block - Content block
     * @param {Array} visibleNodes - Array of visible nodes
     * @param {Array} allNodes - All network nodes
     * @param {THREE.Camera} camera - Camera instance
     */
    mapBlockToNode(block, visibleNodes, allNodes, camera) {
        if (!visibleNodes.length) return;

        // Distribute nodes evenly across visible nodes
        const nodeIndex = Math.floor((block.index / Math.max(1, block.index + 2)) * visibleNodes.length);
        const clampedIndex = Math.min(nodeIndex, visibleNodes.length - 1);

        const node = visibleNodes[clampedIndex];
        if (!node) return;

        // Get actual index in full nodes array
        const actualNodeIndex = allNodes.indexOf(node);
        block.nodeIndex = actualNodeIndex;

        // Calculate screen position
        block.nodePosition = Spatial.getNodeScreenPosition(node, camera);

        // Mark node as a portal
        node.isPortal = true;
        node.connectedBlockId = block.id;
        node.portalStrength = 0;
        node.originalSize = 1.0;

        // Find nearby nodes for clustering
        const nearbyNodes = this.findNearbyNodes(node, allNodes);

        // Store mapping
        this.nodeMapping.set(block.id, {
            nodeIndex: actualNodeIndex,
            node,
            position: block.nodePosition,
            nearbyNodes
        });

        this.portalNodes.set(block.id, node);

        return actualNodeIndex;
    }

    /**
     * Update node portal effects
     * @param {Object} block - Content block
     * @param {Object} neuralNetwork - Neural network THREE.js object
     * @param {Array} nodes - All nodes
     */
    updatePortalEffects(block, neuralNetwork, nodes) {
        const mapping = this.nodeMapping.get(block.id);
        if (!mapping) return;

        const node = mapping.node;
        const nodeIndex = mapping.nodeIndex;

        // Calculate portal strength based on emergence progress
        let portalStrength = 0;
        if (block.emergenceProgress > 0 && block.emergenceProgress < 0.5) {
            portalStrength = 1 - (Math.abs(block.emergenceProgress - 0.25) * 4);
        }

        node.portalStrength = portalStrength;

        // Update node size and cluster effects
        this._updateNodeSize(neuralNetwork, nodeIndex, portalStrength, mapping.nearbyNodes);

        // Apply portal vortex motion
        if (portalStrength > 0.05) {
            this._applyPortalMotion(node, mapping.nearbyNodes, portalStrength);
        }

        // Update node colors
        this._updateNodeColors(neuralNetwork, nodeIndex, portalStrength, mapping.nearbyNodes);

        return portalStrength;
    }

    /**
     * Update dynamic node size with pulsation
     * @private
     */
    _updateNodeSize(neuralNetwork, nodeIndex, portalStrength, nearbyNodes) {
        if (!neuralNetwork.geometry || !neuralNetwork.geometry.attributes.size) return;

        const sizes = neuralNetwork.geometry.attributes.size.array;

        // Pulse the size of the portal node
        if (portalStrength > 0.1) {
            const pulseSize = 1 + portalStrength * 3 * (0.8 + Math.sin(Date.now() * 0.005) * 0.2);
            sizes[nodeIndex] = pulseSize;

            // Also pulse nearby nodes in the cluster
            nearbyNodes.forEach(nearbyNode => {
                const distanceFactor = 1 - (nearbyNode.distance / ParallaxConfig.clusterMaxDistance);
                const clusterPulse = 1 + (portalStrength * distanceFactor * 0.5 * (0.8 + Math.sin(Date.now() * 0.006 + nearbyNode.index) * 0.2));

                sizes[nearbyNode.index] = clusterPulse;
            });

            neuralNetwork.geometry.attributes.size.needsUpdate = true;
        }
    }

    /**
     * Apply portal vortex motion effects
     * @private
     */
    _applyPortalMotion(node, nearbyNodes, portalStrength) {
        // Gentle pulsing motion on main portal node
        const pulseForce = Math.sin(Date.now() * 0.002) * portalStrength * 0.015;
        node.vx += pulseForce * (Math.random() - 0.5) * 0.8;
        node.vy += pulseForce * (Math.random() - 0.5) * 0.8;
        node.vz += pulseForce * (Math.random() - 0.5) * 0.4;

        // Subtle swirling motion
        const angle = Date.now() * 0.001;
        const swirl = portalStrength * 0.008;
        node.vx += Math.cos(angle) * swirl;
        node.vy += Math.sin(angle) * swirl;

        // Affect nearby nodes in the cluster
        nearbyNodes.forEach(nearbyNode => {
            const nearNode = nearbyNode.node;
            const distance = nearbyNode.distance;
            const distanceFactor = 1 - (distance / ParallaxConfig.clusterMaxDistance);

            // Attraction toward portal node
            const dx = node.x - nearNode.x;
            const dy = node.y - nearNode.y;
            const dz = node.z - nearNode.z;

            nearNode.vx += dx * 0.0005 * portalStrength * distanceFactor;
            nearNode.vy += dy * 0.0005 * portalStrength * distanceFactor;
            nearNode.vz += dz * 0.0005 * portalStrength * distanceFactor;

            // Swirl around portal
            const nearAngle = Math.atan2(nearNode.y - node.y, nearNode.x - node.x);
            const tangentX = Math.cos(nearAngle + Math.PI / 2);
            const tangentY = Math.sin(nearAngle + Math.PI / 2);

            nearNode.vx += tangentX * 0.005 * portalStrength * distanceFactor;
            nearNode.vy += tangentY * 0.005 * portalStrength * distanceFactor;
        });
    }

    /**
     * Update node colors with glow effect
     * @private
     */
    _updateNodeColors(neuralNetwork, nodeIndex, portalStrength, nearbyNodes) {
        if (!neuralNetwork.geometry || !neuralNetwork.geometry.attributes.color) return;

        const colors = neuralNetwork.geometry.attributes.color.array;
        const { r: baseR, g: baseG, b: baseB } = VisualConstants.NODE_BASE_COLOR;

        // Make portal node glow brightly when active
        const glowIntensity = 1 + (portalStrength * 4);

        // Add slight color variation with time
        const timeOffset = Date.now() * 0.001 + nodeIndex * 0.5;
        const colorPulse = 0.15 * Math.sin(timeOffset);

        colors[nodeIndex * 3] = Math.min(1.0, baseR * glowIntensity + colorPulse);
        colors[nodeIndex * 3 + 1] = Math.min(1.0, baseG * glowIntensity);
        colors[nodeIndex * 3 + 2] = Math.min(1.0, baseB * glowIntensity - colorPulse);

        // Also affect nearby nodes in cluster
        nearbyNodes.forEach(nearbyNode => {
            const ni = nearbyNode.index;
            const distanceFactor = 1 - (nearbyNode.distance / ParallaxConfig.clusterMaxDistance);

            // Propagate glow to nearby nodes
            const nearbyGlow = 1 + (portalStrength * distanceFactor * 2);
            const nearbyOffset = Date.now() * 0.001 + ni * 0.2;
            const nearbyPulse = 0.1 * Math.sin(nearbyOffset);

            colors[ni * 3] = Math.min(1.0, baseR * nearbyGlow + nearbyPulse);
            colors[ni * 3 + 1] = Math.min(1.0, baseG * nearbyGlow);
            colors[ni * 3 + 2] = Math.min(1.0, baseB * nearbyGlow - nearbyPulse);
        });

        neuralNetwork.geometry.attributes.color.needsUpdate = true;
    }

    /**
     * Create depth-of-field effect on background nodes
     * @param {Object} neuralNetwork - Neural network THREE.js object
     * @param {Array} nodes - All nodes
     */
    updateDepthOfField(neuralNetwork, nodes) {
        if (!neuralNetwork.geometry || !neuralNetwork.geometry.attributes.size) return;

        const sizes = neuralNetwork.geometry.attributes.size.array;

        nodes.forEach((node, i) => {
            // Skip portal nodes (they have their own size management)
            if (node.isPortal) return;

            // Calculate depth factor (closer to camera = larger)
            const depthFactor = (node.z + 15) / 30; // Normalize z to 0-1 range
            const size = Math.max(1, 2 * depthFactor);

            sizes[i] = size;
        });

        neuralNetwork.geometry.attributes.size.needsUpdate = true;
    }

    /**
     * Get mapping for a block
     * @param {string} blockId - Block ID
     * @returns {Object} Node mapping data
     */
    getMapping(blockId) {
        return this.nodeMapping.get(blockId);
    }

    /**
     * Check if a node is a portal
     * @param {number} nodeIndex - Node index
     * @returns {boolean} True if portal
     */
    isPortalNode(nodeIndex) {
        for (const [, mapping] of this.nodeMapping) {
            if (mapping.nodeIndex === nodeIndex) {
                return true;
            }
        }
        return false;
    }

    /**
     * Clear all portal data
     */
    clear() {
        // Reset portal properties on nodes
        for (const [, node] of this.portalNodes) {
            node.isPortal = false;
            node.connectedBlockId = null;
            node.portalStrength = 0;
        }

        this.portalNodes.clear();
        this.nodeMapping.clear();
    }
}

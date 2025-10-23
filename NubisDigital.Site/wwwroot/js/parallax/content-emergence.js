/**
 * Content Emergence Module for 3D Scroll Parallax System
 * Manages content block emergence animations and states
 */

import { ParallaxConfig, VisualConstants } from './config.js';
import { Easing, Spatial, Viewport } from './utils.js';

/**
 * Content Block Manager
 */
export class ContentBlockManager {
    constructor() {
        this.blocks = [];
        this.blockMap = new Map();
    }

    /**
     * Identify and initialize all content blocks
     * @returns {Array} Array of content blocks
     */
    identifyBlocks() {
        const sections = document.querySelectorAll('section[id]');
        this.blocks = [];

        sections.forEach((section, index) => {
            // Skip the first section (hero/slider)
            if (index === 0) {
                console.log(`Skipping first section (${section.id}) from parallax`);
                section.style.position = 'relative';
                section.style.zIndex = '10';
                return;
            }

            const id = section.id;
            if (id) {
                const rect = section.getBoundingClientRect();
                const block = {
                    element: section,
                    id,
                    index: index - 1,
                    originalTop: rect.top + window.scrollY,
                    height: rect.height,
                    nodeIndex: null,
                    nodePosition: null,
                    emergenceProgress: 0,
                    lastEmergenceProgress: 0,
                    isEmerged: false,
                    connectionLine: null,
                    particles: [],
                    energyWaves: []
                };

                this.blocks.push(block);
                this.blockMap.set(id, block);

                // Wrap section content for animation
                this._wrapSectionContent(section);

                // Set section attributes
                this._initializeSectionStyles(section, block);
            }
        });

        console.log(`Found ${this.blocks.length} content blocks for parallax`);
        return this.blocks;
    }

    /**
     * Wrap section content in animation wrapper
     * @private
     */
    _wrapSectionContent(section) {
        const wrapper = document.createElement('div');
        wrapper.className = 'parallax-content-wrapper';
        wrapper.style.transformStyle = 'preserve-3d';
        wrapper.style.willChange = 'transform, opacity, filter';
        wrapper.style.transition = 'none';

        // Move all children to wrapper
        while (section.firstChild) {
            wrapper.appendChild(section.firstChild);
        }
        section.appendChild(wrapper);
    }

    /**
     * Initialize section styles
     * @private
     */
    _initializeSectionStyles(section, block) {
        section.style.position = 'relative';
        section.style.overflow = 'visible';
        section.style.transformStyle = 'preserve-3d';
        section.style.perspective = `${ParallaxConfig.perspectiveBase}px`;
        section.setAttribute('data-parallax-block', 'true');
        section.setAttribute('data-block-index', block.index);
        section.setAttribute('data-emergence-state', VisualConstants.EMERGENCE_STATES.HIDDEN);
    }

    /**
     * Initialize block states (hidden at node positions)
     */
    initializeStates() {
        this.blocks.forEach(block => {
            const wrapper = block.element.querySelector('.parallax-content-wrapper');
            if (wrapper && block.nodePosition) {
                wrapper.style.opacity = '0';
                wrapper.style.transform = `scale(0.1)`;
                block.element.style.minHeight = '0';
                block.element.style.opacity = '1';
            }
        });
    }

    /**
     * Update emergence for all blocks
     * @param {number} deltaTime - Time since last frame
     * @param {THREE.Camera} camera - Camera instance
     * @param {Array} nodes - All nodes
     * @param {Function} onEmergenceStart - Callback when emergence starts
     * @param {Function} onEmergenceProgress - Callback during emergence
     */
    updateEmergence(deltaTime, camera, nodes, onEmergenceStart, onEmergenceProgress) {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        this.blocks.forEach(block => {
            const wrapper = block.element.querySelector('.parallax-content-wrapper');
            if (!wrapper || !block.nodePosition) return;

            // Store previous progress
            block.lastEmergenceProgress = block.emergenceProgress;

            // Calculate emergence progress
            const progress = this._calculateEmergenceProgress(block, scrollY, viewportHeight);

            // Detect significant progress change
            const progressChange = progress - block.emergenceProgress;
            const significantChange = Math.abs(progressChange) > 0.05;

            block.emergenceProgress = progress;

            // Update node screen position
            if (nodes && nodes[block.nodeIndex]) {
                block.nodePosition = Spatial.getNodeScreenPosition(nodes[block.nodeIndex], camera);
            }

            // Update emergence state
            this._updateEmergenceState(block, progress);

            // Trigger callbacks
            if (progress > 0 && block.lastEmergenceProgress === 0 && onEmergenceStart) {
                onEmergenceStart(block);
            }

            if (significantChange && progress > 0.05 && progress < 0.95 && onEmergenceProgress) {
                onEmergenceProgress(block, progress);
            }

            // Apply visual transformations
            this._applyEmergenceTransform(block, wrapper, progress);
        });
    }

    /**
     * Calculate emergence progress for a block
     * @private
     */
    _calculateEmergenceProgress(block, scrollY, viewportHeight) {
        const triggerPoint = block.originalTop - viewportHeight * ParallaxConfig.triggerOffset;
        const endPoint = block.originalTop - viewportHeight * ParallaxConfig.endOffset;

        let progress = 0;
        if (scrollY >= triggerPoint && scrollY <= endPoint) {
            progress = (scrollY - triggerPoint) / (endPoint - triggerPoint);
        } else if (scrollY > endPoint) {
            progress = 1;
        }

        return progress;
    }

    /**
     * Update emergence state attribute
     * @private
     */
    _updateEmergenceState(block, progress) {
        let state = VisualConstants.EMERGENCE_STATES.HIDDEN;

        if (progress === 0) {
            state = VisualConstants.EMERGENCE_STATES.HIDDEN;
        } else if (progress < 0.3) {
            state = VisualConstants.EMERGENCE_STATES.EMERGING;
        } else if (progress < 0.7) {
            state = VisualConstants.EMERGENCE_STATES.EXPANDING;
        } else {
            state = VisualConstants.EMERGENCE_STATES.VISIBLE;
        }

        block.element.setAttribute('data-emergence-state', state);
    }

    /**
     * Apply emergence transformation to content
     * @private
     */
    _applyEmergenceTransform(block, wrapper, progress) {
        if (progress === 0) {
            this._applyHiddenState(wrapper, block.element);
            block.isEmerged = false;
        } else if (progress < 1) {
            this._applyEmergingState(wrapper, block, progress);
            block.isEmerged = false;
        } else {
            this._applyEmergedState(wrapper, block.element);
            block.isEmerged = true;
        }
    }

    /**
     * Apply hidden state
     * @private
     */
    _applyHiddenState(wrapper, element) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = `scale(0.1)`;
        element.style.minHeight = '0';
    }

    /**
     * Apply emerging state with animations
     * @private
     */
    _applyEmergingState(wrapper, block, progress) {
        // Use different easing for different aspects
        const positionEase = Easing.smootherStep(progress);
        const scaleEase = Easing.easeInOutQuart(progress);
        const rotationEase = Easing.easeOutQuart(progress);
        const opacityEase = Easing.smoothStep(progress);

        // Calculate position interpolation
        const rect = block.element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        const currentX = block.nodePosition.screenX + (targetX - block.nodePosition.screenX) * positionEase;
        const currentY = block.nodePosition.screenY + (targetY - block.nodePosition.screenY) * positionEase;

        const translateX = currentX - targetX;
        const translateY = currentY - targetY;

        // Smooth scale transition
        const scale = 0.05 + (0.95 * scaleEase);

        // Gentle 3D rotation during emergence
        const rotationIntensity = (1 - rotationEase);
        const rotateX = rotationIntensity * Math.sin(Date.now() * 0.0005 + block.index) * 8;
        const rotateY = rotationIntensity * Math.cos(Date.now() * 0.0007 + block.index) * 8;
        const rotateZ = rotationIntensity * Math.sin(Date.now() * 0.0003 + block.index * 0.5) * 3;

        // Apply transformation
        wrapper.style.opacity = Math.min(1, opacityEase * 1.2);
        wrapper.style.transform = `
            translate3d(${translateX}px, ${translateY}px, ${(1 - positionEase) * 100}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale3d(${scale}, ${scale}, ${scale})
        `;
        wrapper.style.transition = 'opacity 0.3s ease-out, filter 0.4s ease-out';

        // Apply chromatic aberration effect during emergence
        this._applyChromaticAberration(wrapper, progress);

        // Gradually restore section height
        const heightProgress = Easing.smootherStep(progress);
        block.element.style.minHeight = `${block.height * heightProgress}px`;
        block.element.style.transition = 'min-height 0.5s ease-out';
    }

    /**
     * Apply chromatic aberration effect
     * @private
     */
    _applyChromaticAberration(wrapper, progress) {
        if (progress < 0.8) {
            const filterProgress = Easing.smoothStep(progress / 0.8);
            const aberrationAmount = (1 - filterProgress) * 3;
            const blurAmount = (1 - filterProgress) * 2;

            if (aberrationAmount > 0.1) {
                wrapper.style.filter = `
                    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='chromatic-aberration'><feOffset dx='${aberrationAmount}' dy='0' in='SourceGraphic' result='red'/><feOffset dx='-${aberrationAmount}' dy='0' in='SourceGraphic' result='blue'/><feBlend mode='screen' in='red' in2='blue' result='rb'/><feOffset dx='0' dy='0' in='SourceGraphic' result='green'/><feBlend mode='screen' in='rb' in2='green'/></filter></svg>#chromatic-aberration")
                    blur(${blurAmount}px)
                `;
            } else {
                wrapper.style.filter = `blur(${blurAmount}px)`;
            }
        } else {
            wrapper.style.filter = 'none';
        }
    }

    /**
     * Apply fully emerged state
     * @private
     */
    _applyEmergedState(wrapper, element) {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
        wrapper.style.filter = 'none';
        element.style.minHeight = '';
    }

    /**
     * Recalculate block positions (for resize)
     */
    recalculatePositions() {
        this.blocks.forEach(block => {
            const rect = block.element.getBoundingClientRect();
            block.originalTop = rect.top + window.scrollY;
            block.height = rect.height;
        });
    }

    /**
     * Get block by ID
     * @param {string} id - Block ID
     * @returns {Object} Block data
     */
    getBlock(id) {
        return this.blockMap.get(id);
    }

    /**
     * Get all blocks
     * @returns {Array} All blocks
     */
    getAllBlocks() {
        return this.blocks;
    }

    /**
     * Get blocks map
     * @returns {Map} Blocks map
     */
    getBlocksMap() {
        return this.blockMap;
    }
}

/**
 * Active Portal Tracker
 */
export class ActivePortalTracker {
    constructor() {
        this.activePortals = new Set();
    }

    /**
     * Update active portals based on emergence progress
     * @param {Array} blocks - All content blocks
     */
    update(blocks) {
        this.activePortals.clear();

        // Find blocks with active portals (sorted by emergence progress)
        const activeBlocks = blocks
            .filter(block => block.emergenceProgress > 0 && block.emergenceProgress < 0.5)
            .sort((a, b) => b.emergenceProgress - a.emergenceProgress);

        // Take the top most active portals
        activeBlocks
            .slice(0, ParallaxConfig.maxActivePortals)
            .forEach(block => {
                this.activePortals.add(block.id);
            });
    }

    /**
     * Check if a block has an active portal
     * @param {string} blockId - Block ID
     * @returns {boolean} True if active
     */
    isActive(blockId) {
        return this.activePortals.has(blockId);
    }

    /**
     * Get all active portal IDs
     * @returns {Set} Set of active portal IDs
     */
    getActivePortals() {
        return this.activePortals;
    }

    /**
     * Get count of active portals
     * @returns {number} Count
     */
    getCount() {
        return this.activePortals.size;
    }
}

/**
 * 3D Scroll Parallax System for Nubis Digital - Refactored
 * Main orchestrator for content emergence from neural network nodes
 *
 * @module ScrollParallax3D
 */

import { ParallaxConfig } from './config.js';
import { Easing, AnimationUtils, Viewport } from './utils.js';
import { VisualEffectsManager } from './visual-effects.js';
import { NodePortalManager } from './node-portal.js';
import { ContentBlockManager, ActivePortalTracker } from './content-emergence.js';

/**
 * Main 3D Scroll Parallax System
 */
class ScrollParallax3D {
    constructor() {
        // Core state
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastFrameTime = 0;

        // Module managers
        this.visualEffects = new VisualEffectsManager();
        this.nodePortal = new NodePortalManager();
        this.contentBlocks = new ContentBlockManager();
        this.activePortals = new ActivePortalTracker();

        // Bind methods
        this.onScroll = this.onScroll.bind(this);
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialize the parallax system
     */
    initialize() {
        // Wait for 3D scene to be ready
        if (!this._checkDependencies()) {
            setTimeout(() => this.initialize(), 100);
            return;
        }

        console.log('Initializing enhanced 3D scroll parallax system...');

        try {
            // Initialize node portal attributes first
            this.nodePortal.initializeNodeAttributes(window.neuralNetwork, window.nodes);

            // Initialize content blocks
            this.contentBlocks.identifyBlocks();

            // Map blocks to nodes
            this._mapBlocksToNodes();

            // Initialize visual effects
            this.visualEffects.initialize();

            // Create visual elements for each block
            this._createVisualElements();

            // Set initial states
            this.contentBlocks.initializeStates();

            // Set up event listeners
            this._setupEventListeners();

            // Add custom styles
            this._addCustomStyles();

            // Start animation loop
            this.lastFrameTime = Date.now();
            this.animate();

            console.log('Enhanced 3D scroll parallax system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize parallax system:', error);
        }
    }

    /**
     * Check if all dependencies are available
     * @private
     * @returns {boolean} True if dependencies are ready
     */
    _checkDependencies() {
        return (
            typeof window.camera !== 'undefined' &&
            typeof window.neuralNetwork !== 'undefined' &&
            window.nodes
        );
    }

    /**
     * Map content blocks to neural network nodes
     * @private
     */
    _mapBlocksToNodes() {
        const nodes = window.nodes;
        const blocks = this.contentBlocks.getAllBlocks();

        if (!nodes || blocks.length === 0) return;

        const visibleNodes = this.nodePortal.findVisibleNodes(nodes);

        blocks.forEach(block => {
            this.nodePortal.mapBlockToNode(block, visibleNodes, nodes, window.camera);
            console.log(`Block "${block.id}" mapped to node with ${
                this.nodePortal.getMapping(block.id)?.nearbyNodes.length || 0
            } nearby nodes`);
        });
    }

    /**
     * Create visual elements for all blocks
     * @private
     */
    _createVisualElements() {
        const blocks = this.contentBlocks.getAllBlocks();

        blocks.forEach(block => {
            // Create connection line
            const lineData = this.visualEffects.connections.createLineForBlock(block);
            block.connectionLine = lineData?.element || null;
            block.energyWaves = lineData?.energyWaves || [];

            // Create ripples
            this.visualEffects.ripples.createRipplesForBlock(block);
        });
    }

    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners() {
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Handle scroll events
     */
    onScroll() {
        this.targetScrollProgress = Viewport.getScrollProgress();

        this.isScrolling = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 150);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate block positions
        this.contentBlocks.recalculatePositions();

        // Remap nodes
        this._mapBlocksToNodes();

        // Recreate visual elements
        this.visualEffects.connections.clear();
        this.visualEffects.ripples.clear();
        this._createVisualElements();
    }

    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(this.animate);

        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // Smooth scroll interpolation
        const scrollDiff = this.targetScrollProgress - this.scrollProgress;
        this.scrollProgress += scrollDiff * ParallaxConfig.smoothness;

        // Update all systems
        this.updateCamera();
        this.updateNeuralNetwork(deltaTime);
        this.updateContentEmergence(deltaTime);
        this.updateActivePortals();
        this.updateNodePortals(deltaTime);
        this.updateVisualEffects(deltaTime);
    }

    /**
     * Update camera position and rotation
     */
    updateCamera() {
        if (!window.camera) return;

        const [startZ, endZ] = ParallaxConfig.cameraZoomRange;
        const easedProgress = Easing.smoothStep(this.scrollProgress);
        const targetZ = startZ + (endZ - startZ) * easedProgress;

        // Smooth camera zoom
        window.camera.position.z = AnimationUtils.smoothTo(
            window.camera.position.z,
            targetZ,
            ParallaxConfig.smoothness * 0.8
        );

        // Camera rotation with focus on active portal
        this._updateCameraRotation(easedProgress);
    }

    /**
     * Update camera rotation based on scroll and active portals
     * @private
     */
    _updateCameraRotation(easedProgress) {
        if (!window.camera.rotation) return;

        let targetRotationX = easedProgress * 0.05 - 0.025;
        let targetRotationY = Math.sin(easedProgress * Math.PI) * 0.04;

        // Adjust for active portals
        if (this.activePortals.getCount() > 0) {
            const activeBlock = this._getFirstActiveBlock();
            if (activeBlock && activeBlock.nodePosition) {
                const influence = 0.005;
                targetRotationX += activeBlock.nodePosition.worldY * influence;
                targetRotationY += activeBlock.nodePosition.worldX * influence;
            }
        }

        window.camera.rotation.x = AnimationUtils.smoothTo(
            window.camera.rotation.x,
            targetRotationX,
            ParallaxConfig.smoothness * 0.5
        );

        window.camera.rotation.y = AnimationUtils.smoothTo(
            window.camera.rotation.y,
            targetRotationY,
            ParallaxConfig.smoothness * 0.5
        );
    }

    /**
     * Update neural network animation
     * @param {number} deltaTime - Time since last frame
     */
    updateNeuralNetwork(deltaTime) {
        if (!window.neuralNetwork || !window.nodes) return;

        const speedMultiplier = this.isScrolling ? ParallaxConfig.nodeSpeedMultiplier : 1.0;
        const scrollRotation = this.scrollProgress * Math.PI * 0.3;

        // Update network rotation
        if (window.neuralNetwork.rotation) {
            const targetRotationY = scrollRotation + Math.sin(Date.now() * 0.0001) * 0.15;
            const targetRotationX = this.scrollProgress * 0.2 + Math.cos(Date.now() * 0.00015) * 0.1;

            window.neuralNetwork.rotation.y = AnimationUtils.smoothTo(
                window.neuralNetwork.rotation.y,
                targetRotationY,
                0.02
            );

            window.neuralNetwork.rotation.x = AnimationUtils.smoothTo(
                window.neuralNetwork.rotation.x,
                targetRotationX,
                0.02
            );

            // Sync connection lines rotation
            if (window.connectionLines) {
                window.connectionLines.rotation.y = window.neuralNetwork.rotation.y;
                window.connectionLines.rotation.x = window.neuralNetwork.rotation.x;
            }
        }

        // Update depth-of-field effect
        this.nodePortal.updateDepthOfField(window.neuralNetwork, window.nodes);
    }

    /**
     * Update content emergence
     * @param {number} deltaTime - Time since last frame
     */
    updateContentEmergence(deltaTime) {
        this.contentBlocks.updateEmergence(
            deltaTime,
            window.camera,
            window.nodes,
            // On emergence start callback
            (block) => {
                this.visualEffects.particles.createBurst(
                    block.nodePosition.screenX,
                    block.nodePosition.screenY,
                    20
                );
            },
            // On emergence progress callback
            (block, progress) => {
                const rect = block.element.getBoundingClientRect();
                const positionEase = Easing.smootherStep(progress);
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                const currentX = block.nodePosition.screenX + (targetX - block.nodePosition.screenX) * positionEase;
                const currentY = block.nodePosition.screenY + (targetY - block.nodePosition.screenY) * positionEase;

                // Create trailing particle
                this.visualEffects.particles.createParticle(
                    currentX,
                    currentY,
                    1 + Math.random() * 3,
                    `hsl(${200 + Math.random() * 40}, 80%, 60%)`
                );
            }
        );
    }

    /**
     * Update active portals tracking
     */
    updateActivePortals() {
        this.activePortals.update(this.contentBlocks.getAllBlocks());
    }

    /**
     * Update node portal effects
     * @param {number} deltaTime - Time since last frame
     */
    updateNodePortals(deltaTime) {
        if (!window.neuralNetwork || !window.nodes) return;

        const blocks = this.contentBlocks.getAllBlocks();

        blocks.forEach(block => {
            const portalStrength = this.nodePortal.updatePortalEffects(
                block,
                window.neuralNetwork,
                window.nodes
            );

            // Create ripple effect at high portal strength
            if (portalStrength > 0.05 && Math.random() < portalStrength * 0.2) {
                this.visualEffects.ripples.startRipple(block.id, block.nodePosition);
            }
        });
    }

    /**
     * Update all visual effects
     * @param {number} deltaTime - Time since last frame
     */
    updateVisualEffects(deltaTime) {
        this.visualEffects.update(
            deltaTime,
            this.contentBlocks.getBlocksMap(),
            this.activePortals.getActivePortals()
        );
    }

    /**
     * Get the first active block
     * @private
     * @returns {Object|null} Active block or null
     */
    _getFirstActiveBlock() {
        const blocks = this.contentBlocks.getAllBlocks();
        return blocks.find(block => this.activePortals.isActive(block.id)) || null;
    }

    /**
     * Add custom CSS styles
     * @private
     */
    _addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Parallax content wrapper */
            .parallax-content-wrapper {
                transform-origin: center center;
                backface-visibility: hidden;
                will-change: transform, opacity, filter;
                transition: filter 0.3s ease;
            }

            /* Parallax sections */
            [data-parallax-block] {
                transition: min-height 0.3s ease-out;
            }

            /* First section - no parallax */
            section:first-of-type {
                position: relative !important;
                z-index: 10 !important;
                transform: none !important;
                opacity: 1 !important;
            }

            /* Connection lines container */
            #parallax-connections {
                mix-blend-mode: screen;
            }

            /* Content emergence states */
            [data-emergence-state="hidden"] {
                pointer-events: none;
            }

            [data-emergence-state="emerging"] .glass-panel {
                backdrop-filter: blur(30px) !important;
                background: linear-gradient(
                    135deg,
                    rgba(56, 189, 248, 0.15),
                    rgba(99, 102, 241, 0.05)
                ) !important;
                border-color: rgba(56, 189, 248, 0.4) !important;
                box-shadow:
                    0 0 60px rgba(56, 189, 248, 0.3),
                    inset 0 0 30px rgba(56, 189, 248, 0.1) !important;
            }

            [data-emergence-state="expanding"] .glass-panel {
                backdrop-filter: blur(25px) !important;
                background: rgba(30, 41, 59, 0.5) !important;
                border-color: rgba(129, 140, 248, 0.3) !important;
                box-shadow:
                    0 15px 40px rgba(56, 189, 248, 0.2),
                    inset 0 0 20px rgba(56, 189, 248, 0.05) !important;
            }

            /* Energy wave particle animation */
            @keyframes pulse-glow {
                0%, 100% { opacity: 0.6; transform: scale(0.8); filter: blur(2px); }
                50% { opacity: 1; transform: scale(1.2); filter: blur(3px); }
            }

            /* Connection line animation */
            .connection-line {
                animation: line-shimmer 8s linear infinite;
            }

            @keyframes line-shimmer {
                0%, 100% { stroke-opacity: 0.7; filter: blur(1px); }
                50% { stroke-opacity: 0.9; filter: blur(1.5px); }
            }

            /* Disable for reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .parallax-content-wrapper {
                    transition: none !important;
                    transform: none !important;
                    filter: none !important;
                }

                #parallax-connections,
                #parallax-particles,
                #parallax-ripples {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Destroy the parallax system
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.handleResize);

        // Clear visual effects
        this.visualEffects.clear();
        this.nodePortal.clear();

        console.log('Parallax system destroyed');
    }
}

export default ScrollParallax3D;

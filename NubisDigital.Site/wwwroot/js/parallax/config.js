/**
 * Configuration Module for 3D Scroll Parallax System
 * Centralized configuration for all parallax effects
 */

export const ParallaxConfig = {
    // Animation smoothness
    smoothness: 0.04,
    emergenceSmoothing: 0.03,
    transitionDuration: 1.5,

    // Camera settings
    cameraZoomRange: [30, 15],
    rotationIntensity: 0.2,
    perspectiveBase: 1200,

    // Node animation
    nodeSpeedMultiplier: 1.2,
    maxActivePortals: 2,

    // Particle effects
    particleCount: 15,
    particleLifespan: 2000,
    particleSize: [3, 8],
    particleSpeed: [0.5, 2],

    // Visual effects
    rippleCount: 3,
    energyWaveCount: 3,

    // Clustering
    clusterMaxNodes: 3,
    clusterMaxDistance: 3,

    // Emergence thresholds
    triggerOffset: 0.8,  // Viewport height multiplier for trigger point
    endOffset: 0.3       // Viewport height multiplier for end point
};

/**
 * Visual effect constants
 */
export const VisualConstants = {
    GRADIENT_COLORS: {
        start: '#38bdf8',
        end: '#818cf8',
        portal: '#6366f1'
    },

    NODE_BASE_COLOR: {
        r: 0.22,
        g: 0.74,
        b: 0.97
    },

    FILTER_IDS: {
        holographic: 'holographic-filter',
        turbulence: 'turbulence'
    },

    EMERGENCE_STATES: {
        HIDDEN: 'hidden',
        EMERGING: 'emerging',
        EXPANDING: 'expanding',
        VISIBLE: 'visible'
    }
};

/**
 * DOM element IDs
 */
export const ElementIDs = {
    CONNECTIONS: 'parallax-connections',
    PARTICLES: 'parallax-particles',
    RIPPLES: 'parallax-ripples'
};

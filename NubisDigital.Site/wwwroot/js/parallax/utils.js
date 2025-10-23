/**
 * Utility Functions Module for 3D Scroll Parallax System
 * Collection of helper functions for animations and calculations
 */

/**
 * Easing Functions
 */
export const Easing = {
    /**
     * Ease out cubic easing function
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Eased value
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    /**
     * Ease in-out cubic easing function
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    /**
     * Ease out quartic easing function
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Eased value
     */
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    },

    /**
     * Ease in-out quartic easing function
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Eased value
     */
    easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },

    /**
     * Smooth step interpolation
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Smoothed value
     */
    smoothStep(t) {
        return t * t * (3 - 2 * t);
    },

    /**
     * Smoother step interpolation (Ken Perlin's version)
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Smoothed value
     */
    smootherStep(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
};

/**
 * Vector and spatial calculation utilities
 */
export const Spatial = {
    /**
     * Calculate Euclidean distance between two 3D points
     * @param {Object} p1 - First point {x, y, z}
     * @param {Object} p2 - Second point {x, y, z}
     * @returns {number} Distance
     */
    distance3D(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    /**
     * Project 3D position to 2D screen coordinates
     * @param {THREE.Vector3} vector - 3D vector
     * @param {THREE.Camera} camera - Camera instance
     * @returns {Object} Screen coordinates {x, y}
     */
    projectToScreen(vector, camera) {
        const projected = vector.clone().project(camera);
        return {
            x: (projected.x * 0.5 + 0.5) * window.innerWidth,
            y: (-projected.y * 0.5 + 0.5) * window.innerHeight
        };
    },

    /**
     * Get screen position for a node
     * @param {Object} node - Node with x, y, z properties
     * @param {THREE.Camera} camera - Camera instance
     * @returns {Object} Screen position {screenX, screenY, worldX, worldY, worldZ}
     */
    getNodeScreenPosition(node, camera) {
        const vector = new THREE.Vector3(node.x, node.y, node.z);
        const screen = this.projectToScreen(vector, camera);

        return {
            screenX: screen.x,
            screenY: screen.y,
            worldX: node.x,
            worldY: node.y,
            worldZ: node.z
        };
    }
};

/**
 * Random number utilities
 */
export const Random = {
    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random value
     */
    between(min, max) {
        return min + Math.random() * (max - min);
    },

    /**
     * Generate random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    intBetween(min, max) {
        return Math.floor(this.between(min, max + 1));
    },

    /**
     * Generate random color in HSL format
     * @param {number} hueMin - Minimum hue (0-360)
     * @param {number} hueMax - Maximum hue (0-360)
     * @param {number} saturation - Saturation percentage (0-100)
     * @param {number} lightness - Lightness percentage (0-100)
     * @returns {string} HSL color string
     */
    hslColor(hueMin, hueMax, saturation = 80, lightness = 60) {
        const hue = this.between(hueMin, hueMax);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
};

/**
 * DOM utilities
 */
export const DOM = {
    /**
     * Create an SVG element with attributes
     * @param {string} type - SVG element type
     * @param {Object} attributes - Attributes to set
     * @returns {SVGElement} Created element
     */
    createSVGElement(type, attributes = {}) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', type);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    },

    /**
     * Create a div element with styles
     * @param {Object} styles - CSS styles object
     * @returns {HTMLDivElement} Created element
     */
    createDiv(styles = {}) {
        const div = document.createElement('div');
        Object.entries(styles).forEach(([key, value]) => {
            div.style[key] = value;
        });
        return div;
    },

    /**
     * Get or create an element by ID
     * @param {string} id - Element ID
     * @param {Function} creator - Function to create element if not found
     * @returns {HTMLElement} Element
     */
    getOrCreate(id, creator) {
        let element = document.getElementById(id);
        if (!element) {
            element = creator();
            element.id = id;
            document.body.appendChild(element);
        }
        return element;
    }
};

/**
 * Animation frame rate utilities
 */
export const AnimationUtils = {
    /**
     * Normalize delta time for consistent animation speed
     * @param {number} deltaTime - Time since last frame in ms
     * @param {number} targetFPS - Target frames per second (default 60)
     * @returns {number} Normalized multiplier
     */
    normalizeDelta(deltaTime, targetFPS = 60) {
        const targetFrameTime = 1000 / targetFPS;
        return deltaTime / targetFrameTime;
    },

    /**
     * Smooth interpolation toward a target value
     * @param {number} current - Current value
     * @param {number} target - Target value
     * @param {number} smoothness - Smoothness factor (0-1)
     * @returns {number} New value
     */
    smoothTo(current, target, smoothness) {
        return current + (target - current) * smoothness;
    }
};

/**
 * Viewport and scroll utilities
 */
export const Viewport = {
    /**
     * Get scroll progress as a value between 0 and 1
     * @returns {number} Scroll progress
     */
    getScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} threshold - Threshold multiplier (default 0)
     * @returns {boolean} True if in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return rect.top < windowHeight * (1 + threshold) && rect.bottom > -windowHeight * threshold;
    },

    /**
     * Get element's distance from viewport top
     * @param {HTMLElement} element - Element to check
     * @returns {number} Distance in pixels
     */
    getDistanceFromTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top;
    }
};

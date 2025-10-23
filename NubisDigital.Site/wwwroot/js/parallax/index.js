/**
 * 3D Scroll Parallax System - Entry Point
 * Webpack bundle entry that imports and initializes the main system
 */

import ScrollParallax3D from './main.js';

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollParallax);
} else {
    initScrollParallax();
}

function initScrollParallax() {
    const parallaxSystem = new ScrollParallax3D();
    parallaxSystem.initialize();

    // Store globally for debugging/external access
    window.scrollParallax3D = parallaxSystem;
}

export default ScrollParallax3D;

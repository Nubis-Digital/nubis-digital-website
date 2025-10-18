// Global Liquid Glass Effect - Mouse Tracking for All Interactive Elements
// Applies to all buttons, links, and interactive elements across the website

(function() {
  'use strict';
  
  // Prevent multiple initializations
  if (window.__globalLiquidGlassInitialized) {
    return;
  }
  window.__globalLiquidGlassInitialized = true;
  
  // Smooth interpolation helper
  const lerp = (start, end, factor) => start + (end - start) * factor;
  
  // Track all interactive elements
  const selector = 'a:not(.no-glass), button:not(.no-glass), .btn-primary, .btn-secondary, .btn-outline, [role="button"]:not(.no-glass)';
  
  // Initialize tracking for an element
  function initElementTracking(element) {
    // Skip if already initialized
    if (element.dataset.glassTracked) return;
    element.dataset.glassTracked = 'true';
    
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let animationFrameId = null;
    let isHovering = false;
    
    const updatePosition = () => {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);
      
      element.style.setProperty('--glass-mouse-x', `${currentX}%`);
      element.style.setProperty('--glass-mouse-y', `${currentY}%`);
      
      // Continue animation if not at target
      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        animationFrameId = null;
      }
    };
    
    // Mouse enter - start tracking
    element.addEventListener('mouseenter', () => {
      isHovering = true;
    });
    
    // Mouse move - update target position
    element.addEventListener('mousemove', (e) => {
      if (isHovering) {
        const rect = element.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Start animation if not already running
        if (!animationFrameId) {
          updatePosition();
        }
      }
    });
    
    // Mouse leave - reset to center
    element.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 50;
      targetY = 50;
      
      // Animate back to center
      if (!animationFrameId) {
        updatePosition();
      }
    });
    
    // Touch support for mobile devices
    element.addEventListener('touchstart', (e) => {
      isHovering = true;
      const rect = element.getBoundingClientRect();
      const touch = e.touches[0];
      targetX = ((touch.clientX - rect.left) / rect.width) * 100;
      targetY = ((touch.clientY - rect.top) / rect.height) * 100;
      
      if (!animationFrameId) {
        updatePosition();
      }
    }, { passive: true });
    
    element.addEventListener('touchend', () => {
      isHovering = false;
      targetX = 50;
      targetY = 50;
      
      if (!animationFrameId) {
        updatePosition();
      }
    }, { passive: true });
  }
  
  // Initialize all existing elements
  function initAllElements() {
    const elements = document.querySelectorAll(selector);
    elements.forEach(initElementTracking);
  }
  
  // Watch for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if the node itself matches
          if (node.matches && node.matches(selector)) {
            initElementTracking(node);
          }
          // Check children
          if (node.querySelectorAll) {
            const children = node.querySelectorAll(selector);
            children.forEach(initElementTracking);
          }
        }
      });
    });
  });
  
  // Start observing
  function startObserving() {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAllElements();
      startObserving();
    });
  } else {
    initAllElements();
    startObserving();
  }
  
  // Re-initialize on page navigation (for SPAs)
  window.addEventListener('popstate', initAllElements);
  
  // Expose API for manual initialization if needed
  window.liquidGlass = {
    init: initAllElements,
    initElement: initElementTracking
  };
  
})();
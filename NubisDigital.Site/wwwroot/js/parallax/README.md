# 3D Scroll Parallax System - Documentation

## Overview

The 3D Scroll Parallax System creates an immersive scrolling experience where content emerges from neural network nodes with enhanced visual effects. This refactored version is modular, maintainable, and well-documented.

## Architecture

### Module Structure

```
parallax/
├── config.js              # Configuration and constants
├── utils.js               # Utility functions (easing, spatial, DOM)
├── visual-effects.js      # Particle, ripple, and connection line systems
├── node-portal.js         # Node portal and clustering management
├── content-emergence.js   # Content block emergence logic
└── README.md             # This file

scroll-parallax-3d-refactored.js  # Main orchestrator
```

## Modules

### 1. Configuration (`config.js`)

Centralized configuration for all parallax effects.

**Key Exports:**
- `ParallaxConfig` - Main configuration object
- `VisualConstants` - Visual effect constants (colors, states)
- `ElementIDs` - DOM element identifiers

**Configuration Options:**
```javascript
ParallaxConfig = {
    smoothness: 0.04,              // Animation smoothness
    cameraZoomRange: [30, 15],     // Camera zoom range [start, end]
    nodeSpeedMultiplier: 1.2,      // Node speed when scrolling
    particleCount: 15,             // Number of particles
    maxActivePortals: 2            // Maximum active portals
}
```

### 2. Utilities (`utils.js`)

Collection of helper functions organized into namespaces.

**Key Exports:**
- `Easing` - Easing functions (smoothStep, easeInOutQuart, etc.)
- `Spatial` - 3D spatial calculations and projections
- `Random` - Random number generators
- `DOM` - DOM manipulation helpers
- `AnimationUtils` - Animation frame utilities
- `Viewport` - Scroll and viewport utilities

**Example Usage:**
```javascript
import { Easing, Spatial } from './utils.js';

const eased = Easing.smoothStep(0.5);
const screenPos = Spatial.getNodeScreenPosition(node, camera);
```

### 3. Visual Effects (`visual-effects.js`)

Manages all visual effects systems.

**Key Classes:**
- `ParticleSystem` - Particle creation and animation
- `RippleSystem` - Ripple effects on nodes
- `ConnectionLineSystem` - Connection lines with holographic effects
- `VisualEffectsManager` - Coordinator for all visual effects

**Example Usage:**
```javascript
const visualEffects = new VisualEffectsManager();
visualEffects.initialize();
visualEffects.particles.createBurst(x, y, 20);
visualEffects.update(deltaTime, blockMap, activePortals);
```

### 4. Node Portal (`node-portal.js`)

Manages portal nodes and clustering effects.

**Key Class:**
- `NodePortalManager` - Portal node management and effects

**Features:**
- Node-to-block mapping
- Clustering (finds nearby nodes)
- Portal vortex effects
- Dynamic node sizing and coloring
- Depth-of-field effects

**Example Usage:**
```javascript
const nodePortal = new NodePortalManager();
nodePortal.mapBlockToNode(block, visibleNodes, allNodes, camera);
nodePortal.updatePortalEffects(block, neuralNetwork, nodes);
```

### 5. Content Emergence (`content-emergence.js`)

Manages content block emergence animations.

**Key Classes:**
- `ContentBlockManager` - Content block identification and emergence
- `ActivePortalTracker` - Tracks currently active portals

**Features:**
- Automatic content block detection
- Smooth emergence animations
- 3D transformations with easing
- Chromatic aberration effects
- State management (hidden, emerging, expanding, visible)

**Example Usage:**
```javascript
const contentBlocks = new ContentBlockManager();
contentBlocks.identifyBlocks();
contentBlocks.updateEmergence(deltaTime, camera, nodes, callbacks);
```

### 6. Main Orchestrator (`scroll-parallax-3d-refactored.js`)

Main class that coordinates all modules.

**Key Class:**
- `ScrollParallax3D` - Main system coordinator

**Responsibilities:**
- Initialize all modules
- Coordinate animation loop
- Handle scroll and resize events
- Update camera, neural network, and all effects

## Usage

### Basic Setup

1. **Include the refactored script as a module:**

```html
<script type="module" src="/js/scroll-parallax-3d-refactored.js"></script>
```

2. **The system auto-initializes when:**
   - DOM is ready
   - Three.js scene is initialized
   - Neural network nodes are available

### Requirements

The system depends on these global objects being available:
- `window.camera` - Three.js camera
- `window.neuralNetwork` - Three.js neural network object
- `window.nodes` - Array of neural network nodes
- `window.connectionLines` (optional) - Three.js connection lines

### HTML Structure

Content blocks should be `<section>` elements with unique IDs:

```html
<section id="hero">
  <!-- First section - skipped from parallax -->
</section>

<section id="about">
  <!-- This will emerge from a neural node -->
</section>

<section id="services">
  <!-- This will emerge from another node -->
</section>
```

## Customization

### Adjusting Animation Speed

Edit `config.js`:

```javascript
export const ParallaxConfig = {
    smoothness: 0.04,  // Lower = slower, Higher = faster
    // ...
};
```

### Changing Colors

Edit `config.js`:

```javascript
export const VisualConstants = {
    GRADIENT_COLORS: {
        start: '#38bdf8',  // Your color
        end: '#818cf8',    // Your color
        portal: '#6366f1'  // Your color
    },
    // ...
};
```

### Adding New Easing Functions

Add to `utils.js`:

```javascript
export const Easing = {
    // Existing functions...

    myCustomEasing(t) {
        return t * t * t;
    }
};
```

## Performance Considerations

### Optimizations Built-In

1. **Particle Pooling** - Particles are created and destroyed efficiently
2. **Smooth Interpolation** - Reduces visual jank with eased animations
3. **Depth-of-Field** - Background nodes are smaller for better performance
4. **Active Portal Limiting** - Only 2 portals active simultaneously
5. **RequestAnimationFrame** - Proper animation timing

### Tips for Better Performance

1. Reduce `particleCount` in config
2. Increase `smoothness` value (faster but less smooth)
3. Decrease `maxActivePortals`
4. Use fewer content sections

## Accessibility

The system respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    .parallax-content-wrapper {
        transform: none !important;
    }
    #parallax-connections,
    #parallax-particles {
        display: none !important;
    }
}
```

## Debugging

Access the system instance via console:

```javascript
// Available after initialization
window.scrollParallax3D

// Useful debug commands
window.scrollParallax3D.contentBlocks.getAllBlocks()
window.scrollParallax3D.activePortals.getActivePortals()
window.scrollParallax3D.nodePortal.getMapping('section-id')
```

## Migration from Original

To migrate from the original `scroll-parallax-3d.js`:

1. **Replace the script tag:**
   ```html
   <!-- Old -->
   <script src="/js/scroll-parallax-3d.js"></script>

   <!-- New -->
   <script type="module" src="/js/scroll-parallax-3d-refactored.js"></script>
   ```

2. **No code changes needed** - The API is compatible

3. **Adjust configuration** in `config.js` instead of inline

## Benefits of Refactoring

### Code Organization
- ✅ **Modular structure** - Easy to maintain and extend
- ✅ **Separation of concerns** - Each module has a single responsibility
- ✅ **Reusable components** - Modules can be used independently

### Maintainability
- ✅ **Clear documentation** - JSDoc comments throughout
- ✅ **Named functions** - Better stack traces for debugging
- ✅ **Type hints** - JSDoc provides IDE autocomplete

### Performance
- ✅ **Optimized updates** - Reduced redundant calculations
- ✅ **Better memory management** - Proper cleanup methods
- ✅ **Efficient particle system** - Backward iteration for safe removal

### Extensibility
- ✅ **Easy to add features** - Clear extension points
- ✅ **Configurable** - Centralized configuration
- ✅ **Testable** - Modules can be unit tested

## License

Part of Nubis Digital website - All rights reserved.

## Support

For issues or questions, contact the development team.

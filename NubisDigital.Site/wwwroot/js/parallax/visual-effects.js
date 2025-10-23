/**
 * Visual Effects Module for 3D Scroll Parallax System
 * Manages particles, ripples, energy waves, and connection lines
 */

import { ParallaxConfig, VisualConstants, ElementIDs } from './config.js';
import { DOM, Random, Easing } from './utils.js';

/**
 * Particle System Manager
 */
export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
    }

    /**
     * Initialize particle container
     */
    initialize() {
        this.container = DOM.getOrCreate(ElementIDs.PARTICLES, () => {
            return DOM.createDiv({
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '6',
                overflow: 'hidden'
            });
        });

        this.particles = [];
    }

    /**
     * Create a single particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Particle size
     * @param {string} color - Particle color
     * @param {number} vx - X velocity
     * @param {number} vy - Y velocity
     * @param {number} lifetime - Particle lifetime in ms
     * @param {boolean} gravity - Whether to apply gravity
     */
    createParticle(x, y, size, color, vx, vy, lifetime, gravity = false) {
        if (!this.container) return;

        // Default values
        vx = vx || Random.between(-ParallaxConfig.particleSpeed[1], ParallaxConfig.particleSpeed[1]);
        vy = vy || Random.between(-ParallaxConfig.particleSpeed[1], ParallaxConfig.particleSpeed[1]);
        lifetime = lifetime || Random.between(500, 1500);

        // Create particle element
        const element = DOM.createDiv({
            position: 'absolute',
            left: '0',
            top: '0',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: color || VisualConstants.GRADIENT_COLORS.start,
            transform: `translate(${x}px, ${y}px)`,
            pointerEvents: 'none',
            zIndex: '10',
            filter: 'blur(1px)',
            boxShadow: `0 0 ${size * 2}px ${color || 'rgba(56, 189, 248, 0.8)'}`
        });

        element.className = 'parallax-particle';
        this.container.appendChild(element);

        // Add to particles array
        const particle = {
            element,
            x,
            y,
            vx,
            vy,
            scale: 1,
            lifetime,
            maxLifetime: lifetime,
            gravity
        };

        this.particles.push(particle);
        return particle;
    }

    /**
     * Create a burst of particles
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of particles
     * @param {string} color - Optional color
     */
    createBurst(x, y, count = 10, color = null) {
        for (let i = 0; i < count; i++) {
            const angle = Random.between(0, Math.PI * 2);
            const speed = Random.between(0.5, 2);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const size = Random.between(2, 6);
            const particleColor = color || Random.hslColor(200, 240, 80, 60);

            this.createParticle(x, y, size, particleColor, vx, vy, Random.between(500, 1500));
        }
    }

    /**
     * Update all particles
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.container) return;

        // Update existing particles (iterate backwards for safe removal)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update lifetime
            particle.lifetime -= deltaTime;

            // Remove if expired
            if (particle.lifetime <= 0) {
                particle.element.remove();
                this.particles.splice(i, 1);
                continue;
            }

            // Calculate lifecycle progress
            const progress = particle.lifetime / particle.maxLifetime;
            const opacity = progress < 0.3 ? (progress / 0.3) : progress;

            // Update position
            const normalizedDelta = deltaTime / 16;
            particle.x += particle.vx * normalizedDelta;
            particle.y += particle.vy * normalizedDelta;

            // Apply gravity if specified
            if (particle.gravity) {
                particle.vy += 0.05 * normalizedDelta;
            }

            // Update element style
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`;
            particle.element.style.opacity = opacity.toString();
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles.forEach(particle => particle.element.remove());
        this.particles = [];
    }
}

/**
 * Ripple Effect System
 */
export class RippleSystem {
    constructor() {
        this.ripples = [];
        this.svg = null;
    }

    /**
     * Initialize ripple container
     */
    initialize() {
        this.svg = DOM.getOrCreate(ElementIDs.RIPPLES, () => {
            return DOM.createSVGElement('svg', {
                style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 4;'
            });
        });

        this.ripples = [];
    }

    /**
     * Create ripple elements for a block
     * @param {Object} block - Content block
     */
    createRipplesForBlock(block) {
        if (!this.svg || !block.nodePosition) return;

        const blockRipples = [];

        for (let i = 0; i < ParallaxConfig.rippleCount; i++) {
            const colors = [
                VisualConstants.GRADIENT_COLORS.start,
                VisualConstants.GRADIENT_COLORS.end,
                VisualConstants.GRADIENT_COLORS.portal
            ];

            const ripple = DOM.createSVGElement('circle', {
                cx: block.nodePosition.screenX,
                cy: block.nodePosition.screenY,
                r: '10',
                fill: 'none',
                stroke: colors[i],
                'stroke-width': `${3 - i}px`,
                opacity: '0'
            });

            this.svg.appendChild(ripple);

            const rippleData = {
                element: ripple,
                blockId: block.id,
                index: i,
                scale: 1,
                opacity: 0,
                active: false
            };

            blockRipples.push(rippleData);
            this.ripples.push(rippleData);
        }

        return blockRipples;
    }

    /**
     * Start ripple effect on a specific block
     * @param {string} blockId - Block ID
     * @param {Object} nodePosition - Node screen position
     */
    startRipple(blockId, nodePosition) {
        const blockRipples = this.ripples.filter(r => r.blockId === blockId);

        // Skip if already active
        if (blockRipples.some(r => r.active)) return;

        // Update ripple positions
        blockRipples.forEach(ripple => {
            ripple.element.setAttribute('cx', nodePosition.screenX);
            ripple.element.setAttribute('cy', nodePosition.screenY);
        });

        // Trigger ripple animation with staggered delay
        blockRipples.forEach((ripple, index) => {
            ripple.active = true;
            ripple.scale = 0.2;
            ripple.opacity = 0.8;

            setTimeout(() => {
                ripple.element.setAttribute('opacity', ripple.opacity);
            }, index * 150);
        });
    }

    /**
     * Update ripple animations
     * @param {number} deltaTime - Time since last frame
     * @param {Map} blockMap - Map of block ID to block data
     */
    update(deltaTime, blockMap) {
        const normalizedDelta = deltaTime / 16;

        this.ripples.forEach(ripple => {
            if (!ripple.active) return;

            const block = blockMap.get(ripple.blockId);
            if (!block || !block.nodePosition) return;

            // Update position to follow node
            ripple.element.setAttribute('cx', block.nodePosition.screenX);
            ripple.element.setAttribute('cy', block.nodePosition.screenY);

            // Expand ripple
            ripple.scale += 0.05 * normalizedDelta;
            ripple.opacity -= 0.03 * normalizedDelta;

            // Apply changes
            ripple.element.setAttribute('r', 10 * ripple.scale);
            ripple.element.setAttribute('opacity', Math.max(0, ripple.opacity));

            // Reset when done
            if (ripple.opacity <= 0) {
                ripple.active = false;
                ripple.scale = 0.2;
            }
        });
    }

    /**
     * Clear all ripples
     */
    clear() {
        this.ripples.forEach(ripple => ripple.element.remove());
        this.ripples = [];
    }
}

/**
 * Connection Line System
 */
export class ConnectionLineSystem {
    constructor() {
        this.lines = [];
        this.svg = null;
        this.filters = null;
    }

    /**
     * Initialize connection line container and filters
     */
    initialize() {
        this.svg = DOM.getOrCreate(ElementIDs.CONNECTIONS, () => {
            const svg = DOM.createSVGElement('svg', {
                style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: screen;'
            });

            this._createFilters(svg);
            return svg;
        });

        this.lines = [];
    }

    /**
     * Create SVG filters for holographic effect
     * @private
     */
    _createFilters(svg) {
        const defs = DOM.createSVGElement('defs');

        // Create holographic filter
        const holoFilter = DOM.createSVGElement('filter', {
            id: VisualConstants.FILTER_IDS.holographic,
            x: '-50%',
            y: '-50%',
            width: '200%',
            height: '200%'
        });

        // Turbulence for noise
        const turbulence = DOM.createSVGElement('feTurbulence', {
            id: VisualConstants.FILTER_IDS.turbulence,
            type: 'fractalNoise',
            baseFrequency: '0.03 0.03',
            numOctaves: '2',
            seed: '1',
            stitchTiles: 'stitch'
        });

        // Add animation
        const animate = DOM.createSVGElement('animate', {
            attributeName: 'seed',
            from: '1',
            to: '10',
            dur: '8s',
            repeatCount: 'indefinite'
        });
        turbulence.appendChild(animate);

        // Displacement map
        const displacementMap = DOM.createSVGElement('feDisplacementMap', {
            in: 'SourceGraphic',
            in2: VisualConstants.FILTER_IDS.turbulence,
            scale: '5',
            xChannelSelector: 'R',
            yChannelSelector: 'G'
        });

        // Specular lighting
        const specularLighting = DOM.createSVGElement('feSpecularLighting', {
            in: VisualConstants.FILTER_IDS.turbulence,
            specularConstant: '1.2',
            specularExponent: '20',
            surfaceScale: '5',
            'lighting-color': '#ccf'
        });

        const distantLight = DOM.createSVGElement('feDistantLight', {
            azimuth: '45',
            elevation: '60'
        });
        specularLighting.appendChild(distantLight);

        // Composite
        const composite = DOM.createSVGElement('feComposite', {
            in: 'specularLighting',
            in2: 'SourceGraphic',
            operator: 'arithmetic',
            k1: '0',
            k2: '1',
            k3: '1',
            k4: '0'
        });

        // Blur
        const blur = DOM.createSVGElement('feGaussianBlur', {
            stdDeviation: '2',
            edgeMode: 'none'
        });

        // Assemble filter
        holoFilter.appendChild(turbulence);
        holoFilter.appendChild(displacementMap);
        holoFilter.appendChild(specularLighting);
        holoFilter.appendChild(composite);
        holoFilter.appendChild(blur);
        defs.appendChild(holoFilter);
        svg.appendChild(defs);

        this.filters = { turbulence };
    }

    /**
     * Create connection line for a block
     * @param {Object} block - Content block
     */
    createLineForBlock(block) {
        if (!this.svg || !block.nodePosition) return null;

        // Create gradient
        const gradient = DOM.createSVGElement('linearGradient', {
            id: `gradient-${block.index}`,
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '100%'
        });

        const stop1 = DOM.createSVGElement('stop', {
            offset: '0%',
            'stop-color': VisualConstants.GRADIENT_COLORS.start,
            'stop-opacity': '0.9'
        });

        const stop2 = DOM.createSVGElement('stop', {
            offset: '100%',
            'stop-color': VisualConstants.GRADIENT_COLORS.end,
            'stop-opacity': '0.4'
        });

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        this.svg.appendChild(gradient);

        // Create path
        const path = DOM.createSVGElement('path', {
            stroke: `url(#gradient-${block.index})`,
            'stroke-width': '3',
            fill: 'none',
            opacity: '0',
            style: `filter: url(#${VisualConstants.FILTER_IDS.holographic})`
        });

        path.classList.add('connection-line');
        this.svg.appendChild(path);

        const lineData = {
            element: path,
            blockId: block.id,
            energyWaves: []
        };

        // Create energy waves
        for (let i = 0; i < ParallaxConfig.energyWaveCount; i++) {
            const wave = DOM.createSVGElement('circle', {
                r: '3',
                fill: VisualConstants.GRADIENT_COLORS.start,
                opacity: '0',
                style: 'filter: blur(2px) brightness(1.5)'
            });

            this.svg.appendChild(wave);
            lineData.energyWaves.push(wave);
        }

        this.lines.push(lineData);
        return lineData;
    }

    /**
     * Update connection lines
     * @param {number} deltaTime - Time since last frame
     * @param {Map} blockMap - Map of block ID to block data
     * @param {Set} activePortals - Set of active portal IDs
     */
    update(deltaTime, blockMap, activePortals) {
        this.lines.forEach(line => {
            const block = blockMap.get(line.blockId);
            if (!block || !block.nodePosition) return;

            const progress = block.emergenceProgress || 0;

            if (progress > 0 && progress < 1) {
                this._updateLinePath(line, block, progress, activePortals);
                this._updateEnergyWaves(line, deltaTime, progress);
            } else {
                line.element.setAttribute('opacity', '0');
                line.energyWaves.forEach(wave => wave.setAttribute('opacity', '0'));
            }
        });
    }

    /**
     * Update line path
     * @private
     */
    _updateLinePath(line, block, progress, activePortals) {
        const rect = block.element.getBoundingClientRect();
        const sectionX = rect.left + rect.width / 2;
        const sectionY = rect.top + rect.height / 2;

        const startX = block.nodePosition.screenX;
        const startY = block.nodePosition.screenY;

        // Control points for bezier curve
        const cp1X = startX + (sectionX - startX) * 0.3;
        const cp1Y = startY - 50;
        const cp2X = startX + (sectionX - startX) * 0.7;
        const cp2Y = sectionY - 100;

        const pathData = `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${sectionX},${sectionY}`;

        line.element.setAttribute('d', pathData);
        line.element.setAttribute('opacity', Math.min(0.8, progress * 2));
        line.element.style.strokeDasharray = '1000';
        line.element.style.strokeDashoffset = 1000 * (1 - progress);

        // Enhanced effect for active portals
        if (activePortals.has(block.id)) {
            this._applyActivePortalEffect(line);
        } else {
            line.element.setAttribute('stroke-width', '3');
            line.element.style.filter = `url(#${VisualConstants.FILTER_IDS.holographic})`;
        }
    }

    /**
     * Apply enhanced visual effect to active portal connections
     * @private
     */
    _applyActivePortalEffect(line) {
        if (this.filters && this.filters.turbulence) {
            const frequency = 0.03 + Math.sin(Date.now() * 0.001) * 0.01;
            this.filters.turbulence.setAttribute('baseFrequency', `${frequency} ${frequency}`);
        }

        line.element.setAttribute('stroke-width', '4');
        const pulseIntensity = 5 + Math.sin(Date.now() * 0.003) * 3;
        line.element.style.filter = `url(#${VisualConstants.FILTER_IDS.holographic}) drop-shadow(0 0 ${pulseIntensity}px rgba(56, 189, 248, 0.8))`;
    }

    /**
     * Update energy waves traveling along connection line
     * @private
     */
    _updateEnergyWaves(line, deltaTime, progress) {
        const path = line.element;
        const pathLength = path.getTotalLength ? path.getTotalLength() : 1000;

        line.energyWaves.forEach((wave, i) => {
            const waveSpeed = 0.0002 * (i + 1) * deltaTime;
            const startOffset = i * 0.3;
            const wavePosition = ((Date.now() * waveSpeed) % 1 + startOffset) % 1;

            if (wavePosition > progress) {
                wave.setAttribute('opacity', '0');
                return;
            }

            const point = path.getPointAtLength(wavePosition * pathLength);

            wave.setAttribute('cx', point.x);
            wave.setAttribute('cy', point.y);

            const scaleFactor = 1 + Math.sin(wavePosition * Math.PI) * 0.5;
            wave.setAttribute('r', (3 * scaleFactor).toString());

            const opacityFactor = 0.8 - wavePosition * 0.5;
            wave.setAttribute('opacity', opacityFactor.toString());

            const blurAmount = 2 + wavePosition * 3;
            wave.style.filter = `blur(${blurAmount}px) brightness(1.5)`;
        });
    }

    /**
     * Clear all lines
     */
    clear() {
        this.lines.forEach(line => {
            line.element.remove();
            line.energyWaves.forEach(wave => wave.remove());
        });
        this.lines = [];
    }
}

/**
 * Main Visual Effects Manager
 */
export class VisualEffectsManager {
    constructor() {
        this.particles = new ParticleSystem();
        this.ripples = new RippleSystem();
        this.connections = new ConnectionLineSystem();
    }

    /**
     * Initialize all visual effects systems
     */
    initialize() {
        this.particles.initialize();
        this.ripples.initialize();
        this.connections.initialize();
    }

    /**
     * Update all visual effects
     * @param {number} deltaTime - Time since last frame
     * @param {Map} blockMap - Map of block ID to block data
     * @param {Set} activePortals - Set of active portal IDs
     */
    update(deltaTime, blockMap, activePortals) {
        this.particles.update(deltaTime);
        this.ripples.update(deltaTime, blockMap);
        this.connections.update(deltaTime, blockMap, activePortals);
    }

    /**
     * Clear all visual effects
     */
    clear() {
        this.particles.clear();
        this.ripples.clear();
        this.connections.clear();
    }
}

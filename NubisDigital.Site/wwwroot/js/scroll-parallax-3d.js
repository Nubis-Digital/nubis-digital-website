/**
 * 3D Scroll Parallax System for Nubis Digital
 * Content emerges from neural network nodes with enhanced visual effects
 */

(function() {
    'use strict';
    
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let isScrolling = false;
    let scrollTimeout;
    let particles = [];
    let lastFrameTime = 0;
    let activePortals = new Set();
    
    // Parallax configuration
    const config = {
        smoothness: 0.04,  // Reduced for smoother interpolation
        cameraZoomRange: [30, 15],
        rotationIntensity: 0.2,  // Reduced for gentler rotation
        nodeSpeedMultiplier: 1.2,  // Reduced for smoother node animation
        perspectiveBase: 1200,
        particleCount: 15,
        particleLifespan: 2000, // Increased for longer particle life
        particleSize: [3, 8],
        particleSpeed: [0.5, 2],  // Reduced for slower particles
        maxActivePortals: 2,
        emergenceSmoothing: 0.03,  // New: specific smoothing for emergence
        transitionDuration: 1.5  // New: base transition duration in seconds
    };
    
    // Track content blocks and their node connections
    let contentBlocks = [];
    let blockNodeMapping = new Map();
    let connectionLines = [];
    let nodeRipples = [];
    let energyWaves = [];
    
    /**
     * Initialize scroll parallax system
     */
    function initScrollParallax() {
        // Wait for 3D scene to be initialized
        if (typeof window.camera === 'undefined' || typeof window.neuralNetwork === 'undefined' || !window.nodes) {
            setTimeout(initScrollParallax, 100);
            return;
        }
        
        console.log('Initializing enhanced 3D scroll parallax with visual effects...');
        
        // Identify content blocks (excluding first section)
        identifyContentBlocks();
        
        // Map each block to a specific node
        mapBlocksToNodes();
        
        // Create visual connection lines
        createConnectionLines();
        
        // Create particle container
        createParticleContainer();
        
        // Create node ripples
        createNodeRipples();
        
        // Set up initial state
        initializeBlockStates();
        
        // Set up scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Start animation loop
        lastFrameTime = Date.now();
        animateParallax();
        
        console.log('Enhanced 3D scroll parallax system initialized');
    }
    
    /**
     * Identify all content blocks with custom IDs (excluding first section)
     */
    function identifyContentBlocks() {
        const sections = document.querySelectorAll('section[id]');
        
        contentBlocks = [];
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
                    id: id,
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
                contentBlocks.push(block);
                
                // Wrap section content for animation
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
                
                // Set section styles
                section.style.position = 'relative';
                section.style.overflow = 'visible';
                section.style.transformStyle = 'preserve-3d';
                section.style.perspective = `${config.perspectiveBase}px`;
                section.setAttribute('data-parallax-block', 'true');
                section.setAttribute('data-block-index', block.index);
                section.setAttribute('data-emergence-state', 'hidden');
            }
        });
        
        console.log(`Found ${contentBlocks.length} content blocks for parallax`);
    }
    
    /**
     * Map each block to a specific neural network node
     */
    function mapBlocksToNodes() {
        if (!window.nodes || contentBlocks.length === 0) return;
        
        blockNodeMapping.clear();
        
        // Select nodes that are visible and well-positioned
        const visibleNodes = window.nodes.filter((node, index) => {
            // Select nodes in the front half of the network
            return node.z > -5 && index % 3 === 0;
        });
        
        contentBlocks.forEach((block, blockIndex) => {
            // Select a node for this block
            const nodeIndex = Math.min(
                blockIndex * Math.floor(visibleNodes.length / contentBlocks.length),
                visibleNodes.length - 1
            );
            
            const node = visibleNodes[nodeIndex];
            if (node) {
                // Get the actual index in the full nodes array
                const actualNodeIndex = window.nodes.indexOf(node);
                block.nodeIndex = actualNodeIndex;
                
                // Calculate 3D to 2D projection for the node position
                const vector = new THREE.Vector3(node.x, node.y, node.z);
                vector.project(window.camera);
                
                // Convert to screen coordinates
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
                
                block.nodePosition = {
                    screenX: x,
                    screenY: y,
                    worldX: node.x,
                    worldY: node.y,
                    worldZ: node.z
                };
                
                // Mark node as a portal
                node.isPortal = true;
                node.connectedBlockId = block.id;
                node.portalStrength = 0;
                node.originalSize = 1.0;
                
                blockNodeMapping.set(block.id, {
                    nodeIndex: actualNodeIndex,
                    node: node,
                    position: block.nodePosition,
                    nearbyNodes: []
                });
                
                // Find nearby nodes to create a cluster
                const nearbyNodes = findNearbyNodes(node, 5, 3);
                blockNodeMapping.get(block.id).nearbyNodes = nearbyNodes;
                
                console.log(`Block "${block.id}" mapped to node ${actualNodeIndex} with ${nearbyNodes.length} nearby nodes`);
            }
        });
    }
    
    /**
     * Find nearby nodes for clustering effect
     */
    function findNearbyNodes(sourceNode, maxCount, maxDistance) {
        if (!window.nodes) return [];
        
        // Calculate distances from source node
        const nodesWithDistance = window.nodes
            .map((node, index) => {
                if (node === sourceNode) return null;
                
                // Calculate Euclidean distance
                const dx = node.x - sourceNode.x;
                const dy = node.y - sourceNode.y;
                const dz = node.z - sourceNode.z;
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                return {
                    node: node,
                    index: index,
                    distance: distance
                };
            })
            .filter(item => item !== null && item.distance <= maxDistance);
        
        // Sort by distance and take the closest nodes
        return nodesWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxCount);
    }
    
    /**
     * Create visual connection lines from nodes to sections
     */
    function createConnectionLines() {
        // Remove existing connection lines
        connectionLines.forEach(line => line.remove());
        connectionLines = [];
        
        // Create SVG container for connection lines
        let svg = document.getElementById('parallax-connections');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = 'parallax-connections';
            svg.style.position = 'fixed';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.pointerEvents = 'none';
            svg.style.zIndex = '5';
            document.body.appendChild(svg);
            
            // Add defs for filters
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            
            // Create holographic filter
            const holoFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            holoFilter.id = 'holographic-filter';
            holoFilter.setAttribute('x', '-50%');
            holoFilter.setAttribute('y', '-50%');
            holoFilter.setAttribute('width', '200%');
            holoFilter.setAttribute('height', '200%');
            
            // Turbulence for noise
            const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
            turbulence.setAttribute('type', 'fractalNoise');
            turbulence.setAttribute('baseFrequency', '0.03 0.03');
            turbulence.setAttribute('numOctaves', '2');
            turbulence.setAttribute('seed', '1');
            turbulence.setAttribute('stitchTiles', 'stitch');
            turbulence.id = 'turbulence';
            
            // Displacement map for wave effect
            const displacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
            displacementMap.setAttribute('in', 'SourceGraphic');
            displacementMap.setAttribute('in2', 'turbulence');
            displacementMap.setAttribute('scale', '5');
            displacementMap.setAttribute('xChannelSelector', 'R');
            displacementMap.setAttribute('yChannelSelector', 'G');
            
            // Specular lighting for shine effect
            const specularLighting = document.createElementNS('http://www.w3.org/2000/svg', 'feSpecularLighting');
            specularLighting.setAttribute('in', 'turbulence');
            specularLighting.setAttribute('specularConstant', '1.2');
            specularLighting.setAttribute('specularExponent', '20');
            specularLighting.setAttribute('surfaceScale', '5');
            specularLighting.setAttribute('lighting-color', '#ccf');
            
            const distantLight = document.createElementNS('http://www.w3.org/2000/svg', 'feDistantLight');
            distantLight.setAttribute('azimuth', '45');
            distantLight.setAttribute('elevation', '60');
            specularLighting.appendChild(distantLight);
            
            // Composite the effects
            const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
            composite.setAttribute('in', 'specularLighting');
            composite.setAttribute('in2', 'SourceGraphic');
            composite.setAttribute('operator', 'arithmetic');
            composite.setAttribute('k1', '0');
            composite.setAttribute('k2', '1');
            composite.setAttribute('k3', '1');
            composite.setAttribute('k4', '0');
            
            // Add blur for glow
            const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            blur.setAttribute('stdDeviation', '2');
            blur.setAttribute('edgeMode', 'none');
            
            // Add animation to turbulence
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'seed');
            animate.setAttribute('from', '1');
            animate.setAttribute('to', '10');
            animate.setAttribute('dur', '8s');
            animate.setAttribute('repeatCount', 'indefinite');
            turbulence.appendChild(animate);
            
            // Assemble filter
            holoFilter.appendChild(turbulence);
            holoFilter.appendChild(displacementMap);
            holoFilter.appendChild(specularLighting);
            holoFilter.appendChild(composite);
            holoFilter.appendChild(blur);
            defs.appendChild(holoFilter);
            svg.appendChild(defs);
        }
        
        // Create connection line for each block
        contentBlocks.forEach(block => {
            if (!block.nodePosition) return;
            
            // Main path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', 'url(#gradient-' + block.index + ')');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('opacity', '0');
            path.style.filter = 'url(#holographic-filter)';
            path.classList.add('connection-line');
            
            // Create gradient for the path
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.id = 'gradient-' + block.index;
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');
            
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', '#38bdf8');
            stop1.setAttribute('stop-opacity', '0.9');
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', '#818cf8');
            stop2.setAttribute('stop-opacity', '0.4');
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            
            // Add gradient and path to SVG
            svg.appendChild(gradient);
            svg.appendChild(path);
            
            block.connectionLine = path;
            connectionLines.push(path);
            
            // Create energy waves along the path
            block.energyWaves = [];
            for (let i = 0; i < 3; i++) {
                const energyWave = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                energyWave.setAttribute('r', '3');
                energyWave.setAttribute('fill', '#38bdf8');
                energyWave.setAttribute('opacity', '0');
                energyWave.style.filter = 'blur(2px) brightness(1.5)';
                svg.appendChild(energyWave);
                block.energyWaves.push(energyWave);
                energyWaves.push(energyWave);
            }
        });
    }
    
    /**
     * Create particle container for emergence effects
     */
    function createParticleContainer() {
        // Remove existing container
        let container = document.getElementById('parallax-particles');
        if (container) {
            container.remove();
        }
        
        // Create new container
        container = document.createElement('div');
        container.id = 'parallax-particles';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '6';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        
        // Initialize particle pool
        particles = [];
    }
    
    /**
     * Create node ripple effects
     */
    function createNodeRipples() {
        // Remove existing ripples
        nodeRipples.forEach(ripple => ripple.remove());
        nodeRipples = [];
        
        // Create SVG container for ripples
        let svg = document.getElementById('parallax-ripples');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = 'parallax-ripples';
            svg.style.position = 'fixed';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.pointerEvents = 'none';
            svg.style.zIndex = '4'; // Below connections
            document.body.appendChild(svg);
        }
        
        // Create ripple for each block's node
        contentBlocks.forEach(block => {
            if (!block.nodePosition) return;
            
            // Create three ripple circles per node
            for (let i = 0; i < 3; i++) {
                const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                ripple.setAttribute('cx', block.nodePosition.screenX);
                ripple.setAttribute('cy', block.nodePosition.screenY);
                ripple.setAttribute('r', '10');
                ripple.setAttribute('fill', 'none');
                ripple.setAttribute('stroke', i === 0 ? '#38bdf8' : (i === 1 ? '#818cf8' : '#6366f1'));
                ripple.setAttribute('stroke-width', (3 - i) + 'px');
                ripple.setAttribute('opacity', '0');
                
                svg.appendChild(ripple);
                nodeRipples.push({
                    element: ripple,
                    blockId: block.id,
                    index: i,
                    scale: 1,
                    opacity: 0,
                    active: false
                });
            }
        });
    }
    
    /**
     * Initialize block states
     */
    function initializeBlockStates() {
        contentBlocks.forEach(block => {
            const wrapper = block.element.querySelector('.parallax-content-wrapper');
            if (wrapper && block.nodePosition) {
                // Start with content hidden and positioned at node
                wrapper.style.opacity = '0';
                wrapper.style.transform = `scale(0.1)`;
                block.element.style.minHeight = '0';
                block.element.style.opacity = '1';
            }
        });
    }
    
    /**
     * Handle scroll events
     */
    function onScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }
    
    /**
     * Main animation loop
     */
    function animateParallax() {
        requestAnimationFrame(animateParallax);
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        
        // Ultra-smooth scroll interpolation with easing
        const scrollDiff = targetScrollProgress - scrollProgress;
        const scrollStep = scrollDiff * config.smoothness;
        scrollProgress += scrollStep;
        
        // Update camera
        updateCamera();
        
        // Update neural network
        updateNeuralNetwork(deltaTime);
        
        // Update content emergence
        updateContentEmergence(deltaTime);
        
        // Update connection lines
        updateConnectionLines(deltaTime);
        
        // Update node portals and cluster effects
        updateNodePortals(deltaTime);
        
        // Update particles
        updateParticles(deltaTime);
        
        // Update ripple effects
        updateRipples(deltaTime);
        
        // Update energy waves
        updateEnergyWaves(deltaTime);
        
        // Update active portals set
        updateActivePortals();
    }
    
    /**
     * Update active portals tracking
     */
    function updateActivePortals() {
        // Clear current set
        activePortals.clear();
        
        // Find blocks with active portals (sorted by emergence progress)
        const activeBlocks = contentBlocks
            .filter(block => block.emergenceProgress > 0 && block.emergenceProgress < 0.5)
            .sort((a, b) => b.emergenceProgress - a.emergenceProgress);
        
        // Take the top most active portals
        activeBlocks.slice(0, config.maxActivePortals).forEach(block => {
            activePortals.add(block.id);
        });
    }
    
    /**
     * Update camera position based on scroll
     */
    function updateCamera() {
        if (!window.camera) return;
        
        const [startZ, endZ] = config.cameraZoomRange;
        const easedScrollProgress = smoothStep(scrollProgress);
        const targetZ = startZ + (endZ - startZ) * easedScrollProgress;
        
        // Ultra-smooth camera zoom
        window.camera.position.z += (targetZ - window.camera.position.z) * (config.smoothness * 0.8);
        
        // Enhanced camera movement - focus on active portal with smooth transitions
        if (activePortals.size > 0 && contentBlocks.length > 0) {
            // Find the first active block
            const activeBlock = contentBlocks.find(block => activePortals.has(block.id));
            if (activeBlock && activeBlock.nodePosition) {
                // Very subtle camera adjustment toward the active node
                const influence = 0.005; // Reduced influence for smoother movement
                const targetRotationX = easedScrollProgress * 0.05 - 0.025 + (activeBlock.nodePosition.worldY * influence);
                const targetRotationY = Math.sin(easedScrollProgress * Math.PI) * 0.04 + (activeBlock.nodePosition.worldX * influence);
                
                if (window.camera.rotation) {
                    window.camera.rotation.x += (targetRotationX - window.camera.rotation.x) * (config.smoothness * 0.3);
                    window.camera.rotation.y += (targetRotationY - window.camera.rotation.y) * (config.smoothness * 0.3);
                }
            } else {
                // Standard rotation if no active block
                const targetRotationX = easedScrollProgress * 0.05 - 0.025;
                const targetRotationY = Math.sin(easedScrollProgress * Math.PI) * 0.04;
                
                if (window.camera.rotation) {
                    window.camera.rotation.x += (targetRotationX - window.camera.rotation.x) * (config.smoothness * 0.5);
                    window.camera.rotation.y += (targetRotationY - window.camera.rotation.y) * (config.smoothness * 0.5);
                }
            }
        } else {
            // Standard rotation if no active portals
            const targetRotationX = easedScrollProgress * 0.05 - 0.025;
            const targetRotationY = Math.sin(easedScrollProgress * Math.PI) * 0.04;
            
            if (window.camera.rotation) {
                window.camera.rotation.x += (targetRotationX - window.camera.rotation.x) * (config.smoothness * 0.5);
                window.camera.rotation.y += (targetRotationY - window.camera.rotation.y) * (config.smoothness * 0.5);
            }
        }
    }
    
    /**
     * Update neural network animation
     */
    function updateNeuralNetwork(deltaTime) {
        if (!window.neuralNetwork || !window.nodes) return;
        
        const speedMultiplier = isScrolling ? config.nodeSpeedMultiplier : 1.0;
        const scrollRotation = scrollProgress * Math.PI * 0.3;
        
        if (window.neuralNetwork.rotation) {
            const targetRotationY = scrollRotation + Math.sin(Date.now() * 0.0001) * 0.15;
            const targetRotationX = scrollProgress * 0.2 + Math.cos(Date.now() * 0.00015) * 0.1;
            
            window.neuralNetwork.rotation.y += (targetRotationY - window.neuralNetwork.rotation.y) * 0.02;
            window.neuralNetwork.rotation.x += (targetRotationX - window.neuralNetwork.rotation.x) * 0.02;
            
            if (window.connectionLines) {
                window.connectionLines.rotation.y = window.neuralNetwork.rotation.y;
                window.connectionLines.rotation.x = window.neuralNetwork.rotation.x;
            }
        }
        
        // Create depth-of-field effect - blur background nodes
        if (window.neuralNetwork.geometry && window.neuralNetwork.geometry.attributes.size) {
            const sizes = window.neuralNetwork.geometry.attributes.size.array;
            
            window.nodes.forEach((node, i) => {
                // Skip portal nodes
                if (node.isPortal) return;
                
                // Calculate depth factor (closer to camera = larger)
                const depthFactor = (node.z + 15) / 30; // Normalize z to 0-1 range
                const size = Math.max(1, 2 * depthFactor);
                
                sizes[i] = size;
            });
            
            window.neuralNetwork.geometry.attributes.size.needsUpdate = true;
        }
    }
    
    /**
     * Update content emergence from nodes
     */
    function updateContentEmergence(deltaTime) {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        contentBlocks.forEach(block => {
            const wrapper = block.element.querySelector('.parallax-content-wrapper');
            if (!wrapper || !block.nodePosition) return;
            
            // Store previous progress for change detection
            block.lastEmergenceProgress = block.emergenceProgress;
            
            // Calculate when this section should emerge
            const triggerPoint = block.originalTop - viewportHeight * 0.8;
            const endPoint = block.originalTop - viewportHeight * 0.3;
            
            let progress = 0;
            if (scrollY >= triggerPoint && scrollY <= endPoint) {
                progress = (scrollY - triggerPoint) / (endPoint - triggerPoint);
            } else if (scrollY > endPoint) {
                progress = 1;
            }
            
            // Detect significant progress change (for triggering effects)
            const progressChange = progress - block.emergenceProgress;
            const significantChange = Math.abs(progressChange) > 0.05;
            
            block.emergenceProgress = progress;
            
            // Update node position in screen space
            if (window.nodes && window.nodes[block.nodeIndex]) {
                const node = window.nodes[block.nodeIndex];
                const vector = new THREE.Vector3(node.x, node.y, node.z);
                vector.project(window.camera);
                
                block.nodePosition.screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
                block.nodePosition.screenY = (-vector.y * 0.5 + 0.5) * window.innerHeight;
            }
            
            // Update emergence state attribute
            if (progress === 0) {
                block.element.setAttribute('data-emergence-state', 'hidden');
            } else if (progress < 0.3) {
                block.element.setAttribute('data-emergence-state', 'emerging');
            } else if (progress < 0.7) {
                block.element.setAttribute('data-emergence-state', 'expanding');
            } else {
                block.element.setAttribute('data-emergence-state', 'visible');
            }
            
            // Create particle burst when content starts emerging
            if (progress > 0 && block.lastEmergenceProgress === 0) {
                createParticleBurst(block.nodePosition.screenX, block.nodePosition.screenY, 20);
            }
            
            if (progress === 0) {
                // Hidden state - content at node
                wrapper.style.opacity = '0';
                wrapper.style.transform = `scale(0.1)`;
                block.element.style.minHeight = '0';
                block.isEmerged = false;
            } else if (progress < 1) {
                // Emerging - content traveling from node to position
                // Use smoother easing for different aspects
                const positionEase = smootherStep(progress);
                const scaleEase = easeInOutQuart(progress);
                const rotationEase = easeOutQuart(progress);
                const opacityEase = smoothStep(progress);
                
                // Calculate position interpolation with smoother movement
                const rect = block.element.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                
                // Add smooth interpolation for current position
                const currentX = block.nodePosition.screenX + (targetX - block.nodePosition.screenX) * positionEase;
                const currentY = block.nodePosition.screenY + (targetY - block.nodePosition.screenY) * positionEase;
                
                const translateX = currentX - targetX;
                const translateY = currentY - targetY;
                
                // Smoother scale transition
                const scale = 0.05 + (0.95 * scaleEase);
                
                // Gentler 3D rotation effect during emergence
                const rotationIntensity = (1 - rotationEase);
                const rotateX = rotationIntensity * Math.sin(Date.now() * 0.0005 + block.index) * 8;
                const rotateY = rotationIntensity * Math.cos(Date.now() * 0.0007 + block.index) * 8;
                const rotateZ = rotationIntensity * Math.sin(Date.now() * 0.0003 + block.index * 0.5) * 3;
                
                // Apply transformation with 3D rotation and smooth opacity
                wrapper.style.opacity = Math.min(1, opacityEase * 1.2);
                wrapper.style.transform = `
                    translate3d(${translateX}px, ${translateY}px, ${(1 - positionEase) * 100}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    rotateZ(${rotateZ}deg)
                    scale3d(${scale}, ${scale}, ${scale})
                `;
                wrapper.style.transition = 'opacity 0.3s ease-out, filter 0.4s ease-out';
                
                // Add chromatic aberration effect during emergence with smooth fade
                if (progress < 0.8) {
                    const filterProgress = smoothStep(progress / 0.8);
                    const aberrationAmount = (1 - filterProgress) * 3; // Reduced intensity
                    const blurAmount = (1 - filterProgress) * 2; // Reduced blur
                    
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
                
                // Gradually restore section height with smooth transition
                const heightProgress = smootherStep(progress);
                block.element.style.minHeight = `${block.height * heightProgress}px`;
                block.element.style.transition = 'min-height 0.5s ease-out';
                block.isEmerged = false;
                
                // Emit particles during travel
                if (significantChange && progress > 0.05 && progress < 0.95) {
                    createParticle(
                        currentX, 
                        currentY, 
                        1 + Math.random() * 3,
                        `hsl(${200 + Math.random() * 40}, 80%, 60%)`
                    );
                }
            } else {
                // Fully emerged
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
                wrapper.style.filter = 'none';
                block.element.style.minHeight = '';
                block.isEmerged = true;
            }
        });
    }
    
    /**
     * Update connection lines between nodes and sections
     */
    function updateConnectionLines(deltaTime) {
        contentBlocks.forEach(block => {
            if (!block.connectionLine || !block.nodePosition) return;
            
            const progress = block.emergenceProgress;
            
            if (progress > 0 && progress < 1) {
                // Calculate path from node to section
                const rect = block.element.getBoundingClientRect();
                const sectionX = rect.left + rect.width / 2;
                const sectionY = rect.top + rect.height / 2;
                
                // Create curved path
                const startX = block.nodePosition.screenX;
                const startY = block.nodePosition.screenY;
                const endX = sectionX;
                const endY = sectionY;
                
                // Control points for bezier curve
                const cp1X = startX + (endX - startX) * 0.3;
                const cp1Y = startY - 50;
                const cp2X = startX + (endX - startX) * 0.7;
                const cp2Y = endY - 100;
                
                // Animate path drawing
                const drawLength = progress;
                const pathData = `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
                
                block.connectionLine.setAttribute('d', pathData);
                block.connectionLine.setAttribute('opacity', Math.min(0.8, progress * 2));
                block.connectionLine.style.strokeDasharray = '1000';
                block.connectionLine.style.strokeDashoffset = 1000 * (1 - drawLength);
                
                // Enhance the holographic effect during high activity
                if (activePortals.has(block.id)) {
                    // Make the filter more pronounced
                    const turbulence = document.getElementById('turbulence');
                    if (turbulence) {
                        const frequency = 0.03 + Math.sin(Date.now() * 0.001) * 0.01;
                        turbulence.setAttribute('baseFrequency', `${frequency} ${frequency}`);
                    }
                    
                    // Increase stroke width for active connection
                    block.connectionLine.setAttribute('stroke-width', '4');
                    
                    // Add a pulsing glow effect
                    const pulseIntensity = 5 + Math.sin(Date.now() * 0.003) * 3;
                    block.connectionLine.style.filter = `url(#holographic-filter) drop-shadow(0 0 ${pulseIntensity}px rgba(56, 189, 248, 0.8))`;
                } else {
                    // Regular connection
                    block.connectionLine.setAttribute('stroke-width', '3');
                    block.connectionLine.style.filter = 'url(#holographic-filter)';
                }
            } else {
                block.connectionLine.setAttribute('opacity', '0');
            }
        });
    }
    
    /**
     * Update node portals and clustering effects
     */
    function updateNodePortals(deltaTime) {
        if (!window.neuralNetwork || !window.nodes) return;
        
        contentBlocks.forEach(block => {
            const mapping = blockNodeMapping.get(block.id);
            if (!mapping) return;
            
            const node = mapping.node;
            const nodeIndex = mapping.nodeIndex;
            
            // Calculate portal strength based on emergence
            let portalStrength = 0;
            if (block.emergenceProgress > 0 && block.emergenceProgress < 0.5) {
                portalStrength = 1 - (Math.abs(block.emergenceProgress - 0.25) * 4);
            }
            
            node.portalStrength = portalStrength;
            
            // Dynamic node size pulsation
            if (window.neuralNetwork.geometry && window.neuralNetwork.geometry.attributes.size) {
                const sizes = window.neuralNetwork.geometry.attributes.size.array;
                
                // Pulse the size of the node based on portal strength
                if (portalStrength > 0.1) {
                    const pulseSize = 1 + portalStrength * 3 * (0.8 + Math.sin(Date.now() * 0.005) * 0.2);
                    sizes[nodeIndex] = pulseSize;
                    
                    // Also slightly pulse nearby nodes in the cluster
                    mapping.nearbyNodes.forEach(nearbyNode => {
                        const distance = nearbyNode.distance;
                        const maxDistance = 3;
                        const distanceFactor = 1 - (distance / maxDistance);
                        const clusterPulse = 1 + (portalStrength * distanceFactor * 0.5 * (0.8 + Math.sin(Date.now() * 0.006 + nearbyNode.index) * 0.2));
                        
                        sizes[nearbyNode.index] = clusterPulse;
                    });
                    
                    window.neuralNetwork.geometry.attributes.size.needsUpdate = true;
                }
            }
            
            // Create smooth portal vortex effect
            if (portalStrength > 0.05) {
                // Gentle pulsing motion
                const pulseForce = Math.sin(Date.now() * 0.002) * portalStrength * 0.015;
                node.vx += pulseForce * (Math.random() - 0.5) * 0.8;
                node.vy += pulseForce * (Math.random() - 0.5) * 0.8;
                node.vz += pulseForce * (Math.random() - 0.5) * 0.4;
                
                // Subtle swirling motion around portal
                const angle = Date.now() * 0.001;
                const swirl = portalStrength * 0.008;
                node.vx += Math.cos(angle) * swirl;
                node.vy += Math.sin(angle) * swirl;
                
                // Affect nearby nodes in the cluster
                mapping.nearbyNodes.forEach(nearbyNode => {
                    const nearNode = nearbyNode.node;
                    const distance = nearbyNode.distance;
                    const maxDistance = 3;
                    const distanceFactor = 1 - (distance / maxDistance);
                    
                    // Attraction toward portal node
                    const dx = node.x - nearNode.x;
                    const dy = node.y - nearNode.y;
                    const dz = node.z - nearNode.z;
                    
                    nearNode.vx += dx * 0.0005 * portalStrength * distanceFactor;
                    nearNode.vy += dy * 0.0005 * portalStrength * distanceFactor;
                    nearNode.vz += dz * 0.0005 * portalStrength * distanceFactor;
                    
                    // Swirl around portal
                    const nearAngle = Math.atan2(nearNode.y - node.y, nearNode.x - node.x);
                    const tangentX = Math.cos(nearAngle + Math.PI/2);
                    const tangentY = Math.sin(nearAngle + Math.PI/2);
                    
                    nearNode.vx += tangentX * 0.005 * portalStrength * distanceFactor;
                    nearNode.vy += tangentY * 0.005 * portalStrength * distanceFactor;
                });
                
                // Create ripple effect at portal node
                if (Math.random() < portalStrength * 0.2) {
                    startRippleEffect(block.id);
                }
            }
            
            // Update node appearance
            if (window.neuralNetwork.geometry && window.neuralNetwork.geometry.attributes.color) {
                const colors = window.neuralNetwork.geometry.attributes.color.array;
                const i = nodeIndex;
                
                // Make portal nodes glow brightly when active
                const glowIntensity = 1 + (portalStrength * 4);
                const baseR = 0.22; // Base color values
                const baseG = 0.74;
                const baseB = 0.97;
                
                // Add slight color variation with time
                const timeOffset = Date.now() * 0.001 + nodeIndex * 0.5;
                const colorPulse = 0.15 * Math.sin(timeOffset);
                
                colors[i * 3] = Math.min(1.0, baseR * glowIntensity + colorPulse);
                colors[i * 3 + 1] = Math.min(1.0, baseG * glowIntensity);
                colors[i * 3 + 2] = Math.min(1.0, baseB * glowIntensity - colorPulse);
                
                // Also affect nearby nodes in cluster
                mapping.nearbyNodes.forEach(nearbyNode => {
                    const ni = nearbyNode.index;
                    const distance = nearbyNode.distance;
                    const maxDistance = 3;
                    const distanceFactor = 1 - (distance / maxDistance);
                    
                    // Propagate glow to nearby nodes
                    const nearbyGlow = 1 + (portalStrength * distanceFactor * 2);
                    const nearbyOffset = Date.now() * 0.001 + ni * 0.2;
                    const nearbyPulse = 0.1 * Math.sin(nearbyOffset);
                    
                    colors[ni * 3] = Math.min(1.0, baseR * nearbyGlow + nearbyPulse);
                    colors[ni * 3 + 1] = Math.min(1.0, baseG * nearbyGlow);
                    colors[ni * 3 + 2] = Math.min(1.0, baseB * nearbyGlow - nearbyPulse);
                });
                
                window.neuralNetwork.geometry.attributes.color.needsUpdate = true;
            }
        });
    }
    
    /**
     * Update particle animations
     */
    function updateParticles(deltaTime) {
        const container = document.getElementById('parallax-particles');
        if (!container) return;
        
        // Update existing particles
        particles.forEach((particle, index) => {
            // Update lifetime
            particle.lifetime -= deltaTime;
            
            // Remove if expired
            if (particle.lifetime <= 0) {
                particle.element.remove();
                particles.splice(index, 1);
                return;
            }
            
            // Calculate lifecycle progress
            const progress = particle.lifetime / particle.maxLifetime;
            const opacity = progress < 0.3 ? (progress / 0.3) : progress;
            
            // Update position
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            
            // Apply gravity if specified
            if (particle.gravity) {
                particle.vy += 0.05 * (deltaTime / 16);
            }
            
            // Update element style
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`;
            particle.element.style.opacity = opacity.toString();
        });
    }
    
    /**
     * Create a new particle
     */
    function createParticle(x, y, size, color, vx, vy, lifetime, gravity) {
        const container = document.getElementById('parallax-particles');
        if (!container) return;
        
        // Default values
        vx = vx || (Math.random() * 2 - 1) * config.particleSpeed[1];
        vy = vy || (Math.random() * 2 - 1) * config.particleSpeed[1];
        lifetime = lifetime || (500 + Math.random() * 1000);
        gravity = gravity || false;
        
        // Create particle element
        const element = document.createElement('div');
        element.className = 'parallax-particle';
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.borderRadius = '50%';
        element.style.backgroundColor = color || '#38bdf8';
        element.style.transform = `translate(${x}px, ${y}px)`;
        element.style.pointerEvents = 'none';
        element.style.zIndex = '10';
        element.style.filter = 'blur(1px)';
        element.style.boxShadow = `0 0 ${size * 2}px ${color || 'rgba(56, 189, 248, 0.8)'}`;
        
        container.appendChild(element);
        
        // Add to particles array
        particles.push({
            element: element,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            scale: 1,
            lifetime: lifetime,
            maxLifetime: lifetime,
            gravity: gravity
        });
    }
    
    /**
     * Create a burst of particles
     */
    function createParticleBurst(x, y, count, color) {
        count = count || 10;
        
        for (let i = 0; i < count; i++) {
            // Calculate random velocity in all directions
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            // Randomize size and color
            const size = 2 + Math.random() * 4;
            const hue = color ? '' : (200 + Math.random() * 40); // Blue to purple range
            const particleColor = color || `hsla(${hue}, 80%, 60%, 0.8)`;
            
            // Create the particle
            createParticle(x, y, size, particleColor, vx, vy, 500 + Math.random() * 1000);
        }
    }
    
    /**
     * Start ripple effect on a node
     */
    function startRippleEffect(blockId) {
        // Find ripples for this block
        const blockRipples = nodeRipples.filter(ripple => ripple.blockId === blockId);
        
        // Skip if already active
        if (blockRipples.some(ripple => ripple.active)) return;
        
        // Find the corresponding block
        const block = contentBlocks.find(b => b.id === blockId);
        if (!block || !block.nodePosition) return;
        
        // Update ripple positions
        blockRipples.forEach(ripple => {
            ripple.element.setAttribute('cx', block.nodePosition.screenX);
            ripple.element.setAttribute('cy', block.nodePosition.screenY);
        });
        
        // Trigger ripple animation for each circle with delay
        blockRipples.forEach((ripple, index) => {
            ripple.active = true;
            ripple.scale = 0.2;
            ripple.opacity = 0.8;
            
            // Staggered start
            setTimeout(() => {
                ripple.element.setAttribute('opacity', ripple.opacity);
            }, index * 150);
        });
    }
    
    /**
     * Update ripple effects
     */
    function updateRipples(deltaTime) {
        nodeRipples.forEach(ripple => {
            if (!ripple.active) return;
            
            // Find the block
            const block = contentBlocks.find(b => b.id === ripple.blockId);
            if (!block || !block.nodePosition) return;
            
            // Update position to follow node
            ripple.element.setAttribute('cx', block.nodePosition.screenX);
            ripple.element.setAttribute('cy', block.nodePosition.screenY);
            
            // Expand ripple
            ripple.scale += 0.05 * (deltaTime / 16);
            ripple.opacity -= 0.03 * (deltaTime / 16);
            
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
     * Update energy waves traveling along connection lines
     */
    function updateEnergyWaves(deltaTime) {
        contentBlocks.forEach(block => {
            if (!block.connectionLine || block.energyWaves.length === 0) return;
            
            const progress = block.emergenceProgress;
            
            // Skip if not visible or no connection line
            if (progress <= 0 || progress >= 1) {
                block.energyWaves.forEach(wave => {
                    wave.setAttribute('opacity', '0');
                });
                return;
            }
            
            // Get path data
            const path = block.connectionLine;
            const pathLength = path.getTotalLength ? path.getTotalLength() : 1000;
            
            // Animate waves along the path with different speeds
            block.energyWaves.forEach((wave, i) => {
                // Different starting position for each wave
                const waveSpeed = 0.0002 * (i + 1) * deltaTime;
                const startOffset = i * 0.3;
                const wavePosition = ((Date.now() * waveSpeed) % 1 + startOffset) % 1;
                
                // Only show when line is being drawn
                if (wavePosition > progress) {
                    wave.setAttribute('opacity', '0');
                    return;
                }
                
                // Get position along the path
                const point = path.getPointAtLength(wavePosition * pathLength);
                
                // Update wave position
                wave.setAttribute('cx', point.x);
                wave.setAttribute('cy', point.y);
                
                // Scale and opacity based on position
                const scaleFactor = 1 + Math.sin(wavePosition * Math.PI) * 0.5;
                wave.setAttribute('r', (3 * scaleFactor).toString());
                
                // Make more visible when closest to node (start of path)
                const opacityFactor = 0.8 - wavePosition * 0.5;
                wave.setAttribute('opacity', opacityFactor.toString());
                
                // Add trail effect with increasing blur
                const blurAmount = 2 + wavePosition * 3;
                wave.style.filter = `blur(${blurAmount}px) brightness(1.5)`;
            });
        });
    }
    
    /**
     * Easing functions for smooth animation
     */
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    
    function smoothStep(t) {
        return t * t * (3 - 2 * t);
    }
    
    function smootherStep(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    /**
     * Add CSS styles for the effect
     */
    function addParallaxStyles() {
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
    
    // Add styles
    addParallaxStyles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate positions
        contentBlocks.forEach(block => {
            const rect = block.element.getBoundingClientRect();
            block.originalTop = rect.top + window.scrollY;
            block.height = rect.height;
        });
        
        // Remap nodes
        mapBlocksToNodes();
        
        // Recreate visual effects
        createConnectionLines();
        createNodeRipples();
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollParallax);
    } else {
        initScrollParallax();
    }
    
})();
/**
 * 3D Scroll Parallax System for Nubis Digital
 * Content emerges from neural network nodes and travels along connection lines
 */

(function() {
    'use strict';
    
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // Parallax configuration
    const config = {
        smoothness: 0.08,
        cameraZoomRange: [30, 15],
        rotationIntensity: 0.4,
        nodeSpeedMultiplier: 1.5,
        perspectiveBase: 1200
    };
    
    // Track content blocks and their node connections
    let contentBlocks = [];
    let blockNodeMapping = new Map();
    let connectionLines = [];
    
    /**
     * Initialize scroll parallax system
     */
    function initScrollParallax() {
        // Wait for 3D scene to be initialized
        if (typeof window.camera === 'undefined' || typeof window.neuralNetwork === 'undefined' || !window.nodes) {
            setTimeout(initScrollParallax, 100);
            return;
        }
        
        console.log('Initializing 3D scroll parallax with node-to-section connections...');
        
        // Identify content blocks (excluding first section)
        identifyContentBlocks();
        
        // Map each block to a specific node
        mapBlocksToNodes();
        
        // Create visual connection lines
        createConnectionLines();
        
        // Set up initial state
        initializeBlockStates();
        
        // Set up scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Start animation loop
        animateParallax();
        
        console.log('3D scroll parallax system initialized');
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
                    isEmerged: false,
                    connectionLine: null
                };
                contentBlocks.push(block);
                
                // Wrap section content for animation
                const wrapper = document.createElement('div');
                wrapper.className = 'parallax-content-wrapper';
                wrapper.style.transformStyle = 'preserve-3d';
                wrapper.style.willChange = 'transform, opacity';
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
                
                blockNodeMapping.set(block.id, {
                    nodeIndex: actualNodeIndex,
                    node: node,
                    position: block.nodePosition
                });
                
                console.log(`Block "${block.id}" mapped to node ${actualNodeIndex}`);
            }
        });
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
        }
        
        // Create connection line for each block
        contentBlocks.forEach(block => {
            if (!block.nodePosition) return;
            
            // Create path element
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', 'url(#gradient-' + block.index + ')');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('opacity', '0');
            path.style.filter = 'blur(1px)';
            
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
            stop1.setAttribute('stop-opacity', '0.8');
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', '#818cf8');
            stop2.setAttribute('stop-opacity', '0.3');
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            
            // Add gradient and path to SVG
            svg.appendChild(gradient);
            svg.appendChild(path);
            
            block.connectionLine = path;
            connectionLines.push(path);
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
        
        // Smooth scroll interpolation
        scrollProgress += (targetScrollProgress - scrollProgress) * config.smoothness;
        
        // Update camera
        updateCamera();
        
        // Update neural network
        updateNeuralNetwork();
        
        // Update content emergence
        updateContentEmergence();
        
        // Update connection lines
        updateConnectionLines();
        
        // Update node portals
        updateNodePortals();
    }
    
    /**
     * Update camera position based on scroll
     */
    function updateCamera() {
        if (!window.camera) return;
        
        const [startZ, endZ] = config.cameraZoomRange;
        const targetZ = startZ + (endZ - startZ) * scrollProgress;
        
        window.camera.position.z += (targetZ - window.camera.position.z) * config.smoothness;
        
        const targetRotationX = scrollProgress * 0.1 - 0.05;
        const targetRotationY = Math.sin(scrollProgress * Math.PI) * 0.08;
        
        if (window.camera.rotation) {
            window.camera.rotation.x += (targetRotationX - window.camera.rotation.x) * config.smoothness;
            window.camera.rotation.y += (targetRotationY - window.camera.rotation.y) * config.smoothness;
        }
    }
    
    /**
     * Update neural network animation
     */
    function updateNeuralNetwork() {
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
    }
    
    /**
     * Update content emergence from nodes
     */
    function updateContentEmergence() {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        contentBlocks.forEach(block => {
            const wrapper = block.element.querySelector('.parallax-content-wrapper');
            if (!wrapper || !block.nodePosition) return;
            
            // Calculate when this section should emerge
            const triggerPoint = block.originalTop - viewportHeight * 0.8;
            const endPoint = block.originalTop - viewportHeight * 0.3;
            
            let progress = 0;
            if (scrollY >= triggerPoint && scrollY <= endPoint) {
                progress = (scrollY - triggerPoint) / (endPoint - triggerPoint);
            } else if (scrollY > endPoint) {
                progress = 1;
            }
            
            block.emergenceProgress = progress;
            
            // Update node position in screen space
            if (window.nodes && window.nodes[block.nodeIndex]) {
                const node = window.nodes[block.nodeIndex];
                const vector = new THREE.Vector3(node.x, node.y, node.z);
                vector.project(window.camera);
                
                block.nodePosition.screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
                block.nodePosition.screenY = (-vector.y * 0.5 + 0.5) * window.innerHeight;
            }
            
            if (progress === 0) {
                // Hidden state - content at node
                wrapper.style.opacity = '0';
                wrapper.style.transform = `scale(0.1)`;
                block.element.style.minHeight = '0';
                block.isEmerged = false;
            } else if (progress < 1) {
                // Emerging - content traveling from node to position
                const easeProgress = easeOutCubic(progress);
                
                // Calculate position interpolation
                const rect = block.element.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                
                const currentX = block.nodePosition.screenX + (targetX - block.nodePosition.screenX) * easeProgress;
                const currentY = block.nodePosition.screenY + (targetY - block.nodePosition.screenY) * easeProgress;
                
                const translateX = currentX - targetX;
                const translateY = currentY - targetY;
                
                // Scale from small to full size
                const scale = 0.1 + (0.9 * easeProgress);
                
                // Apply transformation
                wrapper.style.opacity = Math.min(1, progress * 2);
                wrapper.style.transform = `
                    translate3d(${translateX}px, ${translateY}px, 0)
                    scale(${scale})
                `;
                
                // Gradually restore section height
                block.element.style.minHeight = `${block.height * easeProgress}px`;
                block.isEmerged = false;
            } else {
                // Fully emerged
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'translate3d(0, 0, 0) scale(1)';
                block.element.style.minHeight = '';
                block.isEmerged = true;
            }
        });
    }
    
    /**
     * Update connection lines between nodes and sections
     */
    function updateConnectionLines() {
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
                block.connectionLine.setAttribute('opacity', Math.min(0.6, progress * 2));
                block.connectionLine.style.strokeDasharray = '1000';
                block.connectionLine.style.strokeDashoffset = 1000 * (1 - drawLength);
                
                // Add glow effect
                block.connectionLine.style.filter = `blur(1px) drop-shadow(0 0 ${5 + progress * 10}px rgba(56, 189, 248, ${0.3 + progress * 0.3}))`;
            } else {
                block.connectionLine.setAttribute('opacity', '0');
            }
        });
    }
    
    /**
     * Update node portal effects
     */
    function updateNodePortals() {
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
            
            // Create portal effect
            if (portalStrength > 0.1) {
                // Pulsing motion
                const pulseForce = Math.sin(Date.now() * 0.005) * portalStrength * 0.02;
                node.vx += pulseForce * (Math.random() - 0.5);
                node.vy += pulseForce * (Math.random() - 0.5);
                node.vz += pulseForce * (Math.random() - 0.5);
            }
            
            // Update node color for portal effect
            if (window.neuralNetwork.geometry && window.neuralNetwork.geometry.attributes.color) {
                const colors = window.neuralNetwork.geometry.attributes.color.array;
                const i = nodeIndex;
                
                const glowIntensity = 1 + (portalStrength * 3);
                colors[i * 3] = Math.min(1.0, 0.22 * glowIntensity);
                colors[i * 3 + 1] = Math.min(1.0, 0.74 * glowIntensity);
                colors[i * 3 + 2] = Math.min(1.0, 0.97 * glowIntensity);
                
                window.neuralNetwork.geometry.attributes.color.needsUpdate = true;
            }
        });
    }
    
    /**
     * Easing function for smooth animation
     */
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
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
                will-change: transform, opacity;
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
            
            /* Disable for reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .parallax-content-wrapper {
                    transition: none !important;
                    transform: none !important;
                }
                
                #parallax-connections {
                    display: none;
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
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollParallax);
    } else {
        initScrollParallax();
    }
    
})();
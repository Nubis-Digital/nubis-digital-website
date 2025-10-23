/**
 * 3D Scroll Parallax System for Nubis Digital
 * Integrates with the neural network background to create immersive depth
 */

(function() {
    'use strict';
    
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // Parallax configuration
    const config = {
        smoothness: 0.08,           // Lower = smoother but slower
        cameraZoomRange: [25, 18],  // [initial, zoomed] camera Z position
        rotationIntensity: 0.4,     // How much rotation based on scroll
        nodeSpeedMultiplier: 1.5,   // Speed up node animation on scroll
        depthLayerCount: 5,         // Number of depth layers for content
        perspectiveBase: 1000,      // Base perspective value
        stickyThreshold: 0.25,      // Scroll progress % where sticky behavior starts
        stickyDuration: 0.15,       // Percentage of scroll that sticky section remains
        connectionNodeCount: 8,     // Number of nodes to connect to each section
        connectionStrength: 0.2,    // How strongly nodes are attracted to sections
        emergenceScale: 0.6         // Starting scale for section emergence
    };
    
    /**
     * Initialize scroll parallax system
     */
    function initScrollParallax() {
        // Wait for 3D scene to be initialized
        if (typeof window.camera === 'undefined' || typeof window.neuralNetwork === 'undefined') {
            setTimeout(initScrollParallax, 100);
            return;
        }
        
        console.log('Initializing 3D scroll parallax system...');
        
        // Add depth layers to content sections
        addDepthLayers();
        
        // Identify and prepare sticky sections
        setupStickySections();
        
        // Create connection points between neural network and page sections
        createSectionConnectionPoints();
        
        // Create section origin points (where sections emerge from)
        updateSectionOrigins();
        
        // Set up scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Start parallax animation loop
        animateParallax();
        
        console.log('3D scroll parallax system initialized');
    }
    
    /**
     * Handle scroll events
     */
    function onScroll() {
        // Calculate scroll progress (0 to 1)
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        
        // Set scrolling flag
        isScrolling = true;
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Set timeout to detect scroll end
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }
    
    /**
     * Set up sticky sections - identify key sections for sticky scrolling behavior
     */
    function setupStickySections() {
        // Find sections that should have sticky behavior
        const heroSection = document.querySelector('main > div > section:first-of-type');
        const servicesSection = document.querySelector('main > div > section:nth-of-type(2)');
        const blogSection = document.querySelector('main > div > section:nth-of-type(3)');
        
        // Add sticky attributes to these sections
        if (heroSection) {
            heroSection.setAttribute('data-sticky', 'true');
            heroSection.setAttribute('data-sticky-index', '0');
        }
        
        if (servicesSection) {
            servicesSection.setAttribute('data-sticky', 'true');
            servicesSection.setAttribute('data-sticky-index', '1');
        }
        
        if (blogSection) {
            blogSection.setAttribute('data-sticky', 'true');
            blogSection.setAttribute('data-sticky-index', '2');
        }
    }

    /**
     * Create section origin points - where sections emerge from
     */
    function updateSectionOrigins() {
        // Skip if connections aren't set up yet
        if (!window.sectionConnections || !window.nodes) return;
        
        // Process each section connection
        window.sectionConnections.forEach(connection => {
            const section = connection.section;
            if (!section) return;
            
            // Find the primary node for this section (the one with highest strength)
            let primaryNode = connection.nodes[0];
            if (connection.nodes.length > 1) {
                // Find node with highest strength
                primaryNode = connection.nodes.reduce((best, current) => 
                    current.strength > best.strength ? current : best, connection.nodes[0]);
            }
            
            if (!primaryNode) return;
            
            // Get the node's current position
            const nodeIndex = primaryNode.nodeIndex;
            if (nodeIndex >= window.nodes.length) return;
            
            const node = window.nodes[nodeIndex];
            if (!node) return;
            
            // Calculate screen position of this node (approximate)
            // Convert from THREE.js coordinates to screen coordinates
            const screenX = (node.x / 30) * window.innerWidth * 0.5;
            const screenY = (-node.y / 20) * window.innerHeight * 0.5;
            const screenZ = (node.z / 15) * -100; // Depth as Z translation
            
            // Store this data on the section for use in animations
            section.dataset.originPoint = JSON.stringify({ 
                x: screenX, 
                y: screenY, 
                z: screenZ,
                nodeIndex: nodeIndex
            });
            
            // Add position tracking for mouse effects
            section.addEventListener('mousemove', (e) => {
                if (section.hasAttribute('data-connection-active')) {
                    const rect = section.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    section.style.setProperty('--mouse-x', `${x}%`);
                    section.style.setProperty('--mouse-y', `${y}%`);
                }
            });
        });
    }
    
    /**
     * Create connection points that link neural network nodes with page sections
     */
    function createSectionConnectionPoints() {
        if (!window.neuralNetwork || !window.nodes) return;
        
        // Find key sections to connect with neural network
        const sections = document.querySelectorAll('[data-sticky="true"]');
        if (!sections.length) return;
        
        console.log('Creating neural connections with page sections...');
        
        // Store section elements in nodes data for later connection
        window.sectionConnections = [];
        
        sections.forEach((section, index) => {
            // Get section position
            const rect = section.getBoundingClientRect();
            const sectionCenterX = rect.left + (rect.width / 2);
            const sectionCenterY = rect.top + (rect.height / 2);
            
            // Convert to 3D coordinates (approximate)
            const vector = new THREE.Vector3(
                (sectionCenterX / window.innerWidth) * 30 - 15,
                -(sectionCenterY / window.innerHeight) * 20 + 10,
                0
            );
            
            // Select nodes to connect with this section
            const nodeCount = config.connectionNodeCount;
            const connectedNodes = [];
            
            // Choose nodes that will be attracted to this section
            for (let i = 0; i < nodeCount; i++) {
                // Pick nodes based on section index to distribute them across the neural network
                const nodeIndex = Math.floor(Math.random() * window.nodes.length / 3) + 
                                 (index * Math.floor(window.nodes.length / 3));
                
                if (nodeIndex < window.nodes.length) {
                    // Store connection data
                    connectedNodes.push({
                        nodeIndex: nodeIndex,
                        targetX: vector.x + (Math.random() - 0.5) * 8,
                        targetY: vector.y + (Math.random() - 0.5) * 5,
                        targetZ: vector.z + (Math.random() - 0.5) * 3,
                        strength: config.connectionStrength + (Math.random() * 0.1),
                        section: section,
                        active: false
                    });
                    
                    // Mark this node as a connection node
                    window.nodes[nodeIndex].isConnection = true;
                    window.nodes[nodeIndex].connectionIndex = connectedNodes.length - 1;
                    window.nodes[nodeIndex].sectionIndex = index;
                }
            }
            
            window.sectionConnections.push({
                section: section,
                sectionIndex: index,
                nodes: connectedNodes,
                vector: vector
            });
        });
        
        console.log(`Created neural connections with ${window.sectionConnections.length} sections`);
    }
    
    /**
     * Add depth layers to content sections
     */
    function addDepthLayers() {
        const sections = document.querySelectorAll('main > div > section, main > div > div > section');
        
        sections.forEach((section, index) => {
            // Calculate depth layer (0 = closest, higher = further)
            const depthLayer = index % config.depthLayerCount;
            const depthFactor = depthLayer / config.depthLayerCount;
            
            // Add data attribute for parallax
            section.setAttribute('data-parallax-depth', depthLayer);
            
            // Apply initial transform
            section.style.transform = `translateZ(${-depthFactor * 100}px)`;
            section.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Set perspective on main content container
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.perspective = `${config.perspectiveBase}px`;
            mainContent.style.perspectiveOrigin = '50% 50%';
        }
    }
    
    /**
     * Parallax animation loop
     */
    function animateParallax() {
        requestAnimationFrame(animateParallax);
        
        // Smooth scroll progress interpolation
        scrollProgress += (targetScrollProgress - scrollProgress) * config.smoothness;
        
        // Update 3D camera based on scroll
        updateCamera();
        
        // Update neural network based on scroll
        updateNeuralNetwork();
        
        // Update content depth layers
        updateContentLayers();
        
        // Update section origin points (where sections emerge from)
        if (isScrolling) {
            updateSectionOrigins();
        }
    }
    
    /**
     * Update camera position based on scroll
     */
    function updateCamera() {
        if (!window.camera) return;
        
        // Interpolate camera Z position (zoom in as user scrolls)
        const [startZ, endZ] = config.cameraZoomRange;
        const targetZ = startZ + (endZ - startZ) * scrollProgress;
        
        // Smooth camera movement
        window.camera.position.z += (targetZ - window.camera.position.z) * config.smoothness;
        
        // Add subtle camera rotation based on scroll
        const targetRotationX = scrollProgress * 0.2 - 0.1;
        const targetRotationY = Math.sin(scrollProgress * Math.PI) * 0.15;
        
        if (window.camera.rotation) {
            window.camera.rotation.x += (targetRotationX - window.camera.rotation.x) * config.smoothness;
            window.camera.rotation.y += (targetRotationY - window.camera.rotation.y) * config.smoothness;
        }
    }
    
    /**
     * Update neural network animation based on scroll
     */
    function updateNeuralNetwork() {
        if (!window.neuralNetwork || !window.nodes) return;
        
        // Increase animation speed when scrolling
        const speedMultiplier = isScrolling ? config.nodeSpeedMultiplier : 1.0;
        
        // Add scroll-based rotation
        const scrollRotation = scrollProgress * Math.PI * 0.5;
        
        // Apply rotation with smooth interpolation
        if (window.neuralNetwork.rotation) {
            const targetRotationY = scrollRotation + Math.sin(Date.now() * 0.0001) * 0.2;
            const targetRotationX = scrollProgress * 0.3 + Math.cos(Date.now() * 0.00015) * 0.1;
            
            window.neuralNetwork.rotation.y += (targetRotationY - window.neuralNetwork.rotation.y) * 0.02;
            window.neuralNetwork.rotation.x += (targetRotationX - window.neuralNetwork.rotation.x) * 0.02;
            
            // Sync connection lines
            if (window.connectionLines) {
                window.connectionLines.rotation.y = window.neuralNetwork.rotation.y;
                window.connectionLines.rotation.x = window.neuralNetwork.rotation.x;
            }
        }
        
        // Modify node velocities based on scroll
        if (window.nodes && Array.isArray(window.nodes)) {
            window.nodes.forEach(node => {
                // Add scroll-based force
                const scrollForce = (targetScrollProgress - scrollProgress) * 0.01;
                node.vx += scrollForce * (Math.random() - 0.5);
                node.vy += scrollForce * (Math.random() - 0.5);
                node.vz += scrollForce * (Math.random() - 0.5) * 0.5;
            });
        }
        
        // Adjust material opacity based on scroll
        if (window.neuralNetwork.material) {
            const targetOpacity = 0.9 - (scrollProgress * 0.3); // Fade slightly as user scrolls
            window.neuralNetwork.material.opacity += (targetOpacity - window.neuralNetwork.material.opacity) * 0.05;
        }
        
        if (window.connectionLines && window.connectionLines.material) {
            const targetLineOpacity = 0.25 - (scrollProgress * 0.1);
            window.connectionLines.material.opacity += (targetLineOpacity - window.connectionLines.material.opacity) * 0.05;
        }
    }
    
    /**
     * Update content depth layers based on scroll
     */
    function updateContentLayers() {
        const sections = document.querySelectorAll('[data-parallax-depth]');
        
        sections.forEach(section => {
            const depth = parseInt(section.getAttribute('data-parallax-depth'), 10);
            const depthFactor = depth / config.depthLayerCount;
            
            // Check if this is a sticky section
            const isSticky = section.getAttribute('data-sticky') === 'true';
            const stickyIndex = isSticky ? parseInt(section.getAttribute('data-sticky-index'), 10) : -1;
            
            if (isSticky) {
                // Calculate sticky scroll ranges
                const sectionCount = document.querySelectorAll('[data-sticky="true"]').length;
                const sectionHeight = 1 / sectionCount;
                const startThreshold = stickyIndex * sectionHeight;
                const endThreshold = startThreshold + sectionHeight;
                
                // Apply sticky effect when in threshold
                if (scrollProgress >= startThreshold && scrollProgress <= endThreshold) {
                    // Calculate progress within this sticky section
                    const sectionProgress = (scrollProgress - startThreshold) / sectionHeight;
                    
                    // Get origin point data (where this section emerges from)
                    const originData = section.dataset.originPoint ? 
                        JSON.parse(section.dataset.originPoint) : 
                        { x: 0, y: 0, z: -200, nodeIndex: 0 };
                    
                    // Apply sticky behavior - stay fixed until reaching threshold
                    if (sectionProgress < config.stickyThreshold) {
                        // Entering phase - emerge from connected neural node
                        const enterProgress = sectionProgress / config.stickyThreshold;
                        
                        // Calculate emergence transform
                        // Start at origin point (connected neuron) and move to final position
                        const startX = originData.x * (1 - enterProgress);
                        const startY = originData.y * (1 - enterProgress);
                        const startZ = originData.z * (1 - enterProgress);
                        
                        // Scale up from the origin node
                        const scale = config.emergenceScale + ((1 - config.emergenceScale) * enterProgress);
                        
                        // Apply transform - emerge from neural node
                        section.style.transform = `translate3d(${startX}px, ${startY}px, ${startZ}px) scale(${scale})`;
                        section.style.opacity = 0.5 + (enterProgress * 0.5);
                        section.style.transformOrigin = '50% 50%';
                        
                        // Add neural connection trails
                        section.setAttribute('data-emergence', 'true');
                    }
                    else if (sectionProgress < (config.stickyThreshold + config.stickyDuration)) {
                        // Sticky phase - stay fixed in view with subtle animation
                        const stickyProgress = (sectionProgress - config.stickyThreshold) / config.stickyDuration;
                        const subtle = Math.sin(stickyProgress * Math.PI) * 5;
                        
                        // Gentle floating effect
                        const pulseScale = 1 + (Math.sin(Date.now() * 0.001) * 0.01);
                        
                        // Apply transform - fully visible and subtly animated
                        section.style.transform = `translate3d(0, 0, ${subtle}px) scale(${pulseScale})`;
                        section.style.opacity = 1;
                        
                        // Add data attribute for active connection
                        section.setAttribute('data-connection-active', 'true');
                        section.removeAttribute('data-emergence');
                    }
                    else {
                        // Exit phase - fade toward next neural connection
                        const exitProgress = (sectionProgress - config.stickyThreshold - config.stickyDuration) /
                                          (1 - config.stickyThreshold - config.stickyDuration);
                        
                        // Get next section's origin point if available
                        let nextOriginData = { x: 0, y: -100, z: -50 }; 
                        
                        const nextSection = document.querySelector(`[data-sticky-index="${stickyIndex + 1}"]`);
                        if (nextSection && nextSection.dataset.originPoint) {
                            nextOriginData = JSON.parse(nextSection.dataset.originPoint);
                        }
                        
                        // Calculate movement toward next node
                        const exitX = nextOriginData.x * exitProgress * 0.3;
                        const exitY = -100 * exitProgress; // Primary exit direction
                        const exitZ = nextOriginData.z * exitProgress * 0.3;
                        
                        // Scale down toward the next node
                        const exitScale = 1 - (exitProgress * 0.3);
                        
                        // Apply transform - fade toward next neural point
                        section.style.transform = `translate3d(${exitX}px, ${exitY}px, ${exitZ}px) scale(${exitScale})`;
                        section.style.opacity = 1 - (exitProgress * 0.5);
                        
                        // Remove active connection state
                        section.removeAttribute('data-connection-active');
                        section.removeAttribute('data-emergence');
                    }
                    
                    // Apply z-index to ensure proper stacking
                    section.style.zIndex = 10 - stickyIndex;
                    section.style.position = 'relative';
                    
                    // Update neural network connections to this section
                    updateSectionConnections(section, stickyIndex, sectionProgress);
                }
                else {
                    // Outside sticky range - hide
                    section.style.opacity = 0;
                    section.style.transform = '';
                    section.style.zIndex = '';
                    section.removeAttribute('data-connection-active');
                    section.removeAttribute('data-emergence');
                }
            }
            else {
                // Non-sticky sections get standard parallax
                // Calculate parallax offset
                const parallaxOffset = scrollProgress * 100 * depthFactor;
                
                // Apply transform with depth
                const translateZ = -depthFactor * 100;
                const translateY = -parallaxOffset;
                
                section.style.transform = `translateZ(${translateZ}px) translateY(${translateY}px)`;
                
                // Add subtle scale effect for depth perception
                const scale = 1 - (depthFactor * 0.05);
                section.style.transform += ` scale(${scale})`;
            }
        });
        
        // Set perspective origin to follow scroll
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const originY = 50 + (scrollProgress * 20 - 10);
            mainContent.style.perspectiveOrigin = `50% ${originY}%`;
        }
    }
    
    /**
     * Update neural network nodes connected to sections
     */
    function updateSectionConnections(section, sectionIndex, sectionProgress) {
        // Skip if connections aren't set up yet
        if (!window.sectionConnections || !window.nodes) return;
        
        // Find the connection data for this section
        const connection = window.sectionConnections.find(conn => conn.sectionIndex === sectionIndex);
        if (!connection) return;
        
        // Calculate connection strength based on section progress
        // Strongest when section is fully in view (sticky phase)
        let connectionStrength = 0;
        
        if (sectionProgress < config.stickyThreshold) {
            // Entering - gradually increase connection
            connectionStrength = sectionProgress / config.stickyThreshold;
        } else if (sectionProgress < (config.stickyThreshold + config.stickyDuration)) {
            // Sticky - full connection
            connectionStrength = 1;
        } else {
            // Exiting - gradually decrease connection
            const remainingProgress = 1 - sectionProgress;
            connectionStrength = remainingProgress / (1 - config.stickyThreshold - config.stickyDuration);
        }
        
        // Apply connection effect to connected nodes
        connection.nodes.forEach(nodeConn => {
            if (nodeConn.nodeIndex < window.nodes.length) {
                const node = window.nodes[nodeConn.nodeIndex];
                
                // Only apply when connection is active
                if (connectionStrength > 0.1) {
                    // Mark connection as active
                    nodeConn.active = true;
                    
                    // Apply attraction force toward section
                    const attractX = (nodeConn.targetX - node.x) * nodeConn.strength * connectionStrength * 0.05;
                    const attractY = (nodeConn.targetY - node.y) * nodeConn.strength * connectionStrength * 0.05;
                    const attractZ = (nodeConn.targetZ - node.z) * nodeConn.strength * connectionStrength * 0.05;
                    
                    // Add to node velocity
                    node.vx += attractX;
                    node.vy += attractY;
                    node.vz += attractZ;
                    
                    // Add glowing effect to connected nodes
                    if (window.neuralNetwork && window.neuralNetwork.geometry) {
                        const colors = window.neuralNetwork.geometry.attributes.color.array;
                        const i = nodeConn.nodeIndex;
                        
                        // Enhance color brightness for connected nodes
                        colors[i * 3] = Math.min(1.0, colors[i * 3] + 0.3 * connectionStrength);
                        colors[i * 3 + 1] = Math.min(1.0, colors[i * 3 + 1] + 0.3 * connectionStrength);
                        colors[i * 3 + 2] = Math.min(1.0, colors[i * 3 + 2] + 0.3 * connectionStrength);
                        
                        // Make node size larger
                        if (window.neuralNetwork.geometry.attributes.size) {
                            const sizes = window.neuralNetwork.geometry.attributes.size.array;
                            sizes[i] = 0.15 + (0.15 * connectionStrength);
                            window.neuralNetwork.geometry.attributes.size.needsUpdate = true;
                        }
                        
                        window.neuralNetwork.geometry.attributes.color.needsUpdate = true;
                    }
                } else if (nodeConn.active) {
                    // Reset connection status when no longer active
                    nodeConn.active = false;
                }
            }
        });
    }

    /**
     * Expose scroll progress for other scripts
     */
    window.getScrollProgress = function() {
        return scrollProgress;
    };
    
    /**
     * Allow external control of parallax intensity
     */
    window.setParallaxIntensity = function(intensity) {
        config.rotationIntensity = Math.max(0, Math.min(1, intensity));
    };
    
    /**
     * Add CSS styles for sticky sections
     */
    function addStickyStyles() {
        // Create style element
        const style = document.createElement('style');
        style.textContent = `
            [data-sticky="true"] {
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                will-change: transform, opacity;
                backface-visibility: hidden;
            }
            
            /* Enhance glass effect during sticky phase */
            [data-sticky="true"] .glass-panel {
                transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
            }
            
            /* Neural connection effect - glow at connection points */
            [data-sticky="true"] .glass-panel::before {
                content: '';
                position: absolute;
                inset: -5px;
                background: radial-gradient(
                    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                    rgba(56, 189, 248, 0.25) 0%,
                    rgba(99, 102, 241, 0.15) 40%,
                    transparent 80%
                );
                opacity: 0;
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                pointer-events: none;
                z-index: -1;
            }
            
            /* Neural emergence effect - when section is emerging from neuron */
            [data-emergence="true"]::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
                z-index: -1;
                opacity: 1;
                animation: pulse 2s ease-in-out infinite;
                pointer-events: none;
            }
            
            [data-emergence="true"] .glass-panel {
                box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);
            }
            
            [data-connection-active="true"] .glass-panel::before {
                opacity: 0.9;
                animation: pulse-glow 3s ease-in-out infinite;
            }
            
            /* Neural connection filament effect - connecting lines */
            [data-connection-active="true"]::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background:
                    radial-gradient(circle at 20% -50%, rgba(56, 189, 248, 0.2) 0%, transparent 60%),
                    radial-gradient(circle at 80% -30%, rgba(129, 140, 248, 0.2) 0%, transparent 60%);
                z-index: -1;
                opacity: 1;
                pointer-events: none;
                animation: filament-glow 4s ease-in-out infinite;
            }
            
            /* Connection active state */
            [data-connection-active="true"] .glass-panel {
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                box-shadow: 
                    0 15px 30px rgba(0, 0, 0, 0.2),
                    0 0 20px rgba(56, 189, 248, 0.1),
                    0 0 10px rgba(99, 102, 241, 0.1);
            }
            
            /* Hover state enhancements */
            [data-sticky="true"]:hover .glass-panel {
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.25),
                    0 0 30px rgba(56, 189, 248, 0.2),
                    0 0 15px rgba(99, 102, 241, 0.15);
            }
            
            /* Animation keyframes */
            @keyframes pulse-glow {
                0% { opacity: 0.5; }
                50% { opacity: 0.9; }
                100% { opacity: 0.5; }
            }
            
            @keyframes filament-glow {
                0% { opacity: 0.7; }
                50% { opacity: 1; }
                100% { opacity: 0.7; }
            }
            
            @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.7; }
                50% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.7; }
            }
            
            /* Add perspective to main content container */
            #main-content {
                perspective: 1000px;
                perspective-origin: 50% 50%;
                transition: perspective-origin 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add styles for neural connections and sticky sections
    addStickyStyles();
    
    // Track section positions on resize to update neural connections
    window.addEventListener('resize', () => {
        if (window.sectionConnections) {
            setTimeout(() => {
                createSectionConnectionPoints();
                updateSectionOrigins();
            }, 100);
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollParallax);
    } else {
        initScrollParallax();
    }
    
})();
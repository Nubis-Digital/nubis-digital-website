/**
 * 3D Neural Network Background
 * Creates an animated brain-like neural network using Three.js
 */

(function() {
    'use strict';

    // Global variables for 3D scene
    let scene, camera, renderer, neuralNetwork, connectionLines;
    let nodeMaterial, lineMaterial;
    const mouse = new THREE.Vector2();
    const nodes = [];
    const connections = [];
    
    // Expose variables globally for scroll parallax integration
    window.camera = null;
    window.neuralNetwork = null;
    window.connectionLines = null;
    window.nodes = nodes;
    window.connections = connections;

    function initThree() {
        const container = document.getElementById('three-canvas-container');
        if (!container) return;
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Get theme colors
        const color1 = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--logo-color-1').trim());
        const color2 = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--logo-color-2').trim());

        // Create neural network nodes with brain-like structure
        const nodeCount = 200; // More nodes for better brain structure
        const nodeGeometry = new THREE.BufferGeometry();
        const nodePositions = [];
        const nodeColors = [];
        
        // Create brain-like formation of nodes
        for (let i = 0; i < nodeCount; i++) {
            let x, y, z;
            
            if (i < nodeCount * 0.7) {
                // Main brain mass - ellipsoid shape
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const radius = Math.random() * 5 + 10;
                
                // Brain is wider than tall, and slightly flattened at top/bottom
                x = Math.sin(phi) * Math.cos(theta) * (radius * 1.2);
                y = Math.sin(phi) * Math.sin(theta) * radius;
                z = Math.cos(phi) * (radius * 0.9);
                
                // Add more randomness to brain surface
                const surfaceRandomness = Math.random() * 2;
                x += (Math.random() - 0.5) * surfaceRandomness;
                y += (Math.random() - 0.5) * surfaceRandomness;
                z += (Math.random() - 0.5) * surfaceRandomness;
                
                // Create hemispheres by adding a slight gap in the middle
                if (x > 0) x += 1;
                if (x < 0) x -= 1;
            } else {
                // Neurons extending from brain
                const baseX = (Math.random() - 0.5) * 25;
                const baseY = (Math.random() - 0.5) * 15;
                const baseZ = (Math.random() - 0.5) * 20;
                
                // Add directionality to neural extensions
                x = baseX * 1.5; // Extend more horizontally
                y = baseY;
                z = baseZ * 1.2;
            }
            
            nodes.push({
                x, y, z,
                // Store original position for brain formation restoration
                originalX: x,
                originalY: y,
                originalZ: z,
                // More gentle movement for brain structure
                vx: (Math.random() - 0.5) * 0.01,
                vy: (Math.random() - 0.5) * 0.01,
                vz: (Math.random() - 0.5) * 0.005
            });
            nodePositions.push(x, y, z);
            
            // Gradient color based on position
            const t = (i / nodeCount);
            const color = new THREE.Color().lerpColors(color1, color2, t);
            nodeColors.push(color.r, color.g, color.b);
        }
        
        nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
        nodeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nodeColors, 3));
        
        nodeMaterial = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        neuralNetwork = new THREE.Points(nodeGeometry, nodeMaterial);
        scene.add(neuralNetwork);
        
        // Expose globally for scroll parallax
        window.neuralNetwork = neuralNetwork;
        
        // Create connection lines between nearby nodes
        const linePositions = [];
        const lineColors = [];
        const maxDistance = 6; // Slightly increased for better brain connectivity
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dz = nodes[i].z - nodes[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < maxDistance) {
                    linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
                    linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
                    
                    const t1 = i / nodeCount;
                    const t2 = j / nodeCount;
                    const color = new THREE.Color().lerpColors(color1, color2, (t1 + t2) / 2);
                    
                    lineColors.push(color.r, color.g, color.b);
                    lineColors.push(color.r, color.g, color.b);
                    
                    connections.push({ i, j });
                }
            }
        }
        
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        
        lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        
        connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(connectionLines);
        
        // Expose globally for scroll parallax
        window.connectionLines = connectionLines;

        // Add subtle ambient lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        
        // Set initial camera position - slightly further away to see whole brain
        camera.position.set(0, 0, 30);
        
        // Expose globally for scroll parallax
        window.camera = camera;
        
        // Apply current theme
        if (window.setTheme) {
            window.setTheme(document.documentElement.dataset.theme);
        }
        
        // Start the animation loop
        animate();
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        if (neuralNetwork && connectionLines) {
            // Animate node positions (gentle floating motion)
            const positions = neuralNetwork.geometry.attributes.position.array;
            
            // Calculate brain formation factor based on scroll depth
            // 0 = full brain formation, 1 = full neuron scatter
            const brainFormation = Math.max(0, 1 - (window.getScrollProgress ? window.getScrollProgress() * 2 : 0));
            
            for (let i = 0; i < nodes.length; i++) {
                // Update velocities with slight random changes
                nodes[i].vx += (Math.random() - 0.5) * 0.0005;
                nodes[i].vy += (Math.random() - 0.5) * 0.0005;
                nodes[i].vz += (Math.random() - 0.5) * 0.0003;
                
                // Damping
                nodes[i].vx *= 0.98;
                nodes[i].vy *= 0.98;
                nodes[i].vz *= 0.98;
                
                // Interpolate between brain formation and scattered neurons
                const targetX = nodes[i].originalX * brainFormation + (nodes[i].originalX * 2 * (1 - brainFormation));
                const targetY = nodes[i].originalY * brainFormation + (nodes[i].originalY * 2 * (1 - brainFormation));
                const targetZ = nodes[i].originalZ * brainFormation + (nodes[i].originalZ * 2 * (1 - brainFormation));
                
                // Apply forces toward target position (brain formation or scattered)
                nodes[i].vx += (targetX - nodes[i].x) * 0.001;
                nodes[i].vy += (targetY - nodes[i].y) * 0.001;
                nodes[i].vz += (targetZ - nodes[i].z) * 0.001;
                
                // Update positions
                nodes[i].x += nodes[i].vx;
                nodes[i].y += nodes[i].vy;
                nodes[i].z += nodes[i].vz;
                
                // Boundary constraints (looser for neuron mode)
                const boundaryX = 15 + (15 * (1 - brainFormation));
                const boundaryY = 10 + (10 * (1 - brainFormation));
                const boundaryZ = 7.5 + (7.5 * (1 - brainFormation));
                
                if (Math.abs(nodes[i].x) > boundaryX) nodes[i].vx *= -0.5;
                if (Math.abs(nodes[i].y) > boundaryY) nodes[i].vy *= -0.5;
                if (Math.abs(nodes[i].z) > boundaryZ) nodes[i].vz *= -0.5;
                
                positions[i * 3] = nodes[i].x;
                positions[i * 3 + 1] = nodes[i].y;
                positions[i * 3 + 2] = nodes[i].z;
            }
            neuralNetwork.geometry.attributes.position.needsUpdate = true;
            
            // Update connection lines to follow nodes
            const linePositions = connectionLines.geometry.attributes.position.array;
            for (let c = 0; c < connections.length; c++) {
                const { i, j } = connections[c];
                linePositions[c * 6] = nodes[i].x;
                linePositions[c * 6 + 1] = nodes[i].y;
                linePositions[c * 6 + 2] = nodes[i].z;
                linePositions[c * 6 + 3] = nodes[j].x;
                linePositions[c * 6 + 4] = nodes[j].y;
                linePositions[c * 6 + 5] = nodes[j].z;
            }
            connectionLines.geometry.attributes.position.needsUpdate = true;
            
            // Slow rotation for depth perception
            neuralNetwork.rotation.y = Math.sin(time * 0.05) * 0.2;
            neuralNetwork.rotation.x = Math.cos(time * 0.08) * 0.1;
            connectionLines.rotation.y = neuralNetwork.rotation.y;
            connectionLines.rotation.x = neuralNetwork.rotation.x;
            
            // Subtle mouse interaction
            const targetRotationY = mouse.x * 0.3;
            const targetRotationX = -mouse.y * 0.3;
            neuralNetwork.rotation.y += (targetRotationY - neuralNetwork.rotation.y) * 0.02;
            neuralNetwork.rotation.x += (targetRotationX - neuralNetwork.rotation.x) * 0.02;
            connectionLines.rotation.y = neuralNetwork.rotation.y;
            connectionLines.rotation.x = neuralNetwork.rotation.x;
        }

        renderer.render(scene, camera);
    }

    // Event Listeners
    function onWindowResize() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function onMouseMove(event) {
        // Normalize mouse coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Set up event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    
    // Initialize the 3D scene when Three.js and DOM are ready
    function init() {
        if (typeof THREE !== 'undefined') {
            initThree();
        } else {
            console.error("Three.js library not found. Please ensure it's loaded before this script.");
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
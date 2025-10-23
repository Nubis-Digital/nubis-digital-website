/**
 * Theme Manager for Nubis Digital
 * Handles theme switching and persistence
 */

(function() {
    'use strict';

    // Function to apply a theme and update 3D object colors
    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        
        // Wait for CSS variables to be applied, then update neural network colors
        requestAnimationFrame(() => {
            if (window.neuralNetwork && window.connectionLines) {
                const newColor1 = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--logo-color-1').trim());
                const newColor2 = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--logo-color-2').trim());
                
                // Update node colors
                const nodeColors = window.neuralNetwork.geometry.attributes.color.array;
                const nodeCount = nodeColors.length / 3;
                for (let i = 0; i < nodeCount; i++) {
                    const t = i / nodeCount;
                    const color = new THREE.Color().lerpColors(newColor1, newColor2, t);
                    nodeColors[i * 3] = color.r;
                    nodeColors[i * 3 + 1] = color.g;
                    nodeColors[i * 3 + 2] = color.b;
                }
                window.neuralNetwork.geometry.attributes.color.needsUpdate = true;
                
                // Update connection line colors
                const lineColors = window.connectionLines.geometry.attributes.color.array;
                const lineCount = lineColors.length / 6;
                for (let i = 0; i < lineCount; i++) {
                    const t = i / lineCount;
                    const color = new THREE.Color().lerpColors(newColor1, newColor2, t);
                    lineColors[i * 6] = color.r;
                    lineColors[i * 6 + 1] = color.g;
                    lineColors[i * 6 + 2] = color.b;
                    lineColors[i * 6 + 3] = color.r;
                    lineColors[i * 6 + 4] = color.g;
                    lineColors[i * 6 + 5] = color.b;
                }
                window.connectionLines.geometry.attributes.color.needsUpdate = true;
            }
        });
    }
    
    // Load saved theme or set based on user preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || (userPrefersDark ? 'dark' : 'light'));

    // Theme toggle function (called from navigation)
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    // Expose setTheme for neural network initialization
    window.setTheme = setTheme;
})();
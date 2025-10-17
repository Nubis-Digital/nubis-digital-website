// Liquid Glass Effect for Navigation Links
// Adapted from Shu Ding's liquid-glass implementation

(function() {
  'use strict';
  
  // Utility functions
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  
  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }
  
  function roundedRectSDF(x, y, width, height, radius) {
    const qx = Math.abs(x) - width;
    const qy = Math.abs(y) - height;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
  }
  
  // Liquid Glass Effect for Nav Links
  class NavLiquidGlass {
    constructor(linkElement, index) {
      this.link = linkElement;
      this.index = index;
      this.id = `nav-liquid-${index}`;
      this.width = 0;
      this.height = 0;
      this.mouse = { x: 0.5, y: 0.5 };
      this.canvasDPI = 1;
      
      this.setupElements();
      this.setupListeners();
    }
    
    setupElements() {
      // Create SVG filter
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svg.setAttribute('width', '0');
      this.svg.setAttribute('height', '0');
      this.svg.style.cssText = 'position: absolute; pointer-events: none;';
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', this.id);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('colorInterpolationFilters', 'sRGB');
      
      this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
      this.feImage.setAttribute('id', `${this.id}-img`);
      
      this.feDisplace = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      this.feDisplace.setAttribute('in', 'SourceGraphic');
      this.feDisplace.setAttribute('in2', `${this.id}-img`);
      this.feDisplace.setAttribute('xChannelSelector', 'R');
      this.feDisplace.setAttribute('yChannelSelector', 'G');
      this.feDisplace.setAttribute('scale', '15');
      
      filter.appendChild(this.feImage);
      filter.appendChild(this.feDisplace);
      defs.appendChild(filter);
      this.svg.appendChild(defs);
      
      // Create canvas for displacement map
      this.canvas = document.createElement('canvas');
      this.canvas.style.display = 'none';
      this.ctx = this.canvas.getContext('2d');
      
      // Append to document
      document.body.appendChild(this.svg);
      document.body.appendChild(this.canvas);
      
      // Apply filter to link
      this.link.style.filter = `url(#${this.id})`;
    }
    
    setupListeners() {
      this.link.addEventListener('mouseenter', () => {
        this.updateSize();
      });
      
      this.link.addEventListener('mousemove', (e) => {
        const rect = this.link.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height;
        this.updateShader();
      });
      
      this.link.addEventListener('mouseleave', () => {
        // Reset to center
        this.mouse.x = 0.5;
        this.mouse.y = 0.5;
        this.updateShader();
      });
    }
    
    updateSize() {
      const rect = this.link.getBoundingClientRect();
      this.width = Math.ceil(rect.width);
      this.height = Math.ceil(rect.height);
      
      this.canvas.width = this.width * this.canvasDPI;
      this.canvas.height = this.height * this.canvasDPI;
      
      this.feImage.setAttribute('width', this.width);
      this.feImage.setAttribute('height', this.height);
    }
    
    updateShader() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const data = new Uint8ClampedArray(w * h * 4);
      
      const mx = this.mouse.x;
      const my = this.mouse.y;
      
      for (let i = 0; i < w * h; i++) {
        const x = (i % w) / w;
        const y = Math.floor(i / w) / h;
        
        // Calculate distance from mouse
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Create liquid distortion effect
        const distort = smoothStep(0.5, 0, dist);
        
        // Calculate displacement
        const displaceX = dx * distort * 50;
        const displaceY = dy * distort * 50;
        
        const index = i * 4;
        data[index] = (displaceX + 128) % 256;
        data[index + 1] = (displaceY + 128) % 256;
        data[index + 2] = 128;
        data[index + 3] = 255;
      }
      
      const imageData = new ImageData(data, w, h);
      this.ctx.putImageData(imageData, 0, 0);
      this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.canvas.toDataURL());
    }
  }
  
  // Initialize on DOM ready
  function initLiquidGlass() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
      new NavLiquidGlass(link, index);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }
})();
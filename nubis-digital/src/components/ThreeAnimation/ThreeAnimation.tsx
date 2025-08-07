'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { useTheme } from '@/providers/Theme'

interface ThreeAnimationProps {
  enabled?: boolean
}

declare global {
  interface Window {
    THREE: any
  }
}

export const ThreeAnimation: React.FC<ThreeAnimationProps> = ({ enabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<{
    scene?: any
    camera?: any
    renderer?: any
    logoGroup?: any
    headMaterial?: any
    nodeMaterial?: any
    lineMaterial?: any
    applyThemeColors?: () => void
    cleanup?: () => void
  }>({})
  const { theme } = useTheme()

  // Update materials when theme changes
  useEffect(() => {
    if (!enabled || !animationRef.current.applyThemeColors) return
    
    // Use requestAnimationFrame to ensure CSS variables are updated
    requestAnimationFrame(() => {
      if (animationRef.current.applyThemeColors) {
        animationRef.current.applyThemeColors()
      }
    })
  }, [theme, enabled])

  useEffect(() => {
    if (!enabled || !containerRef.current || typeof window === 'undefined') {
      return
    }

    // Wait for Three.js to be loaded
    const initThree = () => {
      if (!window.THREE || !containerRef.current) return

      const container = containerRef.current
      const scene = new window.THREE.Scene()
      const camera = new window.THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true })

      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      const logoGroup = new window.THREE.Group()

      // Define materials for the logo components (start with white, will be updated by theme)
      const headMaterial = new window.THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.2, 
        roughness: 0.3, 
        transparent: true, 
        opacity: 0.15 
      })
      
      const nodeMaterial = new window.THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.4, 
        roughness: 0.2, 
        emissive: 0xffffff, 
        emissiveIntensity: 0.2 
      })
      
      const lineMaterial = new window.THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.3 
      })

      // Create the main head shape
      const headShape = new window.THREE.Shape()
      headShape.moveTo(-1.5, -2)
      headShape.bezierCurveTo(-1.5, -0.5, -2.5, 0.5, -2.5, 2)
      headShape.bezierCurveTo(-2.5, 3.5, -1, 4, 0, 4)
      headShape.bezierCurveTo(1, 4, 2.5, 3.5, 2.5, 2)
      headShape.bezierCurveTo(2.5, 0.5, 1.5, -0.5, 1.5, -2)
      headShape.lineTo(0.5, -2)
      headShape.lineTo(0.5, -2.5)
      headShape.lineTo(-0.5, -2.5)
      headShape.lineTo(-0.5, -2)
      headShape.lineTo(-1.5, -2)

      const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 2,
        bevelSize: 0.15,
        bevelThickness: 0.1,
      }

      const headGeometry = new window.THREE.ExtrudeGeometry(headShape, extrudeSettings)
      const head = new window.THREE.Mesh(headGeometry, headMaterial)
      head.position.z = -0.1
      logoGroup.add(head)

      // Create the nodes
      const nodePositions = [
        { x: 0, y: 2.5, z: 0 },
        { x: -1.2, y: 1.5, z: 0 },
        { x: 1.2, y: 1.5, z: 0 },
        { x: -1.8, y: -0.5, z: 0 },
        { x: 1.8, y: -0.5, z: 0 },
        { x: -0.8, y: -1.5, z: 0 },
        { x: 0, y: 0, z: 0 },
      ]

      const nodeGeometry = new window.THREE.SphereGeometry(0.2, 32, 32)
      const nodes = nodePositions.map((pos) => {
        const node = new window.THREE.Mesh(nodeGeometry, nodeMaterial)
        node.position.set(pos.x, pos.y, pos.z)
        logoGroup.add(node)
        return node
      })

      // Create the connecting lines
      const connections = [
        [6, 0],
        [6, 1],
        [6, 2],
        [1, 3],
        [2, 4],
        [3, 5],
      ]
      
      connections.forEach((conn) => {
        const points = [nodes[conn[0]].position, nodes[conn[1]].position]
        const lineGeometry = new window.THREE.BufferGeometry().setFromPoints(points)
        const line = new window.THREE.Line(lineGeometry, lineMaterial)
        logoGroup.add(line)
      })

      scene.add(logoGroup)

      // Add lighting
      scene.add(new window.THREE.AmbientLight(0xffffff, 0.6))
      const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)

      // Set initial camera position
      camera.position.set(0, 0, 8)

      // Function to apply theme colors to materials
      const applyThemeColors = () => {
        const computedStyle = getComputedStyle(document.body)
        const newColor1 = new window.THREE.Color(computedStyle.getPropertyValue('--logo-color-1').trim())
        const newColor2 = new window.THREE.Color(computedStyle.getPropertyValue('--logo-color-2').trim())
        
        headMaterial.color.set(newColor1)
        nodeMaterial.color.set(newColor1)
        nodeMaterial.emissive.set(newColor1)
        lineMaterial.color.set(newColor2)
      }

      // Apply initial theme colors
      requestAnimationFrame(applyThemeColors)

      // Mouse interaction
      const mouse = new window.THREE.Vector2()

      const onMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      }

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      // Animation loop
      const animate = () => {
        if (!animationRef.current.scene) return

        // Gently rotate the logo based on mouse position
        logoGroup.rotation.y += (mouse.x * 0.5 - logoGroup.rotation.y) * 0.05
        logoGroup.rotation.x += (-mouse.y * 0.5 - logoGroup.rotation.x) * 0.05

        // Add a slow, constant rotation
        logoGroup.rotation.y += 0.0005

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }

      // Event listeners
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', onWindowResize)

      // Store references
      animationRef.current = {
        scene,
        camera,
        renderer,
        logoGroup,
        headMaterial,
        nodeMaterial,
        lineMaterial,
        applyThemeColors,
        cleanup: () => {
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('resize', onWindowResize)
          
          if (container && renderer.domElement) {
            container.removeChild(renderer.domElement)
          }
          
          renderer.dispose()
          
          // Clean up geometries and materials
          logoGroup.traverse((child: any) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material: any) => material.dispose())
              } else {
                child.material.dispose()
              }
            }
          })
        },
      }

      // Start animation
      animate()
    }

    // Initialize Three.js when script is loaded
    if (window.THREE) {
      initThree()
    } else {
      // Wait for script to load
      const checkThree = setInterval(() => {
        if (window.THREE) {
          clearInterval(checkThree)
          initThree()
        }
      }, 100)

      return () => clearInterval(checkThree)
    }

    return () => {
      if (animationRef.current.cleanup) {
        animationRef.current.cleanup()
      }
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Three.js is now loaded, component will initialize via the useEffect
        }}
      />
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -10 }}
      />
    </>
  )
}
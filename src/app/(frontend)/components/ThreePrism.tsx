'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreePrism() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(1.5, 0)

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x101417,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
    const wireframe = new THREE.Mesh(geometry, wireMaterial)
    scene.add(wireframe)

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.5,
      transparent: true,
      opacity: 0.8,
    })
    const prism = new THREE.Mesh(geometry, material)
    scene.add(prism)

    const light1 = new THREE.PointLight(0x00f5d4, 2, 10)
    light1.position.set(2, 2, 2)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xb9a7ff, 2, 10)
    light2.position.set(-2, -2, 2)
    scene.add(light2)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2
      mouseY = e.clientY - window.innerHeight / 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    let animId: number
    const animate = () => {
      const targetX = mouseX * 0.001
      const targetY = mouseY * 0.001
      prism.rotation.y += 0.005 + (targetX - prism.rotation.y) * 0.05
      prism.rotation.x += 0.005 + (targetY - prism.rotation.x) * 0.05
      wireframe.rotation.y = prism.rotation.y
      wireframe.rotation.x = prism.rotation.x
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#F0EEE9]">
      <div ref={mountRef} className="w-full h-full cursor-crosshair outline-none" />
    </div>
  )
}

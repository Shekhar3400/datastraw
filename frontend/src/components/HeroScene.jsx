/**
 * Three.js / React Three Fiber animated hero scene.
 * Renders a floating holographic orb with orbiting rings and particles.
 */
import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Torus, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Orbiting ring ────────────────────────────────────────────────────────────
function OrbitRing({ radius, speed, color, tilt = 0 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += delta * speed
  })
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <Torus args={[radius, 0.015, 16, 100]}>
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </Torus>
    </group>
  )
}

// ─── Central holographic orb ──────────────────────────────────────────────────
function HoloOrb() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
  })
  return (
    <group ref={ref}>
      {/* Outer glow sphere */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.04} wireframe />
      </Sphere>
      {/* Core sphere */}
      <Sphere args={[0.9, 64, 64]}>
        <meshStandardMaterial
          color="#0a1628"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </Sphere>
      {/* Inner glow */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.15} />
      </Sphere>
    </group>
  )
}

// ─── Floating particles ───────────────────────────────────────────────────────
function Particles({ count = 800 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [count])

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.04
    ref.current.rotation.x = state.clock.elapsedTime * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  )
}

// ─── Scene composition ────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />

      <HoloOrb />

      <OrbitRing radius={1.8} speed={0.6} color="#00d4ff" tilt={0.3} />
      <OrbitRing radius={2.4} speed={-0.4} color="#7c3aed" tilt={1.1} />
      <OrbitRing radius={3.0} speed={0.25} color="#f472b6" tilt={0.7} />

      <Particles count={600} />
    </>
  )
}

// ─── Exported canvas wrapper ──────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

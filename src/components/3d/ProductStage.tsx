"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { AntigravityInner } from "@/components/effects/Antigravity";

function ProductMesh() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Rotate mesh slowly
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} castShadow receiveShadow>
                <boxGeometry args={[2.5, 3.5, 0.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1}
                />
                {/* Screen/face for detail */}
                <mesh position={[0, 0, 0.26]}>
                    <planeGeometry args={[2.3, 3.3]} />
                    <meshBasicMaterial color="#000" />
                </mesh>
                {/* Glowing border/rim */}
                <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 1.02]}>
                    <boxGeometry args={[2.5, 3.5, 0.5]} />
                    <meshBasicMaterial color="#3B82F6" wireframe />
                </mesh>
            </mesh>
        </Float>
    );
}

export default function ProductStage() {
    return (
        <div className="h-full w-full absolute inset-0 z-0">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

                {/* Background Particles */}
                <group position={[0, 0, -10]} scale={[5, 5, 5]}>
                    <AntigravityInner
                        count={150}
                        color="#3B82F6"
                        magnetRadius={2}
                        particleSize={0.3}
                        fieldStrength={5}
                    />
                </group>

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3B82F6" />

                {/* Environment for reflections */}
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <ProductMesh />
                </Suspense>

                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}

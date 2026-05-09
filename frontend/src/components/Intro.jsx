import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ isZooming }) {
    const meshRef = useRef();
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
            
            if (isZooming) {
                // Zoom effect: move the camera closer or scale the planet up
                state.camera.position.z -= delta * 15;
                if (state.camera.position.z < 2) {
                    state.camera.position.z = 2;
                }
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial 
                color="#8b1919" 
                emissive="#ffb3ac"
                emissiveIntensity={0.2}
                wireframe={true}
            />
        </mesh>
    );
}

export default function Intro({ onComplete }) {
    const [isZooming, setIsZooming] = useState(false);
    const [textVisible, setTextVisible] = useState(true);

    const handleEnter = () => {
        setIsZooming(true);
        setTextVisible(false);
        
        // Transition to main site after zoom completes
        setTimeout(() => {
            onComplete();
        }, 2000); // 2 seconds for zoom
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center">
            <div className="absolute inset-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
                    <Planet isZooming={isZooming} />
                </Canvas>
            </div>

            {textVisible && (
                <div className="relative z-10 flex flex-col items-center gap-8 text-center">
                    <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.2em]">
                        Establish Connection...
                    </div>
                    <h1 className="text-[48px] md:text-[64px] text-white font-black uppercase leading-tight tracking-tighter">
                        SW:RP
                    </h1>
                    <p className="font-mono text-[14px] text-[#c4c7c8] uppercase tracking-[0.15em] max-w-md">
                        The galaxy is at war. Choose your side.
                    </p>
                    <button
                        onClick={handleEnter}
                        className="mt-4 bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300"
                    >
                        Enter Archives
                    </button>
                </div>
            )}

            {isZooming && (
                <div className="absolute bottom-10 left-10 font-mono text-[10px] text-[#ffb3ac] uppercase tracking-[0.2em] animate-pulse">
                    HYPERDRIVE: ACTIVE
                </div>
            )}
        </div>
    );
}

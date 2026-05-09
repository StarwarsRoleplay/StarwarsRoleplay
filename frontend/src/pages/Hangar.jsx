import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GAME_LINK, GROUP_LINK } from '../constants';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function StormtrooperModel() {
    const { scene } = useGLTF('/images/3d/stormtrooper.glb');
    return (
        <primitive 
            object={scene} 
            scale={37.5}
            position={[0, -2, 0]}
        />
    );
}

export default function Hangar() {
    return (
        <section className="relative w-full h-[85vh] flex items-center bg-venator border-b border-white/10">
            <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                    <h1 className="text-4xl sm:text-5xl md:text-[100px] lg:text-[120px] text-white font-black uppercase tracking-[-0.04em] leading-[0.9]">
                        STAR WARS<br />
                        ROLEPLAY
                    </h1>

                    <p className="font-mono text-[14px] text-[#c4c7c8] max-w-2xl border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px]">
                        A LONG TIME AGO IN A GALAXY FAR, FAR AWAY... THE GALAXY IS IN TURMOIL. THE SEPARATIST THREAT LOOMS OVER THE CORE WORLDS. ANSWER THE CALL OF THE SUPREME CHANCELLOR. DEPLOY YOUR SQUADRON. MAY THE FORCE BE WITH YOU.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <a
                            href={GAME_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 w-fit flex items-center gap-2 group justify-center"
                        >
                            Deploy Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href={GROUP_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-transparent border border-white/20 text-white font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-white/5 transition-all duration-300 w-fit text-center"
                        >
                            Join the Republic
                        </a>
                    </div>
                </div>
                
                <div className="col-span-12 md:col-span-4 flex items-center justify-center h-[400px] md:h-full">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <pointLight position={[-10, -10, -10]} intensity={1} color="#8b1919" />
                        <StormtrooperModel />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                    </Canvas>
                </div>
            </div>

            {/* Structural HUD Elements */}
            <div className="absolute bottom-8 left-6 md:left-16 hidden md:flex items-center gap-4 font-mono text-[12px] font-medium tracking-[0.15em] text-[#c4c7c8]/50 uppercase">
                <span>HYPERDRIVE: <span className="text-white">ACTIVE</span></span>
                <span className="w-1 h-1 bg-white/20"></span>
                <span>SHIELDS: <span className="text-[#8b1919]">DEFLECTING</span></span>
            </div>
        </section>
    );
}

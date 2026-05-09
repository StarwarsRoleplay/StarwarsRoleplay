import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

const RANK_ORDER = [
    'SWRP : Project Lead',
    'Manager',
    'Team Management',
    'Administrator',
    'Head Game Moderator',
    'Game Moderator',
    'Test Game Moderator',
    'Developer'
];

function CloneHelmetModel() {
    const { scene } = useGLTF('/images/3d/clone_trooper_helmet.glb');
    return (
        <primitive 
            object={scene} 
            scale={2.5}
        />
    );
}

export default function Staff() {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                // Fetch from Cloudflare Worker
                const response = await fetch('https://swrp.thatzane.workers.dev/api/v1/staff');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch staff data');
                }
                const data = await response.json();
                setStaff(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16 bg-[#050505]">
            {/* 3D Model */}
            <div className="w-full h-[200px] bg-[#0a0a0a] border border-zinc-800">
                <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#8b1919" />
                    <CloneHelmetModel />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
                </Canvas>
            </div>

            <div className="flex flex-col gap-2 border-l-4 border-[#8b1919] pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    SECURE HOLONET TRANSMISSION
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight tracking-wider">
                    Command Structure
                </h2>
                <p className="text-zinc-500 text-xs font-mono"> PERSONNEL DATABASE // ACCESS GRANTED</p>
            </div>

            {loading && (
                <div className="font-mono text-[14px] text-[#c4c7c8] flex items-center gap-2">
                    <span className="animate-pulse w-3 h-3 bg-[#8b1919]"></span>
                    Decrypting staff records...
                </div>
            )}

            {error && (
                <div className="font-mono text-[14px] text-[#8b1919] border border-[#8b1919]/30 p-4 bg-[#8b1919]/5">
                    ERROR: {error}
                </div>
            )}

            {staff && (
                <div className="flex flex-col gap-16">
                    {/* Website Maintainer Special Section */}
                    {staff["Website Maintainer"] && staff["Website Maintainer"][0] && (
                        <div className="relative group bg-[#0d0a0a] border border-[#8b1919]/30 p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:border-[#8b1919]/60"
                             style={{
                                 clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
                             }}
                        >
                            {/* Corner glow */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#8b1919] opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
                                 style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
                            
                            {/* Avatar */}
                            <div className="relative w-20 h-20 shrink-0">
                                <div className="absolute inset-0 border-2 border-[#8b1919]"></div>
                                {staff["Website Maintainer"][0].avatarUrl ? (
                                    <img src={staff["Website Maintainer"][0].avatarUrl} alt={staff["Website Maintainer"][0].displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#151515] flex items-center justify-center font-mono text-sm text-zinc-700">
                                        N/A
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2 flex-1 text-center md:text-left">
                                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em]">
                                    System Developer & Maintainer
                                </div>
                                <h3 className="text-2xl text-white font-bold uppercase tracking-wide">
                                    {staff["Website Maintainer"][0].displayName}
                                </h3>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-zinc-400 text-sm font-mono">
                                    <span>@{staff["Website Maintainer"][0].name}</span>
                                    <span className="hidden md:inline text-zinc-700">//</span>
                                    <span className="text-[#8b1919] font-bold">Discord: @thatzane</span>
                                </div>
                                <p className="text-zinc-500 text-xs mt-1">
                                    Contact me directly for website issues, bugs, or feature requests.
                                </p>
                            </div>
                        </div>
                    )}

                    {RANK_ORDER.map(rank => {
                        const members = staff[rank] || [];
                        if (members.length === 0) return null;
                        
                        return (
                            <div key={rank} className="flex flex-col gap-6">
                                {/* Rank Header */}
                                <div className="flex items-center gap-4">
                                    <div className="font-mono text-[12px] font-bold text-white uppercase tracking-widest px-4 py-1 bg-[#8b1919]/10 border border-[#8b1919]/20 relative">
                                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#8b1919]"></div>
                                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#8b1919]"></div>
                                        {rank}
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-[#8b1919]/30 to-transparent"></div>
                                </div>

                                {/* Members Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {members.map(member => (
                                        <div key={member.id} 
                                             className="relative group bg-[#0a0a0a] border border-white/5 p-4 flex items-center gap-4 transition-all duration-300 hover:border-[#8b1919]/40 hover:bg-[#0d0a0a]"
                                             style={{
                                                 clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
                                             }}
                                        >
                                            {/* Corner glow effect on hover */}
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#8b1919] opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                                 style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
                                            
                                            {/* Avatar */}
                                            <div className="relative w-12 h-12 shrink-0">
                                                <div className="absolute inset-0 border border-[#8b1919]/30 group-hover:border-[#8b1919] transition-colors duration-300"></div>
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#151515] flex items-center justify-center font-mono text-xs text-zinc-700">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-white font-medium truncate group-hover:text-[#8b1919] transition-colors duration-300">
                                                    {member.displayName}
                                                </span>
                                                <span className="text-[#52525b] text-[11px] font-mono truncate">
                                                    @{member.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

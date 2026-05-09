import React, { useState, useEffect } from 'react';

const RANK_ORDER = [
    'Ownership',
    'SWRP : Project Lead',
    'Manager',
    'Team Management',
    'Administrator',
    'Head Game Moderator',
    'Game Moderator',
    'Test Game Moderator',
    'Developer'
];

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

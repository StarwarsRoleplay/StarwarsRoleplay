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
                // Try relative path first (good for production or proxy)
                // Fallback to localhost:5000 if needed (good for local dev)
                let response;
                try {
                    response = await fetch('/api/v1/staff');
                } catch (e) {
                    console.log('Relative fetch failed, trying localhost:5000');
                    response = await fetch('http://localhost:5000/api/v1/staff');
                }
                
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
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    COMMAND STRUCTURE
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Staff Members
                </h2>
            </div>

            {loading && (
                <div className="font-mono text-[14px] text-[#c4c7c8]">Loading data from Holonet...</div>
            )}

            {error && (
                <div className="font-mono text-[14px] text-[#8b1919]">Error: {error}</div>
            )}

            {staff && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {RANK_ORDER.map(rank => {
                        const members = staff[rank] || [];
                        if (members.length === 0) return null;
                        
                        return (
                            <div key={rank} className="flex flex-col gap-4 border border-white/10 p-6 bg-[#0e0e0e]">
                                <div className="font-mono text-[12px] font-medium text-[#8b1919] uppercase tracking-[0.15em]">
                                    {rank}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {members.map(member => (
                                        <div key={member.id} className="flex justify-between items-center">
                                            <span className="text-white font-medium">{member.displayName}</span>
                                            <span className="text-[#8e9192] text-[12px]">@{member.name}</span>
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

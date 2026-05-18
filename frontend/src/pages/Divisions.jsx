import React, { useState } from 'react';
import {
    Shield,
    Crosshair,
    Terminal as TerminalIcon,
    Swords,
    Landmark,
    Star,
    Activity,
    Fingerprint,
    Compass,
    X,
    ArrowRight
} from 'lucide-react';
import { FACTIONS } from '../constants';

const ICON_MAP = {
    rg: Shield,
    '41st': Compass,
    rc: TerminalIcon,
    arc: Activity,
    '401st': Crosshair,
    cadet: Star,
    senate: Landmark,
    '91st': Compass,
    riia: Fingerprint,
    sg: Shield,
    '212th': Swords,
};

const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'infantry', name: 'Infantry' },
    { id: 'specops', name: 'Special Forces' },
    { id: 'security', name: 'Security Forces' },
    { id: 'senate_academy', name: 'Senate & Academy' }
];

const CATEGORY_LABELS = {
    infantry: "Infantry",
    specops: "Special Forces",
    security: "Security Forces",
    senate_academy: "Senate & Academy"
};

export default function Divisions() {
    const [selectedFaction, setSelectedFaction] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return FACTIONS.length;
        return FACTIONS.filter(f => f.category === categoryId).length;
    };

    const filteredFactions = activeCategory === 'all'
        ? FACTIONS
        : FACTIONS.filter(faction => faction.category === activeCategory);

    return (
        <section id="divisions" className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-l-4 border-white pl-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-[32px] leading-[40px] text-white font-bold uppercase tracking-tight">
                        GRAND ARMY DIVISIONS
                    </h2>
                    <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">
                        Choose your battalion and secure the sector.
                    </span>
                </div>
            </div>

            {/* Futuristic Category Filter Bar */}
            <div className="flex flex-wrap gap-2 md:gap-4 border-b border-white/10 pb-8">
                {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const count = getCategoryCount(cat.id);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`group relative px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-3 border ${
                                isActive
                                    ? 'bg-[#8b1919] border-[#8b1919] text-white shadow-[0_0_20px_rgba(139,25,25,0.35)]'
                                    : 'bg-[#121212]/80 border-white/10 text-[#c4c7c8] hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {isActive && (
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            )}
                            <span>{cat.name}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold font-mono transition-colors duration-300 ${
                                isActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-white/5 text-[#8b1919] group-hover:bg-[#8b1919] group-hover:text-white'
                            }`}>
                                {count}
                            </span>

                            {isActive && (
                                <>
                                    <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white"></span>
                                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white"></span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500">
                {filteredFactions.map((faction) => {
                    const FactionIcon = ICON_MAP[faction.id] || Shield;
                    return (
                        <div
                            key={faction.id}
                            className="group relative bg-[#121212] border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/50 flex flex-col h-full cursor-pointer animate-fadeIn"
                            onClick={() => setSelectedFaction(faction)}
                        >

                            {/* Corner Brackets (Hover) */}
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2"></div>

                            {/* Image Area */}
                            <div className="relative h-64 w-full overflow-hidden border-b border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10 h-full bottom-0"></div>
                                <img
                                    alt={faction.name}
                                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"
                                    src={`/images/divisions/${faction.id}.png`}
                                />
                                <div className="absolute top-4 right-4 z-20 text-white/20 group-hover:text-white/80 transition-colors duration-500">
                                    <FactionIcon className="w-8 h-8" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex flex-col flex-grow justify-between gap-6 relative z-20 bg-[#121212]">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[#8b1919]"></span>
                                            CLASS {faction.code}
                                        </div>
                                        <span className="font-mono text-[9px] font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-wider">
                                            {CATEGORY_LABELS[faction.category]}
                                        </span>
                                    </div>
                                    <h3 className="text-[24px] text-white font-bold uppercase leading-tight group-hover:text-[#8b1919] transition-colors pr-4">
                                        {faction.name}
                                    </h3>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                    <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">STRENGTH</span>
                                    <span className="font-mono text-[14px] text-white">{faction.members.toLocaleString()} Units</span>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Faction Modal */}
            {selectedFaction && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#121212] border border-white/10 max-w-2xl w-full relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Corner Brackets */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white m-2"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white m-2"></div>

                        <button
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedFaction(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8 flex flex-col gap-6">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#8b1919]"></span>
                                        CLASS {selectedFaction.code}
                                    </div>
                                    <span className="font-mono text-[10px] font-bold text-white/50 bg-white/5 border border-white/10 px-2.5 py-0.5 uppercase tracking-wider">
                                        {CATEGORY_LABELS[selectedFaction.category]}
                                    </span>
                                </div>
                                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                                    {selectedFaction.name}
                                </h2>
                            </div>

                            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px]">
                                {selectedFaction.description || "No lore available."}
                            </div>

                            <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                <div>
                                    <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">STRENGTH</span>
                                    <div className="font-mono text-[18px] text-white">{selectedFaction.members.toLocaleString()} Units</div>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">ENLISTMENT</span>
                                    <div className="font-mono text-[18px] text-[#8b1919] font-bold">
                                        {selectedFaction.gamepassLink ? "PREMIUM" : "GROUP ONLY"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {selectedFaction.gamepassLink ? (
                                    <a
                                        href={selectedFaction.gamepassLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 w-full flex items-center justify-center gap-2 group"
                                    >
                                        Buy Gamepass
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                ) : (
                                    <a
                                        href={`https://www.roblox.com/communities/${selectedFaction.groupId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 w-full flex items-center justify-center gap-2 group"
                                    >
                                        Join Group
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedFaction(null)}
                                    className="bg-transparent border border-white/20 text-white font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-white/5 transition-all duration-300 w-full"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

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

export default function Divisions() {
    const [selectedFaction, setSelectedFaction] = useState(null);

    return (
        <section id="divisions" className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <h2 className="text-[32px] leading-[40px] text-white font-bold uppercase tracking-tight">
                    GRAND ARMY DIVISIONS
                </h2>
                <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">
                    Choose your battalion and secure the sector.
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {FACTIONS.map((faction) => {
                    const FactionIcon = ICON_MAP[faction.id] || Shield;
                    return (
                        <div
                            key={faction.id}
                            className="group relative bg-[#121212] border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/50 flex flex-col h-full cursor-pointer"
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
                                    <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#8b1919]"></span>
                                        CLASS {faction.code}
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
                                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                                    CLASS {selectedFaction.code}
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

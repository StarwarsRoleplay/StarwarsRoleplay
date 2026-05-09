import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { GAME_LINK, GROUP_LINK } from '../constants';

export default function Hangar() {
    const items = [
        {
            type: "NEWS",
            title: "Sector 4 Update",
            desc: "New security protocols active. Check your clearance level.",
            image: "[ TRANSMISSION IMAGE ]"
        },
        {
            type: "STORE",
            title: "DC-15A Blaster",
            desc: "Standard issue rifle now available for all recruits.",
            image: "[ EQUIPMENT IMAGE ]"
        },
        {
            type: "EVENT",
            title: "Citadel Operation",
            desc: "Join the joint operation this weekend at 18:00 EST.",
            image: "[ EVENT IMAGE ]"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

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
                
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6 bg-[#0a0a0a]/80 border border-white/10 p-6 backdrop-blur-sm h-[500px]">
                    <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#8b1919] animate-pulse"></span>
                        INCOMING TRANSMISSIONS
                    </div>
                    <h3 className="text-xl text-white font-bold uppercase tracking-wide border-b border-white/10 pb-2">
                        Recommended
                    </h3>
                    
                    {/* Auto-switching featured item */}
                    <div className="group relative flex flex-col gap-4 bg-[#151515] border border-white/5 hover:border-[#8b1919]/50 transition-all duration-500 p-4 cursor-pointer h-full justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="aspect-video bg-[#202020] overflow-hidden relative">
                                <div className="w-full h-full bg-[#303030] flex items-center justify-center text-zinc-700 font-mono text-xs">
                                    {items[activeIndex].image}
                                </div>
                                <div className="absolute top-2 left-2 bg-[#8b1919] text-white font-mono text-[10px] px-2 py-1">
                                    {items[activeIndex].type}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <h4 className="text-lg text-white font-bold group-hover:text-[#8b1919] transition-colors duration-300">
                                    {items[activeIndex].title}
                                </h4>
                                <p className="text-sm text-zinc-400 line-clamp-3">
                                    {items[activeIndex].desc}
                                </p>
                            </div>
                        </div>

                        {/* Indicators */}
                        <div className="flex gap-2 justify-center mt-auto">
                            {items.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-[#8b1919] w-4' : 'bg-zinc-700 hover:bg-zinc-500'}`}
                                />
                            ))}
                        </div>
                    </div>
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

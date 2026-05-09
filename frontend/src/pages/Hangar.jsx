import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GAME_LINK, GROUP_LINK } from '../constants';

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
                
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6 bg-[#0a0a0a]/80 border border-white/10 p-6 backdrop-blur-sm h-[500px]">
                    <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#8b1919] animate-pulse"></span>
                        INCOMING TRANSMISSIONS
                    </div>
                    <h3 className="text-xl text-white font-bold uppercase tracking-wide border-b border-white/10 pb-2">
                        Recommended
                    </h3>
                    
                    {/* Netflix-like list */}
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Item 1 */}
                        <div className="group relative flex flex-col gap-2 bg-[#151515] border border-white/5 hover:border-[#8b1919]/50 transition-all duration-300 p-3 cursor-pointer">
                            <div className="aspect-video bg-[#202020] overflow-hidden">
                                <div className="w-full h-full bg-[#303030] flex items-center justify-center text-zinc-700 font-mono text-xs">
                                    [ TRANSMISSION IMAGE ]
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] text-[#8b1919]">NEWS</span>
                                <h4 className="text-sm text-white font-bold group-hover:text-[#8b1919] transition-colors">Sector 4 Update</h4>
                                <p className="text-xs text-zinc-500 line-clamp-2">New security protocols active. Check your clearance level.</p>
                            </div>
                        </div>
                        
                        {/* Item 2 */}
                        <div className="group relative flex flex-col gap-2 bg-[#151515] border border-white/5 hover:border-[#8b1919]/50 transition-all duration-300 p-3 cursor-pointer">
                            <div className="aspect-video bg-[#202020] overflow-hidden">
                                <div className="w-full h-full bg-[#303030] flex items-center justify-center text-zinc-700 font-mono text-xs">
                                    [ EQUIPMENT IMAGE ]
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] text-[#8b1919]">STORE</span>
                                <h4 className="text-sm text-white font-bold group-hover:text-[#8b1919] transition-colors">DC-15A Blaster</h4>
                                <p className="text-xs text-zinc-500 line-clamp-2">Standard issue rifle now available for all recruits.</p>
                            </div>
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

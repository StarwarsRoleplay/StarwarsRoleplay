import React, { useState, useEffect } from 'react';
import {
    Bell,
    Terminal,
    ArrowRight,
    Shield,
    Crosshair,
    Users,
    Swords,
    Landmark,
    Star,
    Activity,
    Fingerprint,
    Compass
} from 'lucide-react';

// --- ICON MAPPING ---
const ICON_MAP = {
    rg: Shield,
    '41st': Compass,
    rc: Terminal,
    arc: Activity,
    '401st': Crosshair,
    cadet: Star,
    senate: Landmark,
    '91st': Compass,
    riia: Fingerprint,
    sg: Shield,
    '212th': Swords,
};

// Reliable high-quality sci-fi imagery for the cards
const CARD_IMAGES = [
    "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581822261290-991b38693d1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533587851505-d119e13bf0b4?auto=format&fit=crop&w=800&q=80"
];

const GAME_LINK = "https://www.roblox.com/games/127198433562944/Coruscant-Roleplay";
const GROUP_LINK = "https://www.roblox.com/communities/866453521/Star-Wars-Roleplay#!/affiliates";

export default function App() {
    const [factions, setFactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/factions')
            .then(res => res.json())
            .then(data => {
                setFactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching factions:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#8b1919] selection:text-white antialiased font-inter">

            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
                <div className="flex justify-between items-center w-full px-6 md:px-16 h-20 max-w-[1440px] mx-auto">
                    <div className="text-[32px] font-black tracking-tighter text-white">
                        CORUSCANT RP
                    </div>

                    <nav className="hidden md:flex gap-8 items-center font-mono text-[12px] uppercase tracking-[0.15em] font-medium text-[#c4c7c8]">
                        <a className="text-white border-b-2 border-[#8b1919] pb-1 hover:text-white hover:bg-white/5 transition-colors" href="#">Hangar</a>
                        <a className="hover:text-white hover:bg-white/5 transition-colors pb-1" href="#divisions">Divisions</a>
                        <a className="hover:text-white hover:bg-white/5 transition-colors pb-1" href={GROUP_LINK} target="_blank" rel="noreferrer">Commnet</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-4 text-[#c4c7c8]">
                            <button className="hover:text-white transition-colors flex items-center justify-center p-2">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="hover:text-white transition-colors flex items-center justify-center p-2">
                                <Terminal className="w-5 h-5" />
                            </button>
                        </div>
                        <a
                            href={GAME_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-6 py-3 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300"
                        >
                            Deploy Now
                        </a>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative w-full h-[85vh] flex items-center bg-venator border-b border-white/10">
                    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                            <h1 className="text-5xl md:text-[100px] lg:text-[120px] text-white font-black uppercase tracking-[-0.04em] leading-[0.9]">
                                STAR WARS:<br />
                                CORUSCANT ROLEPLAY
                            </h1>

                            <p className="font-mono text-[14px] text-[#c4c7c8] max-w-2xl border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px]">
                                INITIALIZING GRAND ARMY PROTOCOLS. DEPLOY TO THE HEART OF THE REPUBLIC. TACTICAL IMMERSION AWAITS IN SECTOR ZERO.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <a
                                    href={GAME_LINK}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 w-fit flex items-center gap-2 group"
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
                    </div>

                    {/* Structural HUD Elements */}
                    <div className="absolute bottom-8 left-6 md:left-16 hidden md:flex items-center gap-4 font-mono text-[12px] font-medium tracking-[0.15em] text-[#c4c7c8]/50 uppercase">
                        <span>SYS.STAT: <span className="text-white">ONLINE</span></span>
                        <span className="w-1 h-1 bg-white/20"></span>
                        <span>SEC.GRID: <span className="text-[#8b1919]">ACTIVE</span></span>
                    </div>
                </section>

                {/* Divisions Section */}
                <section id="divisions" className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
                    <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                        <h2 className="text-[32px] leading-[40px] text-white font-bold uppercase tracking-tight">
                            ACTIVE DIVISIONS
                        </h2>
                        <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">
                            Select deployment sector
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            <div className="text-white font-mono">Loading data...</div>
                        ) : (
                            factions.map((faction, index) => {
                                const FactionIcon = ICON_MAP[faction.id] || Shield;
                                return (
                                    <div key={faction.id} className="group relative bg-[#121212] border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/50 flex flex-col h-full cursor-pointer">

                                        {/* Corner Brackets (Hover) */}
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2"></div>

                                        {/* Image Area */}
                                        <div className="relative h-64 w-full overflow-hidden border-b border-white/10">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10 h-full bottom-0"></div>
                                            <img
                                                alt={faction.name}
                                                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"
                                                src={CARD_IMAGES[index % CARD_IMAGES.length]}
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
                            })
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-[#0e0e0e] border-t border-white/10">
                <div className="flex flex-col lg:flex-row justify-between items-center py-12 px-6 md:px-16 w-full max-w-[1440px] mx-auto gap-8 lg:gap-0">
                    <div className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em] text-center lg:text-left">
                        © {new Date().getFullYear()} GRAND ARMY OF THE REPUBLIC. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 font-mono text-[14px] text-[#8e9192]">
                        <a className="hover:text-[#ffb3ac] transition-colors" href="#">Enlistment Privacy</a>
                        <a className="hover:text-[#ffb3ac] transition-colors" href="#">Sector Security Protocols</a>
                        <a className="hover:text-[#ffb3ac] transition-colors" href="#">Holonet Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

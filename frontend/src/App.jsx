import React, { useState } from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
} from 'react-router-dom';
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

// --- ICON MAPPING ---
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

const GAME_LINK = "https://www.roblox.com/games/127198433562944/Coruscant-Roleplay";
const GROUP_LINK = "https://www.roblox.com/communities/866453521/Star-Wars-Roleplay";
const DISCORD_LINK = "https://discord.gg/46nvXHe8Ax";

const FACTIONS = [
    { id: 'rg', name: "Red Guards", members: 17, type: "Elite Guard", code: "AX-01", groupId: '734074037', description: "The elite protectors of the Supreme Chancellor and the Senate. Clad in distinctive red armor, they are the most loyal and lethal guards in the Republic.", gamepassLink: null },
    { id: '41st', name: "41st Elite Corps", members: 13, type: "Infantry", code: "INF-41", groupId: '353784713', description: "Specialized in long-range operations and planetary scouting. Known for their camouflage armor and expertise in harsh environments like Kashyyyk.", gamepassLink: null },
    { id: 'rc', name: "Rep. Commandos", members: 22, type: "Special Forces", code: "SPEC-RC", groupId: '1085075157', description: "Elite special forces units operating in four-man squads. They handle the most dangerous covert operations, sabotage, and assassination missions.", gamepassLink: null },
    { id: 'arc', name: "Advanced Recon", members: 12, type: "Reconnaissance", code: "RCN-A", groupId: '848398756', description: "Highly independent ARC Troopers trained for complex reconnaissance and unconventional warfare. They operate with high autonomy.", gamepassLink: null },
    { id: '401st', name: "Coruscant Guards", members: 12, type: "Security", code: "SEC-401", groupId: '445428424', description: "The military police and security force for the capital planet. They maintain order, protect government installations, and handle prisoner transport.", gamepassLink: "https://www.roblox.com/game-pass/1747600338/[TEAM]-Coruscant-Guard" },
    { id: 'cadet', name: "Cadet Academy", members: 3, type: "Training", code: "TRN-00", groupId: '880407964', description: "The training ground for the next generation of clones. Cadets undergo rigorous combat and tactical training before deployment.", gamepassLink: null },
    { id: 'senate', name: "Galactic Senate", members: 3, type: "Government", code: "GOV-01", groupId: '1109103792', description: "The political heart of the Republic. Senators and representatives debate policy, while security forces ensure their safety.", gamepassLink: null },
    { id: '91st', name: "91st Mobile Recon", members: 6, type: "Reconnaissance", code: "RCN-91", groupId: '139410049', description: "A highly mobile reconnaissance unit specialized in speeder bike operations and rapid deployment behind enemy lines.", gamepassLink: null },
    { id: 'riia', name: "Rep. Intelligence", members: 9, type: "Intelligence", code: "INT-R", groupId: '645269431', description: "The covert branch handling espionage, code-breaking, and counter-intelligence to protect Republic secrets.", gamepassLink: null },
    { id: 'sg', name: "Senate Guards", members: 5, type: "Elite Guard", code: "AX-02", groupId: '602172556', description: "The traditional security force of the Senate Plaza. They wear blue robes and carry non-lethal weapons for crowd control.", gamepassLink: null },
    { id: '212th', name: "212th Attack Bat.", members: 19, type: "Assault", code: "AST-212", groupId: '354790445', description: "An elite assault unit known for siege operations and heavy combat. Led by Commander Cody and General Kenobi.", gamepassLink: "https://www.roblox.com/game-pass/1747544350/[TEAM]-212th-Attack-Battalion" },
];

function Navigation() {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path ? 'text-white border-b-2 border-[#8b1919] pb-1' : 'hover:text-white hover:bg-white/5 transition-colors pb-1';
    };

    return (
        <nav className="hidden md:flex gap-8 items-center font-mono text-[12px] uppercase tracking-[0.15em] font-medium text-[#c4c7c8]">
            <Link className={isActive('/')} to="/">Hangar</Link>
            <Link className={isActive('/divisions')} to="/divisions">Divisions</Link>
            <Link className={isActive('/holonet')} to="/holonet">Holonet</Link>
        </nav>
    );
}

function HangarPage() {
    return (
        <section className="relative w-full h-[85vh] flex items-center bg-venator border-b border-white/10">
            <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                    <h1 className="text-5xl md:text-[100px] lg:text-[120px] text-white font-black uppercase tracking-[-0.04em] leading-[0.9]">
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
                <span>HYPERDRIVE: <span className="text-white">ACTIVE</span></span>
                <span className="w-1 h-1 bg-white/20"></span>
                <span>SHIELDS: <span className="text-[#8b1919]">DEFLECTING</span></span>
            </div>
        </section>
    );
}

function DivisionsPage() {
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
                {FACTIONS.map((faction, index) => {
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
                    <div className="bg-[#121212] border border-white/10 max-w-2xl w-full relative overflow-hidden">
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

function HolonetPage() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    COMMUNICATION HUB
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Establish Holonet Link
                </h2>
            </div>

            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px] max-w-2xl">
                Transmit your coordinates to the Jedi Council and connect with the fleet. Our primary Holonet frequency is hosted on Discord. Join us to receive deployment orders, participate in events, and chat with other troopers.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 max-w-md">
                <a
                    href={DISCORD_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#5865F2] hover:text-white transition-all duration-300 w-full flex items-center justify-center gap-2 group"
                >
                    Connect to Discord
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </section>
    );
}

export default function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#8b1919] selection:text-white antialiased font-inter">

                {/* TopNavBar */}
                <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex justify-between items-center w-full px-6 md:px-16 h-20 max-w-[1440px] mx-auto">
                        <div className="text-[32px] font-black tracking-tighter text-white">
                            STAR WARS RP
                        </div>

                        <Navigation />

                        <div className="flex items-center gap-4">
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
                    <Routes>
                        <Route path="/" element={<HangarPage />} />
                        <Route path="/divisions" element={<DivisionsPage />} />
                        <Route path="/holonet" element={<HolonetPage />} />
                    </Routes>
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
        </Router>
    );
}

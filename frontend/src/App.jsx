import React from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import Navigation from './components/Navigation';
import Hangar from './pages/Hangar';
import Divisions from './pages/Divisions';
import Holonet from './pages/Holonet';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import Terms from './pages/Terms';
import { GAME_LINK } from './constants';

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
                        <Route path="/" element={<Hangar />} />
                        <Route path="/divisions" element={<Divisions />} />
                        <Route path="/holonet" element={<Holonet />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/terms" element={<Terms />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="w-full bg-[#0e0e0e] border-t border-white/10">
                    <div className="flex flex-col lg:flex-row justify-between items-center py-12 px-6 md:px-16 w-full max-w-[1440px] mx-auto gap-8 lg:gap-0">
                        <div className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em] text-center lg:text-left">
                            © {new Date().getFullYear()} GRAND ARMY OF THE REPUBLIC. ALL RIGHTS RESERVED.
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 font-mono text-[14px] text-[#8e9192]">
                            <Link className="hover:text-[#ffb3ac] transition-colors" to="/privacy">Privacy Policy</Link>
                            <Link className="hover:text-[#ffb3ac] transition-colors" to="/legal">Legal Notice</Link>
                            <Link className="hover:text-[#ffb3ac] transition-colors" to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

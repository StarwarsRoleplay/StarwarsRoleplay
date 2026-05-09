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
import Lore from './pages/Lore';
import Staff from './pages/Staff';
import Rules from './pages/Rules';
import Login from './pages/Login';
import LoreAdmin from './pages/LoreAdmin';
import LoreEditor from './pages/LoreEditor';
import RecommendedAdmin from './pages/RecommendedAdmin';
import { GAME_LINK } from './constants';

export default function App() {
    const [user] = React.useState(() => {
        const token = localStorage.getItem('swrp_token');
        if (token) {
            try {
                const payloadBase64 = token.split('.')[0];
                const payload = JSON.parse(atob(payloadBase64));
                return payload.user;
            } catch (e) {
                console.error('Failed to parse token', e);
            }
        }
        return null;
    });
    const [avatarUrl, setAvatarUrl] = React.useState(null);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    React.useEffect(() => {
        // Check for OAuth code in URL (GitHub Pages fallback)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            // Clear search params from URL bar so it doesn't loop on reload
            window.history.replaceState({}, '', window.location.pathname);
            // Redirect to the hash route
            window.location.href = `https://swrp.me/#/login?code=${code}`;
            return;
        }

        if (user) {
            // Fetch avatar via proxy to avoid CORS
            fetch(`https://swrp.thatzane.workers.dev/api/v1/proxy/avatar?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data[0]) {
                        setAvatarUrl(data.data[0].imageUrl);
                    }
                })
                .catch(e => console.error('Failed to fetch avatar', e));
        }
    }, [user]);

    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#8b1919] selection:text-white antialiased font-inter">

                {/* TopNavBar */}
                <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex justify-between items-center w-full px-6 md:px-16 h-20 max-w-[1440px] mx-auto">
                        <div className="text-[32px] font-black tracking-tighter text-white">
                            SW:RP
                        </div>

                        <Navigation />

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-3 text-white font-mono text-[12px] uppercase tracking-[0.15em] hover:text-[#8b1919] transition-colors"
                                    >
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-sm border border-[#8b1919]" />
                                        ) : (
                                            <div className="w-8 h-8 bg-[#151515] flex items-center justify-center rounded-sm border border-[#8b1919] font-mono text-[10px]">
                                                {user.displayName[0]}
                                            </div>
                                        )}
                                        <span>{user.displayName}</span>
                                        <svg className={`w-4 h-4 fill-current transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </button>
                                    {/* Dropdown */}
                                    <div className={`absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-zinc-800 ${dropdownOpen ? 'block' : 'hidden'} z-50 shadow-xl`}
                                         style={{
                                             clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                                         }}
                                    >
                                        <Link 
                                            to="/lore-admin" 
                                            className="block px-4 py-3 text-xs text-white hover:bg-[#8b1919] font-mono uppercase"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Lore Admin
                                        </Link>
                                        <Link 
                                             to="/admin/recommended" 
                                             className="block px-4 py-3 text-xs text-white hover:bg-[#8b1919] font-mono uppercase border-t border-zinc-900"
                                             onClick={() => setDropdownOpen(false)}
                                         >
                                             Recommended Admin
                                         </Link>
                                        <button 
                                            onClick={() => {
                                                localStorage.removeItem('swrp_token');
                                                window.location.reload();
                                            }}
                                            className="w-full text-left block px-4 py-3 text-xs text-white hover:bg-[#8b1919] font-mono uppercase border-t border-zinc-900 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-white font-mono text-[12px] uppercase tracking-[0.15em] hover:text-[#8b1919] transition-colors"
                                >
                                    Login
                                </Link>
                            )}
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
                        <Route path="/lore" element={<Lore />} />
                        <Route path="/staff" element={<Staff />} />
                        <Route path="/rules" element={<Rules />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/lore-admin" element={<LoreAdmin />} />
                        <Route path="/lore-editor" element={<LoreEditor />} />
                        <Route path="/admin/recommended" element={<RecommendedAdmin />} />
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

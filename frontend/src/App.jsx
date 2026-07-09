import React, { Suspense, lazy } from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Hangar from './pages/Hangar';
import { GAME_LINK, API_BASE } from './constants';

// Route-level code splitting — only the Hangar (landing page) ships in the main bundle.
const Divisions = lazy(() => import('./pages/Divisions'));
const Holonet = lazy(() => import('./pages/Holonet'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Legal = lazy(() => import('./pages/Legal'));
const Terms = lazy(() => import('./pages/Terms'));
const Lore = lazy(() => import('./pages/Lore'));
const Staff = lazy(() => import('./pages/Staff'));
const Rules = lazy(() => import('./pages/Rules'));
const Login = lazy(() => import('./pages/Login'));
const LoreAdmin = lazy(() => import('./pages/LoreAdmin'));
const LoreEditor = lazy(() => import('./pages/LoreEditor'));
const RecommendedAdmin = lazy(() => import('./pages/RecommendedAdmin'));
const Appeal = lazy(() => import('./pages/Appeal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em] animate-pulse">
                Establishing Connection…
            </p>
        </div>
    );
}

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
    const dropdownRef = React.useRef(null);

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
            fetch(`${API_BASE}/api/v1/proxy/avatar?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data[0]) {
                        setAvatarUrl(data.data[0].imageUrl);
                    }
                })
                .catch(e => console.error('Failed to fetch avatar', e));
        }
    }, [user]);

    // Close the account dropdown on outside click or Escape
    React.useEffect(() => {
        if (!dropdownOpen) return;
        const onPointerDown = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setDropdownOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [dropdownOpen]);

    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#8b1919] selection:text-white antialiased font-inter">

                {/* TopNavBar */}
                <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex justify-between items-center w-full px-6 md:px-16 h-20 max-w-[1440px] mx-auto">
                        <Link to="/" className="text-[32px] font-black tracking-tighter text-white hover:text-[#c4c7c8] transition-colors" aria-label="SW:RP Home">
                            SW:RP
                        </Link>

                        <Navigation />

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        aria-haspopup="menu"
                                        aria-expanded={dropdownOpen}
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
                                            className="w-full text-left px-4 py-3 text-xs text-white hover:bg-[#8b1919] font-mono uppercase border-t border-zinc-900 flex items-center gap-2"
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
                    <ErrorBoundary>
                        <Suspense fallback={<RouteFallback />}>
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
                                <Route path="/appeal" element={<Appeal />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
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

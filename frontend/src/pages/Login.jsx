import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CLIENT_ID = "4826975489404838124";
const REDIRECT_URI = "https://swrp.me/login";

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            setLoading(true);
            fetch('https://swrp.thatzane.workers.dev/api/v1/auth/callback?code=' + code)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error + (data.details ? `: ${JSON.stringify(data.details)}` : ''));
                    } else {
                        // Save token and user
                        localStorage.setItem('swrp_token', data.token);
                        localStorage.setItem('swrp_user', JSON.stringify(data.user));
                        setUser(data.user);
                        // Clear query params
                        navigate('/login', { replace: true });
                    }
                })
                .catch(err => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Check if already logged in
            const savedUser = localStorage.getItem('swrp_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
    }, [location, navigate]);

    const handleLogin = () => {
        const state = Math.random().toString(36).substring(7);
        const url = `https://apis.roblox.com/oauth/v1/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid+profile&state=${state}`;
        window.location.href = url;
    };

    const handleLogout = () => {
        localStorage.removeItem('swrp_token');
        localStorage.removeItem('swrp_user');
        setUser(null);
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col items-center justify-center min-h-[70vh] bg-[#050505]">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-[#8b1919]/30 p-8 flex flex-col gap-6 relative"
                 style={{
                     clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
                 }}
            >
                {/* Corner glow */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#8b1919] opacity-50" 
                     style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>

                <div className="flex flex-col gap-1 text-center">
                    <div className="font-mono text-[10px] text-[#8b1919] uppercase tracking-[0.15em]">
                        Imperial Database
                    </div>
                    <h2 className="text-2xl text-white font-bold uppercase tracking-wide">
                        Terminal Access
                    </h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="w-10 h-10 border-2 border-[#8b1919] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-500 text-xs font-mono">Verifying credentials...</p>
                    </div>
                ) : user ? (
                    <div className="flex flex-col gap-6 py-4">
                        <div className="flex items-center gap-4 bg-[#0d0a0a] p-4 border border-[#8b1919]/20">
                            <div className="w-12 h-12 bg-[#151515] flex items-center justify-center font-mono text-sm text-zinc-700">
                                {user.displayName[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{user.displayName}</span>
                                <span className="text-zinc-500 text-xs">@{user.username}</span>
                            </div>
                        </div>
                        
                        <p className="text-zinc-400 text-sm text-center">
                            Access granted. You are now logged in.
                        </p>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-3 bg-[#151515] border border-white/5 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919]/10 hover:border-[#8b1919] transition-all duration-300"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 py-4">
                        <p className="text-zinc-500 text-sm text-center">
                            Authorize with your Roblox account to access restricted areas.
                        </p>

                        {error && (
                            <div className="p-3 bg-[#8b1919]/5 border border-[#8b1919]/30 text-[#8b1919] text-xs font-mono">
                                ERROR: {error}
                            </div>
                        )}

                        <button 
                            onClick={handleLogin}
                            className="w-full py-4 bg-[#8b1919]/10 border border-[#8b1919]/40 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Login with Roblox
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

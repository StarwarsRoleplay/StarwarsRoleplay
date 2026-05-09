import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RobloxAvatar = ({ userId, username }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (!userId) return;
        fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=true`)
            .then(res => res.json())
            .then(data => {
                if (data.data && data.data[0]) {
                    setAvatarUrl(data.data[0].imageUrl);
                }
            })
            .catch(e => console.error('Failed to fetch avatar', e));
    }, [userId]);

    if (avatarUrl) {
        return <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full border border-zinc-800" />;
    }

    return (
        <div className="w-10 h-10 bg-[#151515] flex items-center justify-center font-mono text-sm text-zinc-700 rounded-full border border-zinc-800">
            {username ? username[0] : '?'}
        </div>
    );
};

export default function LoreAdmin() {
    const navigate = useNavigate();
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPermissions, setNewPermissions] = useState('write');
    const [actionLoading, setActionLoading] = useState(false);

    const token = localStorage.getItem('swrp_token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchWriters();
    }, [token, navigate]);

    const fetchWriters = () => {
        setLoading(true);
        fetch('https://swrp.thatzane.workers.dev/api/v1/lore/writers', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 401) {
                navigate('/login');
                throw new Error('Unauthorized');
            }
            if (res.status === 403) {
                throw new Error('Access Denied. Admins only.');
            }
            return res.json();
        })
        .then(data => {
            setWriters(data);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleAddWriter = (e) => {
        e.preventDefault();
        if (!newUsername) return;

        setActionLoading(true);
        fetch('https://swrp.thatzane.workers.dev/api/v1/lore/writers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: newUsername,
                permissions: newPermissions
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                setNewUsername('');
                fetchWriters();
            }
        })
        .catch(err => alert(err.message))
        .finally(() => setActionLoading(false));
    };

    const handleDeleteWriter = (id) => {
        if (!window.confirm('Are you sure you want to remove this writer?')) return;

        fetch(`https://swrp.thatzane.workers.dev/api/v1/lore/writers?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                fetchWriters();
            }
        })
        .catch(err => alert(err.message));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-10 h-10 border-2 border-[#8b1919] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white font-inter">
                <div className="max-w-md w-full bg-[#0a0a0a] border border-[#8b1919]/50 p-8 flex flex-col items-center gap-6"
                     style={{
                         clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'
                     }}
                >
                    <div className="w-16 h-16 bg-[#8b1919]/10 border border-[#8b1919] flex items-center justify-center text-[#8b1919] text-3xl font-bold font-mono">
                        !
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-black uppercase tracking-tight">Access Denied</h2>
                        <p className="text-zinc-500 text-sm text-center">
                            {error}
                        </p>
                    </div>
                    <div className="w-full h-px bg-zinc-800"></div>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-white text-[#0A0A0A] font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] hover:text-white transition-all duration-300"
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-12 bg-[#050505]">
            <div className="flex flex-col gap-2">
                <div className="font-mono text-[10px] text-[#8b1919] uppercase tracking-[0.15em]">
                    Imperial Archives
                </div>
                <h1 className="text-4xl text-white font-black uppercase tracking-tight">
                    Lore Writers Management
                </h1>
                <p className="text-[#c4c7c8] text-sm max-w-2xl">
                    Grant access to the lore writing system and customize permissions for specific users.
                </p>
            </div>

            {/* Add Writer Form */}
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#8b1919]/30 p-6 relative"
                 style={{
                     clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                 }}
            >
                <h2 className="text-lg text-white font-bold uppercase mb-4">Add New Writer</h2>
                <form onSubmit={handleAddWriter} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Roblox Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="e.g. thatzanex"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Permissions</label>
                        <select
                            value={newPermissions}
                            onChange={(e) => setNewPermissions(e.target.value)}
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        >
                            <option value="write">Write</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="w-full md:w-auto px-6 py-3 bg-[#8b1919]/10 border border-[#8b1919]/40 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] transition-all duration-300 disabled:opacity-50"
                        >
                            {actionLoading ? 'Adding...' : 'Authorize'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Writers List */}
            <div className="w-full flex flex-col gap-4">
                <h2 className="text-lg text-white font-bold uppercase">Authorized Writers</h2>
                
                {writers.length === 0 ? (
                    <div className="text-zinc-600 text-sm font-mono">
                        No writers authorized yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {writers.map(writer => (
                            <div key={writer.roblox_id} 
                                 className="bg-[#0a0a0a] border border-zinc-800 p-6 flex flex-col gap-4 relative"
                                 style={{
                                     clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                                 }}
                            >
                                <div className="flex items-center gap-4">
                                    <RobloxAvatar userId={writer.roblox_id} username={writer.username} />
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{writer.display_name}</span>
                                        <span className="text-zinc-500 text-xs">@{writer.username}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs font-mono">
                                    <div>
                                        <span className="text-zinc-600">Perms: </span>
                                        <span className="text-[#8b1919] uppercase">{writer.permissions}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-600">By: </span>
                                        <span className="text-zinc-400">{writer.added_by}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteWriter(writer.roblox_id)}
                                    className="text-zinc-600 hover:text-[#8b1919] text-xs font-mono uppercase text-right transition-colors"
                                >
                                    Revoke Access
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

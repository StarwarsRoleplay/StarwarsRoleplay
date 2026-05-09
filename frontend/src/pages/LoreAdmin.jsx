import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RobloxAvatar = ({ userId, username }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (!userId) return;
        fetch(`https://swrp.thatzane.workers.dev/api/v1/proxy/avatar?userId=${userId}`)
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

const PAGES = ['lore', 'staff', 'divisions', 'rules'];
const ACTIONS = ['read', 'write', 'admin'];

export default function UserManagement() {
    const navigate = useNavigate();
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPermissions, setNewPermissions] = useState({
        lore: ['write'],
        staff: [],
        divisions: [],
        rules: []
    });
    const [actionLoading, setActionLoading] = useState(false);

    const token = localStorage.getItem('swrp_token');

    const fetchWriters = React.useCallback(() => {
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
    }, [token, navigate]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchWriters();
    }, [token, navigate, fetchWriters]);

    const handleAddUser = (e) => {
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
                permissions: { pages: newPermissions }
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                setNewUsername('');
                setNewPermissions({
                    lore: ['write'],
                    staff: [],
                    divisions: [],
                    rules: []
                });
                fetchWriters();
            }
        })
        .catch(err => alert(err.message))
        .finally(() => setActionLoading(false));
    };

    const handleDeleteWriter = (id) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;

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

    const handlePermissionChange = (page, action) => {
        setNewPermissions(prev => {
            const current = prev[page] || [];
            if (current.includes(action)) {
                return { ...prev, [page]: current.filter(a => a !== action) };
            } else {
                return { ...prev, [page]: [...current, action] };
            }
        });
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
                    User Management
                </h1>
                <p className="text-[#c4c7c8] text-sm max-w-2xl">
                    Grant access to specific pages and features for users.
                </p>
            </div>

            {/* Add User Form */}
            <div className="w-full bg-[#0a0a0a] border border-[#8b1919]/30 p-6 relative"
                 style={{
                     clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                 }}
            >
                <h2 className="text-lg text-white font-bold uppercase mb-4">Add New User</h2>
                <form onSubmit={handleAddUser} className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4">
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
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full md:w-auto px-6 py-3 bg-[#8b1919]/10 border border-[#8b1919]/40 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] transition-all duration-300 disabled:opacity-50"
                            >
                                {actionLoading ? 'Adding...' : 'Authorize'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-2">Permissions</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PAGES.map(page => (
                                <div key={page} className="bg-[#111] border border-zinc-800 p-4">
                                    <h3 className="text-white text-sm font-bold uppercase mb-2">{page}</h3>
                                    <div className="flex flex-col gap-2">
                                        {ACTIONS.map(action => (
                                            <label key={action} className="flex items-center gap-2 text-zinc-400 text-xs cursor-pointer hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={newPermissions[page]?.includes(action)}
                                                    onChange={() => handlePermissionChange(page, action)}
                                                    className="accent-[#8b1919]"
                                                />
                                                <span className="uppercase">{action}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            {/* Users List */}
            <div className="w-full flex flex-col gap-4">
                <h2 className="text-lg text-white font-bold uppercase">Authorized Users</h2>
                
                {writers.length === 0 ? (
                    <div className="text-zinc-600 text-sm font-mono">
                        No users authorized yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {writers.map(writer => {
                            let perms;
                            try {
                                if (writer.permissions.startsWith('{')) {
                                    perms = JSON.parse(writer.permissions).pages || {};
                                } else {
                                    perms = { lore: [writer.permissions] };
                                }
                            } catch {
                                perms = { lore: [writer.permissions] };
                            }

                            return (
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

                                    <div className="flex flex-col gap-2 text-xs font-mono">
                                        <span className="text-zinc-600">Permissions:</span>
                                        {Object.entries(perms).map(([page, actions]) => (
                                            <div key={page} className="flex justify-between border-b border-zinc-900 pb-1">
                                                <span className="text-white uppercase">{page}</span>
                                                <span className="text-[#8b1919] uppercase">{actions.join(', ')}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center text-xs font-mono mt-auto">
                                        <div>
                                            <span className="text-zinc-600">By: </span>
                                            <span className="text-zinc-400">{writer.added_by}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteWriter(writer.roblox_id)}
                                            className="text-zinc-600 hover:text-[#8b1919] text-xs font-mono uppercase text-right transition-colors"
                                        >
                                            Revoke Access
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

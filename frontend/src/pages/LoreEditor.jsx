import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoreEditor() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('history');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('swrp_token');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !slug || !content || !category) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        fetch('https://swrp.thatzane.workers.dev/api/v1/lore/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, slug, content, category })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                navigate('/lore');
            }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-12 bg-[#050505]">
            <div className="flex flex-col gap-2">
                <div className="font-mono text-[10px] text-[#8b1919] uppercase tracking-[0.15em]">
                    Imperial Archives
                </div>
                <h1 className="text-4xl text-white font-black uppercase tracking-tight">
                    Lore Editor
                </h1>
                <p className="text-[#c4c7c8] text-sm max-w-2xl">
                    Create a new lore article for the archives.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#0a0a0a] border border-zinc-800 p-8">
                {error && (
                    <div className="text-[#8b1919] font-mono text-sm border border-[#8b1919]/50 p-4 bg-[#8b1919]/5">
                        ERROR: {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. The Battle of Geonosis"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. battle-of-geonosis"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                    >
                        <option value="history">Galactic History</option>
                        <option value="custom">Custom Lore</option>
                        <option value="factions">Faction Records</option>
                        <option value="operations">Operations Archive</option>
                    </select>
                </div>

                <div>
                    <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your lore article here..."
                        rows={10}
                        className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors font-mono"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => navigate('/lore')}
                        className="px-6 py-3 bg-transparent border border-zinc-800 text-zinc-500 font-mono text-xs uppercase tracking-wider hover:text-white hover:border-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#8b1919]/10 border border-[#8b1919]/40 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Publishing...' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </section>
    );
}

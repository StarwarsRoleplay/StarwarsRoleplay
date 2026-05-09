import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bold, Italic, Heading1, Heading2, List, Link as LinkIcon, Eye, Edit2, Save, Shield, Image as ImageIcon } from 'lucide-react';

export default function LoreEditor() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    
    const [draft] = useState(() => {
        if (id) return {}; // Don't use draft if editing an existing article
        const d = localStorage.getItem('swrp_lore_draft');
        return d ? JSON.parse(d) : {};
    });

    const [title, setTitle] = useState(draft.title || '');
    const [slug, setSlug] = useState(draft.slug || '');
    const [category, setCategory] = useState(draft.category || 'history');
    const [content, setContent] = useState(draft.content || '');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!draft.slug);
    const [draftSaved, setDraftSaved] = useState(false);
    const [currentDraftId, setCurrentDraftId] = useState(null);

    const token = localStorage.getItem('swrp_token');

    // Load article if editing
    useEffect(() => {
        if (id) {
            fetch(`https://swrp.thatzane.workers.dev/api/v1/lore/articles?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setTitle(data.title || '');
                        setSlug(data.slug || '');
                        setCategory(data.category || 'history');
                        setContent(data.content || '');
                        setTags(data.tags || '');
                        setIsSlugManuallyEdited(true);
                    }
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Auto-save to DB
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title || content) {
                const method = (id || currentDraftId) ? 'PUT' : 'POST';
                const targetId = id || currentDraftId;
                const body = { 
                    title, 
                    slug, 
                    content, 
                    category, 
                    is_draft: true,
                    tags
                };
                if (targetId) body.id = targetId;

                fetch('https://swrp.thatzane.workers.dev/api/v1/lore/articles', {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setDraftSaved(true);
                        setTimeout(() => setDraftSaved(false), 2000);
                        if (!targetId && data.id) {
                            setCurrentDraftId(data.id);
                        }
                    }
                })
                .catch(err => console.error('Failed to auto-save draft', err));
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [title, slug, category, content, tags, id, currentDraftId, token]);

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
        if (!isSlugManuallyEdited) {
            setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
        }
    };

    const handleSlugChange = (e) => {
        setSlug(e.target.value);
        setIsSlugManuallyEdited(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !slug || !content || !category) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        const method = (id || currentDraftId) ? 'PUT' : 'POST';
        const targetId = id || currentDraftId;
        const body = { 
            title, 
            slug, 
            content, 
            category, 
            is_draft: false,
            tags
        };
        if (targetId) body.id = targetId;

        fetch('https://swrp.thatzane.workers.dev/api/v1/lore/articles', {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                localStorage.removeItem('swrp_lore_draft');
                navigate('/lore');
            }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    };

    const insertText = (before, after = '') => {
        const textarea = document.getElementById('content-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);
        
        const newText = text.substring(0, start) + before + selected + after + text.substring(end);
        setContent(newText);
        
        // Reset cursor position after React render
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        // Discord Webhook URL (Placeholder)
        const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL_HERE'; 

        if (webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL_HERE') {
            alert('Please configure the Discord Webhook URL in LoreEditor.jsx!');
            setLoading(false);
            return;
        }

        fetch(webhookUrl + '?wait=true', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.attachments && data.attachments[0]) {
                const url = data.attachments[0].url;
                insertText(`![image](${url})`);
            } else {
                alert('Failed to get attachment URL from Discord');
            }
        })
        .catch(err => alert('Upload failed: ' + err.message))
        .finally(() => setLoading(false));
    };

    const parseMarkdown = (text) => {
        if (!text) return '';
        let html = text
            .replace(/^### (.*$)/gim, '<h3 class="text-white font-bold text-lg mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-white font-bold text-xl mt-4 mb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-white font-bold text-2xl mt-4 mb-2">$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-[#8b1919] hover:underline" target="_blank">$1</a>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 text-zinc-300">$1</li>')
            .replace(/\[redact\](.*?)\[\/redact\]/gim, '<span class="bg-black text-black hover:text-[#8b1919] transition-colors px-1 cursor-help" title="Redacted by Imperial Order">$1</span>')
            .replace(/\n/gim, '<br />');
        return html;
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

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
                            onChange={handleTitleChange}
                            placeholder="e.g. The Battle of Geonosis"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={handleSlugChange}
                            placeholder="e.g. battle-of-geonosis"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label className="block text-zinc-500 text-xs font-mono uppercase mb-1">Tags (Comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. jedi, sith, empire"
                            className="w-full bg-[#111] border border-zinc-800 text-white p-3 text-sm focus:border-[#8b1919] outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Editor Toolbar & Split View */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-[#111] border border-zinc-800 p-2">
                        <div className="flex gap-2">
                            <button type="button" onClick={() => insertText('**', '**')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Bold"><Bold size={16} /></button>
                            <button type="button" onClick={() => insertText('*', '*')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Italic"><Italic size={16} /></button>
                            <button type="button" onClick={() => insertText('# ')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="H1"><Heading1 size={16} /></button>
                            <button type="button" onClick={() => insertText('## ')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="H2"><Heading2 size={16} /></button>
                            <button type="button" onClick={() => insertText('- ')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="List"><List size={16} /></button>
                            <button type="button" onClick={() => insertText('[', '](url)')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Link"><LinkIcon size={16} /></button>
                            <button type="button" onClick={() => insertText('[redact]', '[/redact]')} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Redact"><Shield size={16} /></button>
                            <button type="button" onClick={() => document.getElementById('image-upload').click()} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Upload Image"><ImageIcon size={16} /></button>
                            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <div className="flex items-center gap-4">
                            {draftSaved && <span className="text-zinc-600 text-xs font-mono flex items-center gap-1"><Save size={12} /> Draft Saved</span>}
                            <div className="flex gap-2 text-xs font-mono text-zinc-500">
                                <button type="button" onClick={() => setViewMode('edit')} className={`px-2 py-1 ${viewMode === 'edit' ? 'text-[#8b1919] border-b border-[#8b1919]' : ''}`}><Edit2 size={14} /></button>
                                <button type="button" onClick={() => setViewMode('preview')} className={`px-2 py-1 ${viewMode === 'preview' ? 'text-[#8b1919] border-b border-[#8b1919]' : ''}`}><Eye size={14} /></button>
                                <button type="button" onClick={() => setViewMode('split')} className={`px-2 py-1 ${viewMode === 'split' ? 'text-[#8b1919] border-b border-[#8b1919]' : ''}`}>Split</button>
                            </div>
                        </div>
                    </div>

                    <div className={`grid ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 min-h-[400px]`}>
                        {(viewMode === 'edit' || viewMode === 'split') && (
                            <textarea
                                id="content-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your lore article here in Markdown..."
                                className="w-full bg-[#111] border border-zinc-800 text-white p-4 text-sm focus:border-[#8b1919] outline-none transition-colors font-mono resize-none"
                            />
                        )}
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div 
                                className="w-full bg-[#0a0a0a] border border-zinc-800 p-4 text-sm text-zinc-300 font-inter overflow-auto"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                            />
                        )}
                    </div>
                    <div className="text-right text-zinc-600 text-xs font-mono">
                        Words: {wordCount}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => navigate('/lore')}
                        className="px-6 py-3 bg-transparent border border-zinc-800 text-zinc-500 font-mono text-xs uppercase tracking-wider hover:text-white hover:border-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear the draft? This cannot be undone.')) {
                                    localStorage.removeItem('swrp_lore_draft');
                                    setTitle('');
                                    setSlug('');
                                    setContent('');
                                    setCategory('history');
                                    setIsSlugManuallyEdited(false);
                                }
                            }}
                            className="px-6 py-3 bg-transparent border border-zinc-800 text-zinc-500 font-mono text-xs uppercase tracking-wider hover:text-white hover:border-white transition-all duration-300"
                        >
                            Clear Draft
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-[#8b1919]/10 border border-[#8b1919]/40 text-white font-mono text-xs uppercase tracking-wider hover:bg-[#8b1919] transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Publishing...' : 'Publish Article'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

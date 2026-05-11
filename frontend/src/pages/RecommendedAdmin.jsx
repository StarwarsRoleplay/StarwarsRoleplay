import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendedAdmin() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({
        type: 'NEWS',
        title: '',
        desc: '',
        image: '',
        expiresAt: ''
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingFor, setUploadingFor] = useState(null); // null | 'new' | number (index)
    const [uploadError, setUploadError] = useState(null);

    const token = localStorage.getItem('swrp_token');

    const fetchItems = React.useCallback(() => {
        fetch('https://swrp.thatzane.workers.dev/api/v1/recommended')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchItems();
    }, [token, navigate, fetchItems]);

    const handleImageUpload = async (file, target) => {
        setUploadError(null);
        setUploadingFor(target);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('https://swrp.thatzane.workers.dev/api/v1/recommended/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.success && data.url) {
                if (target === 'new') {
                    setNewItem(prev => ({ ...prev, image: data.url }));
                } else {
                    handleItemChange(target, 'image', data.url);
                }
            } else {
                setUploadError(data.error || 'Upload failed');
            }
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploadingFor(null);
        }
    };

    const handleSave = () => {
        setActionLoading(true);
        fetch('https://swrp.thatzane.workers.dev/api/v1/recommended', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(items)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Saved successfully!');
            } else {
                alert(data.error || 'Failed to save');
            }
        })
        .catch(err => alert(err.message))
        .finally(() => setActionLoading(false));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        setItems([...items, newItem]);
        setNewItem({ type: 'NEWS', title: '', desc: '', image: '', expiresAt: '' });
    };

    const handleDeleteItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    if (loading) return <div className="p-8 text-white font-mono">Loading...</div>;
    if (error) return <div className="p-8 text-red-500 font-mono">Error: {error}</div>;

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16 bg-[#050505]">
            {/* Header */}
            <div className="flex flex-col gap-2 border-l-4 border-[#8b1919] pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    ADMINISTRATION
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase tracking-wider">
                    Recommended Items
                </h2>
                <p className="text-zinc-500 text-xs font-mono">EDIT HANGAR PAGE RECOMMENDATIONS</p>
            </div>

            {uploadError && (
                <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 font-mono text-xs text-red-400">
                    Upload failed: {uploadError}
                </div>
            )}

            {/* Add New Item Form */}
            <form onSubmit={handleAddItem} className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-4">
                <h3 className="text-lg text-white font-bold uppercase">Add New Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500 font-mono">TYPE</label>
                        <select
                            value={newItem.type}
                            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                            className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                        >
                            <option value="NEWS">NEWS</option>
                            <option value="STORE">STORE</option>
                            <option value="EVENT">EVENT</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500 font-mono">TITLE</label>
                        <input
                            type="text"
                            value={newItem.title}
                            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500 font-mono">DESCRIPTION</label>
                    <input
                        type="text"
                        value={newItem.desc}
                        onChange={(e) => setNewItem({...newItem, desc: e.target.value})}
                        className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                        required
                    />
                </div>
                <ImageField
                    value={newItem.image}
                    onChange={(v) => setNewItem({...newItem, image: v})}
                    onUpload={(file) => handleImageUpload(file, 'new')}
                    uploading={uploadingFor === 'new'}
                />
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500 font-mono">EXPIRES AT (OPTIONAL)</label>
                    <input
                        type="datetime-local"
                        value={newItem.expiresAt || ''}
                        onChange={(e) => setNewItem({...newItem, expiresAt: e.target.value})}
                        className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-4 py-2 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 w-fit"
                >
                    Add Item
                </button>
            </form>

            {/* List of Items */}
            {items.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg text-white font-bold uppercase">Current Items</h3>
                    {items.map((item, index) => (
                        <div key={index} className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-[#8b1919]">{item.type}</span>
                                <button
                                    onClick={() => handleDeleteItem(index)}
                                    className="text-red-500 text-xs font-mono hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-zinc-500 font-mono">TITLE</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                        className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-zinc-500 font-mono">DESCRIPTION</label>
                                    <input
                                        type="text"
                                        value={item.desc}
                                        onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                                        className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <ImageField
                                value={item.image}
                                onChange={(v) => handleItemChange(index, 'image', v)}
                                onUpload={(file) => handleImageUpload(file, index)}
                                uploading={uploadingFor === index}
                            />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-zinc-500 font-mono">EXPIRES AT (OPTIONAL)</label>
                                <input
                                    type="datetime-local"
                                    value={item.expiresAt || ''}
                                    onChange={(e) => handleItemChange(index, 'expiresAt', e.target.value)}
                                    className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={actionLoading}
                className="bg-[#8b1919] text-white font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 w-full md:w-fit self-end"
            >
                {actionLoading ? 'Saving...' : 'Save All Changes'}
            </button>
        </section>
    );
}

function ImageField({ value, onChange, onUpload, uploading }) {
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
        e.target.value = '';
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-mono">IMAGE</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="URL or upload an image →"
                    className="flex-1 bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-[#151515] border border-white/5 text-zinc-300 font-mono text-[11px] px-4 py-2 uppercase tracking-wider hover:border-[#8b1919] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </div>
            {value && value.startsWith('http') && (
                <img
                    src={value}
                    alt="preview"
                    className="mt-1 h-20 object-cover border border-white/5 w-fit"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            )}
        </div>
    );
}

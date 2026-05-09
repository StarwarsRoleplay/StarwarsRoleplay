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
        image: '[ IMAGE ]',
        expiresAt: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    const token = localStorage.getItem('swrp_token');

    const fetchItems = React.useCallback(() => {
        fetch('https://swrp.thatzane.workers.dev/api/v1/recommended')
            .then(res => res.json())
            .then(data => {
                setItems(data);
            })
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
        setNewItem({ type: 'NEWS', title: '', desc: '', image: '[ IMAGE ]', expiresAt: '' });
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
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500 font-mono">IMAGE TEXT / URL</label>
                    <input 
                        type="text"
                        value={newItem.image}
                        onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                        className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                        required
                    />
                </div>
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
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-500 font-mono">IMAGE TEXT / URL</label>
                            <input 
                                type="text"
                                value={item.image}
                                onChange={(e) => handleItemChange(index, 'image', e.target.value)}
                                className="bg-[#151515] border border-white/5 text-white p-2 font-mono text-sm"
                            />
                        </div>
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

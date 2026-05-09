import React, { useState, useEffect } from 'react';
import { Book, FileText, Globe, Shield } from 'lucide-react';

export default function Lore() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = [
        { id: 'history', name: 'Galactic History', icon: Book, desc: 'Explore the overarching history of the galaxy.' },
        { id: 'custom', name: 'Custom Lore', icon: Globe, desc: 'Read about the custom events and stories.' },
        { id: 'factions', name: 'Faction Records', icon: Shield, desc: 'Detailed records of the grand army divisions.' },
        { id: 'operations', name: 'Operations Archive', icon: FileText, desc: 'Logs of past operations and campaigns.' }
    ];

    useEffect(() => {
        if (!selectedCategory) return;
        fetch(`https://swrp.thatzane.workers.dev/api/v1/lore/articles?category=${selectedCategory}`)
            .then(res => res.json())
            .then(data => setArticles(data))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            {/* Styles for Holocron */}
            <style>{`
                .holocron-container {
                    perspective: 1000px;
                    width: 200px;
                    height: 200px;
                    margin: 0 auto;
                }
                .holocron {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    animation: rotate 20s linear infinite;
                }
                .holocron-face {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background: rgba(139, 25, 25, 0.1);
                    border: 2px solid #8b1919;
                    box-shadow: 0 0 30px rgba(139, 25, 25, 0.5), inset 0 0 30px rgba(139, 25, 25, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: monospace;
                    font-size: 10px;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    backface-visibility: hidden;
                }
                .front  { transform: translateZ(100px); }
                .back   { transform: rotateY(180deg) translateZ(100px); }
                .right  { transform: rotateY(90deg) translateZ(100px); }
                .left   { transform: rotateY(-90deg) translateZ(100px); }
                .top    { transform: rotateX(90deg) translateZ(100px); }
                .bottom { transform: rotateX(-90deg) translateZ(100px); }

                @keyframes rotate {
                    from { transform: rotateX(0) rotateY(0); }
                    to { transform: rotateX(360deg) rotateY(360deg); }
                }
            `}</style>

            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    RECORDS & ARCHIVES
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Galactic Archives
                </h2>
                <span className="font-mono text-[12px] font-medium text-[#c4c7c8] uppercase tracking-[0.15em]">
                    Access restricted lore and historical files.
                </span>
            </div>

            {/* 3D Holocron */}
            <div className="holocron-container my-8">
                <div className="holocron">
                    <div className="holocron-face front">Lore</div>
                    <div className="holocron-face back">Archives</div>
                    <div className="holocron-face right">History</div>
                    <div className="holocron-face left">Records</div>
                    <div className="holocron-face top">Core</div>
                    <div className="holocron-face bottom">Access</div>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <div 
                            key={cat.id}
                            className={`bg-[#121212] border ${selectedCategory === cat.id ? 'border-[#8b1919]' : 'border-white/10'} p-8 flex flex-col gap-6 hover:border-[#8b1919]/50 transition-all cursor-pointer group relative`}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                setLoading(true);
                            }}
                        >
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                            
                            <div className="text-[#8b1919]">
                                <Icon className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl text-white font-bold uppercase mb-2 group-hover:text-[#8b1919] transition-colors">{cat.name}</h3>
                                <p className="font-mono text-[14px] text-[#c4c7c8] leading-[20px]">
                                    {cat.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Articles List */}
            {selectedCategory && (
                <div className="flex flex-col gap-6 mt-8">
                    <h3 className="text-2xl text-white font-bold uppercase">Articles in {categories.find(c => c.id === selectedCategory)?.name}</h3>
                    {loading ? (
                        <div className="text-zinc-500 font-mono">Loading articles...</div>
                    ) : articles.length === 0 ? (
                        <div className="text-zinc-600 font-mono">No articles found in this category.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {articles.map(article => (
                                <div key={article.id} className="bg-[#0a0a0a] border border-zinc-800 p-6 hover:border-[#8b1919] transition-colors cursor-pointer">
                                    <h4 className="text-lg text-white font-bold uppercase">{article.title}</h4>
                                    <p className="text-zinc-500 text-sm mt-1">By {article.author_name} | {new Date(article.created_at * 1000).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

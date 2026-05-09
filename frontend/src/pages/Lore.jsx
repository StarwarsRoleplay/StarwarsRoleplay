import React, { useState, useEffect } from 'react';
import { Book, FileText, Globe, Shield, ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function HolocronModel({ onSelect }) {
    const { scene } = useGLTF('/images/3d/jedi_holocron.glb');
    return (
        <primitive 
            object={scene} 
            scale={2}
            onClick={() => onSelect('history')}
            className="cursor-pointer"
        />
    );
}

export default function Lore() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

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

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              article.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || (article.tags && article.tags.split(',').map(t => t.trim()).includes(selectedTag));
        return matchesSearch && matchesTag;
    });

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-12 bg-[#050505]">
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
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .holocron-face:hover {
                    background: rgba(139, 25, 25, 0.3);
                }
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

            {/* Content Area */}
            {selectedArticle ? (
                <div className="flex flex-col gap-6 bg-[#0a0a0a] border border-zinc-800 p-8">
                    <button 
                        onClick={() => setSelectedArticle(null)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-xs uppercase transition-colors self-start"
                    >
                        <ArrowLeft size={14} /> Back to List
                    </button>
                    <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
                        <h1 className="text-3xl text-white font-black uppercase">{selectedArticle.title}</h1>
                        <p className="text-zinc-500 text-xs font-mono">
                            Author: {selectedArticle.author_name} | Published: {new Date(selectedArticle.created_at * 1000).toLocaleDateString()}
                        </p>
                    </div>
                    <div 
                        className="text-zinc-300 text-sm font-inter leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedArticle.content) }}
                    />
                </div>
            ) : selectedCategory ? (
                <div className="flex flex-col gap-6">
                    <button 
                        onClick={() => { setSelectedCategory(null); setSearchQuery(''); setSelectedTag(null); }}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-xs uppercase transition-colors self-start"
                    >
                        <ArrowLeft size={14} /> Back to Categories
                    </button>
                    <h3 className="text-2xl text-white font-bold uppercase">Articles in {categories.find(c => c.id === selectedCategory)?.name}</h3>
                    
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-zinc-800 p-3 text-white font-mono text-sm focus:border-[#8b1919] focus:outline-none transition-colors"
                        />
                        
                        {/* Tags */}
                        {articles.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {[...new Set(articles.flatMap(a => a.tags ? a.tags.split(',').map(t => t.trim()) : []))].filter(Boolean).map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`px-2 py-1 font-mono text-xs uppercase border transition-colors ${
                                            selectedTag === tag 
                                                ? 'bg-[#8b1919] border-[#8b1919] text-white' 
                                                : 'bg-[#0a0a0a] border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-zinc-500 font-mono">Loading articles...</div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-zinc-600 font-mono">No articles match your search or filters.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredArticles.map(article => (
                                <div 
                                    key={article.id} 
                                    className="bg-[#0a0a0a] border border-zinc-800 p-6 hover:border-[#8b1919] transition-colors cursor-pointer"
                                    onClick={() => setSelectedArticle(article)}
                                >
                                    <h4 className="text-lg text-white font-bold uppercase">{article.title}</h4>
                                    <p className="text-zinc-500 text-sm mt-1">By {article.author_name} | {new Date(article.created_at * 1000).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* 3D Holocron */}
                    <div className="w-full h-[300px] my-8 bg-[#0a0a0a] border border-zinc-800">
                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <ambientLight intensity={0.7} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} />
                            <pointLight position={[-10, -10, -10]} intensity={1} color="#8b1919" />
                            <HolocronModel onSelect={setSelectedCategory} />
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
                        </Canvas>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <div 
                                    key={cat.id}
                                    className="bg-[#121212] border border-white/10 p-8 flex flex-col gap-6 hover:border-[#8b1919]/50 transition-all cursor-pointer group relative"
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
                </>
            )}
        </section>
    );
}

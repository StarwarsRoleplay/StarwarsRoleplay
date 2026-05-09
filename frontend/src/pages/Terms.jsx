import React from 'react';

export default function Terms() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    LEGAL
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Terms of Service
                </h2>
            </div>
            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px] max-w-4xl">
                <p className="mb-4">By accessing this website, you agree to the following terms:</p>
                <p className="mb-4">1. This site is for entertainment and community purposes related to the Star Wars Roleplay group on Roblox.</p>
                <p className="mb-4">2. All Star Wars assets, names, and logos are property of Disney/Lucasfilm. This is a fan site.</p>
                <p className="mb-4">3. Respect other community members when interacting on linked platforms like Discord.</p>
            </div>
        </section>
    );
}

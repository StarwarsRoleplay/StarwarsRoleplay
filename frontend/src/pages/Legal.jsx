import React from 'react';

export default function Legal() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    LEGAL
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Legal Notice / Impressum
                </h2>
            </div>
            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px] max-w-4xl">
                <p className="mb-4"><strong>Information according to § 5 DDG:</strong></p>
                <p className="mb-4">This website is operated as a private fan-based hobby project. It serves exclusively for information about the Roblox group and the connected project.</p>
                
                <p className="mb-2"><strong>Responsible for content:</strong></p>
                <p className="mb-1">Batu Erol</p>
                <p className="mb-1">P.O. Box 1513 (Postfach 1513)</p>
                <p className="mb-1">Kantstr. 5</p>
                <p className="mb-1">59425 Unna</p>
                <p className="mb-4">Germany</p>
                
                <p className="text-[#8e9192] text-[12px]">Note: This is a fan-made website and is not affiliated with Lucasfilm or Disney.</p>
            </div>
        </section>
    );
}

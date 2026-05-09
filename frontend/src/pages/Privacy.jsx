import React from 'react';

export default function Privacy() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    LEGAL
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Privacy Policy
                </h2>
            </div>
            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px] max-w-4xl">
                <p className="mb-4">This website is a static site intended for roleplay and community information. We do not collect, store, or process any personal data from visitors.</p>
                <p className="mb-4">When you click on external links (such as Discord or Roblox), you are leaving this site and are subject to the privacy policies of those third-party platforms.</p>
                <p className="mb-4">Since we do not collect data, no cookies are used for tracking purposes.</p>
            </div>
        </section>
    );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';

const INFO_CARDS = [
    {
        index: '01',
        title: 'Review Your Case',
        body: 'Read the rules before appealing. Understand what led to your sanction and ensure you can clearly articulate why the decision should be reconsidered.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        index: '02',
        title: 'Be Honest',
        body: 'Provide accurate and truthful information at all times. False statements or misleading claims will result in immediate and permanent denial of your appeal.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        index: '03',
        title: 'One Appeal Only',
        body: 'You may only submit one appeal per sanction. Duplicate or repeat submissions are automatically disregarded and may worsen your standing.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]">
                <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

export default function Appeal() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16 bg-[#050505]">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2 border-l-4 border-[#8b1919] pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919] animate-pulse"></span>
                    REPUBLIC JUDICIAL SYSTEM
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight tracking-wider">
                    Submit an Appeal
                </h2>
                <p className="text-zinc-500 text-xs font-mono">CASE FILE // AWAITING REVIEW</p>
            </div>

            {/* ── Info Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INFO_CARDS.map((card) => (
                    <div
                        key={card.index}
                        className="relative bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-4 group hover:border-[#8b1919]/40 transition-all duration-300"
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                        }}
                    >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#8b1919]/40 group-hover:border-[#8b1919] transition-colors duration-300"></div>

                        {/* Index + Icon row */}
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-[#8b1919] tracking-[0.2em]">{card.index}</span>
                            <span className="text-zinc-700 group-hover:text-[#8b1919] transition-colors duration-300">
                                {card.icon}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-mono text-[13px] font-medium text-white uppercase tracking-[0.12em] group-hover:text-[#8b1919] transition-colors duration-300">
                            {card.title}
                        </h3>

                        {/* Body */}
                        <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                            {card.body}
                        </p>

                        {/* Bottom rule */}
                        <div className="mt-auto pt-4 border-t border-white/5 group-hover:border-[#8b1919]/20 transition-colors duration-300">
                            <div className="w-6 h-[2px] bg-[#8b1919]/30 group-hover:bg-[#8b1919] transition-all duration-300 group-hover:w-12"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Central Appeal Panel ───────────────────────────────────────── */}
            <div
                className="relative bg-[#0a0a0a] border border-[#8b1919]/30 p-10 md:p-16 flex flex-col items-center gap-8 text-center overflow-hidden"
                style={{
                    clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(139,25,25,0.018) 0px, rgba(139,25,25,0.018) 1px, transparent 1px, transparent 3px)',
                }}
            >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#8b1919]"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#8b1919]"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#8b1919]"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#8b1919]"></div>

                {/* Faint diagonal accent */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #8b1919 0px, #8b1919 1px, transparent 1px, transparent 40px)',
                    }}
                ></div>

                {/* Status indicator */}
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#8b1919] uppercase tracking-[0.2em]">
                    <span className="w-2 h-2 bg-[#8b1919] animate-pulse flex-shrink-0"></span>
                    TRIBUNAL TERMINAL // CASE SUBMISSION OPEN
                    <span className="w-2 h-2 bg-[#8b1919] animate-pulse flex-shrink-0"></span>
                </div>

                {/* Divider */}
                <div className="w-24 h-px bg-[#8b1919]/30"></div>

                {/* Title */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl md:text-4xl text-white font-black uppercase tracking-[0.08em] leading-tight">
                        Request for<br />
                        <span className="text-[#8b1919]">Reconsideration</span>
                    </h1>
                </div>

                {/* Body text */}
                <div className="flex flex-col gap-4 max-w-xl">
                    <p className="text-[#c4c7c8] text-sm leading-relaxed font-sans">
                        If you believe your ban or sanction was issued in error, or you wish to present
                        new information, you may submit a formal appeal below.
                    </p>
                    <p className="text-zinc-600 text-xs leading-relaxed font-mono uppercase tracking-[0.05em]">
                        All appeals are reviewed by senior staff. Decisions are final and binding.
                    </p>
                </div>

                {/* CTA Button */}
                <a
                    href="https://appeal.gg/u9cxxZzPWR"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-10 py-5 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300 flex items-center gap-3 group mt-2"
                >
                    Submit Your Appeal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                {/* Case ID decoration */}
                <div className="font-mono text-[9px] text-zinc-800 uppercase tracking-[0.3em] mt-2">
                    CASE-ID: ████ — JURISDICTION: REPUBLIC HIGH COMMAND
                </div>
            </div>

            {/* ── Warning Block ──────────────────────────────────────────────── */}
            <div className="w-full bg-[#0a0a0a] border border-[#8b1919]/30 px-8 py-6 flex items-start gap-4">
                <span className="text-[#8b1919] font-mono text-lg flex-shrink-0 leading-none mt-0.5">⚠</span>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.05em] leading-relaxed">
                    Abuse of the appeal system, including repeated submissions or harassment of staff,
                    may result in a <span className="text-[#8b1919]">permanent ban</span> without further review.
                </p>
            </div>

        </section>
    );
}

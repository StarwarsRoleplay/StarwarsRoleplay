import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DISCORD_LINK } from '../constants';

export default function Holonet() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
            <div className="flex flex-col gap-2 border-l-4 border-white pl-6">
                <div className="font-mono text-[10px] font-medium text-[#8b1919] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8b1919]"></span>
                    COMMUNICATION HUB
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight">
                    Establish Holonet Link
                </h2>
            </div>

            <div className="font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px] max-w-2xl">
                Transmit your coordinates to the Jedi Council and connect with the fleet. Our primary Holonet frequency is hosted on Discord. Join us to receive deployment orders, participate in events, and chat with other troopers.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 max-w-md">
                <a
                    href={DISCORD_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-8 py-4 uppercase tracking-[0.15em] hover:bg-[#5865F2] hover:text-white transition-all duration-300 w-full flex items-center justify-center gap-2 group"
                >
                    Connect to Discord
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </section>
    );
}

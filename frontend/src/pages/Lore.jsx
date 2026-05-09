import React from 'react';
import { Book, FileText, Globe, Shield } from 'lucide-react';

export default function Lore() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16">
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

            {/* Lore Categories/Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Category 1 */}
                <div className="bg-[#121212] border border-white/10 p-8 flex flex-col gap-6 hover:border-white/30 transition-all cursor-pointer group relative">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    
                    <div className="text-[#8b1919]">
                        <Book className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl text-white font-bold uppercase mb-2 group-hover:text-[#8b1919] transition-colors">Galactic History</h3>
                        <p className="font-mono text-[14px] text-[#c4c7c8] leading-[20px]">
                            Explore the overarching history of the galaxy, from the formation of the Republic to the current conflict.
                        </p>
                    </div>
                    <div className="font-mono text-[12px] text-[#8e9192] uppercase mt-auto">
                        Status: [Pending Declassification]
                    </div>
                </div>

                {/* Category 2 */}
                <div className="bg-[#121212] border border-white/10 p-8 flex flex-col gap-6 hover:border-white/30 transition-all cursor-pointer group relative">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    
                    <div className="text-[#8b1919]">
                        <Globe className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl text-white font-bold uppercase mb-2 group-hover:text-[#8b1919] transition-colors">Custom Lore</h3>
                        <p className="font-mono text-[14px] text-[#c4c7c8] leading-[20px]">
                            Read about the custom events, battles, and stories unique to our sector and server.
                        </p>
                    </div>
                    <div className="font-mono text-[12px] text-[#8e9192] uppercase mt-auto">
                        Status: [Pending Declassification]
                    </div>
                </div>

                {/* Category 3 */}
                <div className="bg-[#121212] border border-white/10 p-8 flex flex-col gap-6 hover:border-white/30 transition-all cursor-pointer group relative">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    
                    <div className="text-[#8b1919]">
                        <Shield className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl text-white font-bold uppercase mb-2 group-hover:text-[#8b1919] transition-colors">Faction Records</h3>
                        <p className="font-mono text-[14px] text-[#c4c7c8] leading-[20px]">
                            Detailed records of the grand army divisions, their achievements, and their commanding officers.
                        </p>
                    </div>
                    <div className="font-mono text-[12px] text-[#8e9192] uppercase mt-auto">
                        Status: [Pending Declassification]
                    </div>
                </div>

                {/* Category 4 */}
                <div className="bg-[#121212] border border-white/10 p-8 flex flex-col gap-6 hover:border-white/30 transition-all cursor-pointer group relative">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity m-2"></div>
                    
                    <div className="text-[#8b1919]">
                        <FileText className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl text-white font-bold uppercase mb-2 group-hover:text-[#8b1919] transition-colors">Operations Archive</h3>
                        <p className="font-mono text-[14px] text-[#c4c7c8] leading-[20px]">
                            Logs of past operations, campaigns, and major server events.
                        </p>
                    </div>
                    <div className="font-mono text-[12px] text-[#8e9192] uppercase mt-auto">
                        Status: [Pending Declassification]
                    </div>
                </div>

            </div>

            <div className="mt-8 font-mono text-[14px] text-[#c4c7c8] border-l-2 border-[#8b1919] pl-4 py-1 leading-[20px]">
                [Notice: The archives are currently offline or restricted. Lore entries will be added here in the future.]
            </div>
        </section>
    );
}

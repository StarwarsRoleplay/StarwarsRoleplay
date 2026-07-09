import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4">
                    Holonet Archive // Sector Unknown
                </p>
                <h1 className="text-7xl font-black tracking-tighter mb-3 text-white">
                    404
                </h1>
                <p className="text-zinc-400 text-sm mb-8">
                    These are not the coordinates you are looking for. The page you requested
                    does not exist or has been relocated.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-6 py-3 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300"
                >
                    Return to Hangar
                </Link>
            </div>
        </div>
    );
}

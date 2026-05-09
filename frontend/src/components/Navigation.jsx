import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path ? 'text-white border-b-2 border-[#8b1919] pb-1' : 'hover:text-white hover:bg-white/5 transition-colors pb-1';
    };

    return (
        <nav className="hidden md:flex gap-8 items-center font-mono text-[12px] uppercase tracking-[0.15em] font-medium text-[#c4c7c8]">
            <Link className={isActive('/')} to="/">Hangar</Link>
            <Link className={isActive('/divisions')} to="/divisions">Divisions</Link>
            <Link className={isActive('/lore')} to="/lore">Lore</Link>
            <Link className={isActive('/holonet')} to="/holonet">Holonet</Link>
        </nav>
    );
}

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    const isActive = (path) => {
        return location.pathname === path ? 'text-white border-b-2 border-[#8b1919] pb-1' : 'hover:text-white hover:bg-white/5 transition-colors pb-1';
    };

    const isMobileActive = (path) => {
        return location.pathname === path ? 'text-white border-l-4 border-[#8b1919] pl-2' : 'text-[#c4c7c8] hover:text-white pl-2';
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 items-center font-mono text-[12px] uppercase tracking-[0.15em] font-medium text-[#c4c7c8]">
                <Link className={isActive('/')} to="/">Hangar</Link>
                <Link className={isActive('/divisions')} to="/divisions">Divisions</Link>
                <Link className={isActive('/lore')} to="/lore">Lore</Link>
                <Link className={isActive('/staff')} to="/staff">Staff</Link>
                <Link className={isActive('/holonet')} to="/holonet">Holonet</Link>
            </nav>

            {/* Mobile Navigation Button */}
            <button 
                className="md:hidden text-white p-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-[#0A0A0A] border-b border-white/10 z-50 md:hidden">
                    <nav className="flex flex-col gap-6 p-6 font-mono text-[14px] uppercase tracking-[0.15em] font-medium">
                        <Link className={isMobileActive('/')} to="/" onClick={() => setIsOpen(false)}>Hangar</Link>
                        <Link className={isMobileActive('/divisions')} to="/divisions" onClick={() => setIsOpen(false)}>Divisions</Link>
                        <Link className={isMobileActive('/lore')} to="/lore" onClick={() => setIsOpen(false)}>Lore</Link>
                        <Link className={isMobileActive('/staff')} to="/staff" onClick={() => setIsOpen(false)}>Staff</Link>
                        <Link className={isMobileActive('/holonet')} to="/holonet" onClick={() => setIsOpen(false)}>Holonet</Link>
                    </nav>
                </div>
            )}
        </>
    );
}

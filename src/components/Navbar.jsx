import React from 'react';
import { BwIcon, BwWordmark } from './Logo';
import { playSound } from '../utils/audio';

export default function Navbar({ soundEnabled, onOpenProjectModal, activeSection = 'intro' }) {
  return (
    <header className="fixed z-50 top-4 left-8 sm:left-14 right-8 sm:right-14 flex items-center justify-between pointer-events-none">
      {/* BRAND LOGO CARD (EXACT MATCH TO REFERENCE IMAGE & USER SVGs) */}
      <a
        href="#"
        className="pointer-events-auto flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl shadow-sm border border-black/[0.06] transition-transform hover:scale-[1.02]"
        onClick={() => playSound('click', soundEnabled)}
        title="Broad Wave Creations"
      >
        <BwIcon className="h-6 w-auto shrink-0" />
        <BwWordmark className="h-4.5 w-auto shrink-0" />
      </a>

      {/* NAV CAPSULE (100% EXACT MATCH TO REFERENCE IMAGES media_1793182160639_db8b0c2c.png & media_1793181784961_87814d76.png) */}
      <nav className="nav-capsule pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-[#173032] border border-[#102426]/60 rounded-2xl p-1.5 shadow-md select-none">
        <a
          href="#capabilities"
          className={`nav-item text-white text-[13.5px] sm:text-[14px] font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-150 hidden md:inline-block cursor-pointer ${
            activeSection === 'services' ? 'bg-[#254547] text-white shadow-inner' : 'hover:bg-white/12'
          }`}
          style={{ color: '#FFFFFF', opacity: 1 }}
          onClick={() => playSound('hover', soundEnabled)}
        >
          Services
        </a>
        <a
          href="#inside"
          className={`nav-item text-white text-[13.5px] sm:text-[14px] font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-150 hidden md:inline-block cursor-pointer ${
            activeSection === 'industries' ? 'bg-[#254547] text-white shadow-inner' : 'hover:bg-white/12'
          }`}
          style={{ color: '#FFFFFF', opacity: 1 }}
          onClick={() => playSound('hover', soundEnabled)}
        >
          Industries
        </a>
        <a
          href="#inside"
          className={`nav-item text-white text-[13.5px] sm:text-[14px] font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-150 hidden sm:inline-block cursor-pointer hover:bg-white/12`}
          style={{ color: '#FFFFFF', opacity: 1 }}
          onClick={() => playSound('hover', soundEnabled)}
        >
          Why CGI
        </a>
        <a
          href="#work"
          className={`nav-item text-white text-[13.5px] sm:text-[14px] font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-150 hidden sm:inline-block cursor-pointer ${
            activeSection === 'work' ? 'bg-[#254547] text-white shadow-inner' : 'hover:bg-white/12'
          }`}
          style={{ color: '#FFFFFF', opacity: 1 }}
          onClick={() => playSound('hover', soundEnabled)}
        >
          Work
        </a>
        <a
          href="#contact"
          className="nav-cta bg-[#33C0CA] hover:bg-[#2eb2bc] text-[#121212] font-semibold text-[13.5px] sm:text-[14px] px-4.5 sm:px-5 py-2 rounded-xl transition-all duration-200 shadow-sm cursor-pointer ml-0.5"
          style={{ color: '#121212', backgroundColor: '#33C0CA', opacity: 1 }}
          onClick={(e) => {
            playSound('click', soundEnabled);
            if (onOpenProjectModal) {
              e.preventDefault();
              onOpenProjectModal();
            }
          }}
        >
          Start a project
        </a>
      </nav>
    </header>
  );
}

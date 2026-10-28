import React from 'react';
import TestimonialsAndPedestal from './TestimonialsAndPedestal';
import { playSound } from '../utils/audio';

export default function FinaleSection({ soundEnabled, onOpenProjectModal }) {
  return (
    <section id="finale" className="relative py-28 px-6 sm:px-12 lg:px-16 bg-[#0c1820] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center">
        
        <p className="eyebrow text-cyan-400 font-mono mb-3">
          The stage is set
        </p>

        <h2 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight mb-8">
          Your product goes here.
        </h2>

        <div className="flex items-center gap-4 flex-wrap justify-center mb-16">
          <a
            className="btn cyan cursor-pointer"
            href="#contact"
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
          <a
            className="btn ghost text-white border-white/40 hover:bg-white/10 cursor-pointer"
            href="#contact"
            onClick={() => playSound('hover', soundEnabled)}
          >
            Book a call
          </a>
        </div>

        {/* Interactive 3D Holographic Pedestal */}
        <div className="w-full max-w-4xl">
          <TestimonialsAndPedestal soundEnabled={soundEnabled} onOpenProjectModal={onOpenProjectModal} />
        </div>

      </div>
    </section>
  );
}


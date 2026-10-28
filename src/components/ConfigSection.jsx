import React, { useState } from 'react';
import RenderStageConfigurator from './RenderStageConfigurator';
import { playSound } from '../utils/audio';

export default function ConfigSection({ soundEnabled, onOpenProjectModal }) {
  const [colour, setColour] = useState('Midnight');
  const [light, setLight] = useState('Studio');
  const [angle, setAngle] = useState('Hero');
  const [photoCount, setPhotoCount] = useState(1);

  const handleSelectColour = (c) => {
    playSound('hover', soundEnabled);
    setColour(c);
    setPhotoCount((prev) => prev + 1);
  };

  const handleSelectLight = (l) => {
    playSound('hover', soundEnabled);
    setLight(l);
    setPhotoCount((prev) => prev + 1);
  };

  const handleSelectAngle = (a) => {
    playSound('hover', soundEnabled);
    setAngle(a);
    setPhotoCount((prev) => prev + 1);
  };

  return (
    <section id="config" className="relative py-24 px-6 sm:px-12 lg:px-16 bg-[#121212] text-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Why CGI Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6 z-20">
            <p className="eyebrow text-cyan-400 font-mono">Why CGI</p>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white leading-tight">
              One 3D model. Every photo you need.
            </h2>

            {/* Colour Options */}
            <div className="group flex flex-col gap-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                Colour
              </span>
              <div className="chipset flex gap-2 flex-wrap">
                {[
                  { name: 'Midnight', color: '#12648e' },
                  { name: 'Beach', color: '#c9a3a0' },
                  { name: 'Street', color: '#2c2c2c' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectColour(item.name)}
                    className={`opt px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                      colour === item.name
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <i className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Light Options */}
            <div className="group flex flex-col gap-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                Light
              </span>
              <div className="chipset flex gap-2 flex-wrap">
                {['Studio', 'Sunset', 'E-com white'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectLight(item)}
                    className={`opt px-4 py-2 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
                      light === item
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Options */}
            <div className="group flex flex-col gap-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                Angle
              </span>
              <div className="chipset flex gap-2 flex-wrap">
                {['Hero', 'Side', 'Top', 'Back'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectAngle(item)}
                    className={`opt px-4 py-2 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
                      angle === item
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Tallies */}
            <div className="tally flex gap-6 pt-5 border-t border-white/15">
              <div className="flex flex-col">
                <b className="font-heading font-black text-3xl sm:text-4xl text-white">
                  {photoCount}
                </b>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  Photos made
                </span>
              </div>
              <div className="flex flex-col">
                <b className="font-heading font-black text-3xl sm:text-4xl text-cyan-400">
                  0
                </b>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  Samples shipped
                </span>
              </div>
              <div className="flex flex-col">
                <b className="font-heading font-black text-3xl sm:text-4xl text-cyan-400">
                  0
                </b>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  Reshoots
                </span>
              </div>
            </div>

          </div>

          {/* Right: Interactive 3D Model Stage */}
          <div className="lg:col-span-7 relative bg-[#091820] rounded-3xl p-6 border border-white/10 shadow-2xl">
            <RenderStageConfigurator soundEnabled={soundEnabled} onOpenProjectModal={onOpenProjectModal} />
          </div>

        </div>
      </div>
    </section>
  );
}


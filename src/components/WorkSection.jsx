import React, { useState } from 'react';
import { Play, ArrowUpRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

const CATEGORIES = [
  'All',
  'Animation',
  'Jewelry & watches',
  'Beauty & fragrance',
  'Electronics & energy',
  'Home & health',
  'E-commerce',
  'Food & packaging',
  'Fashion & footwear',
  'Automotive',
];

const PROJECTS = [
  { title: 'Solar inverter & EV visuals', tag: 'Energy · Animation', category: 'Electronics & energy', isFilm: true, grad: 'from-cyan-900 to-slate-900', behance: 'https://www.behance.net/gallery/205626027/Solar-Inverter-and-Electric-Vehicle-3D-Animation' },
  { title: 'High-speed car commercial', tag: 'Automotive · Animation', category: 'Automotive', isFilm: true, grad: 'from-blue-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Flagship smartphone', tag: 'Electronics · Animation', category: 'Electronics & energy', isFilm: true, grad: 'from-sky-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Headset & magnetic dock', tag: 'Electronics · Animation', category: 'Electronics & energy', isFilm: true, grad: 'from-teal-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Siona diamond earrings', tag: 'Jewelry · Renders + 360°', category: 'Jewelry & watches', isFilm: true, grad: 'from-amber-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Day / Night skincare campaign', tag: 'Skincare · CGI + AI', category: 'Beauty & fragrance', isFilm: true, grad: 'from-rose-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Luxury perfume flacon', tag: 'Fragrance · CGI film', category: 'Beauty & fragrance', isFilm: true, grad: 'from-indigo-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Haute Horology luxury watch', tag: 'Watches · Renders + film', category: 'Jewelry & watches', isFilm: true, grad: 'from-zinc-900 to-slate-950', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Power cables for Amazon', tag: 'E-commerce · Renders', category: 'E-commerce', isFilm: false, grad: 'from-slate-800 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Kinetic runner shoe', tag: 'Footwear · Modeling + renders', category: 'Fashion & footwear', isFilm: false, grad: 'from-cyan-950 to-zinc-900', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Fluid dynamic smart toilet', tag: 'Home & bath · Animation', category: 'Home & health', isFilm: true, grad: 'from-blue-900 to-slate-950', behance: 'https://www.behance.net/bwcreations' },
  { title: 'Cola bottle & condensation', tag: 'Beverage · Cinematic render', category: 'Food & packaging', isFilm: false, grad: 'from-red-950 to-slate-900', behance: 'https://www.behance.net/bwcreations' },
];

export default function WorkSection({ soundEnabled }) {
  const [activeCat, setActiveCat] = useState('All');

  const filtered = activeCat === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCat);

  return (
    <section id="work" className="relative py-28 px-6 sm:px-12 lg:px-16 bg-white text-[#121212]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* HEADER & CHIPS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="eyebrow text-slate-500 font-mono mb-2">07 · SELECTED WORK</p>
            <h2 className="font-heading font-black text-4xl sm:text-6xl text-[#121212] tracking-tight">
              Selected work.
            </h2>
          </div>

          <a
            href="https://www.behance.net/bwcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans font-bold text-sm text-[#0E6F77] hover:underline"
          >
            <span>Behance profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                playSound('click', soundEnabled);
                setActiveCat(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-[#121212] text-white border-[#121212]'
                  : 'bg-transparent text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BENTO CARDS GRID */}
        <div className="bento">
          {filtered.map((proj, idx) => (
            <a
              key={idx}
              href={proj.behance}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playSound('hover', soundEnabled)}
              className={`work-card group relative p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${proj.grad} ${
                idx === 0 || idx === 5 ? 'big' : idx === 2 || idx === 7 ? 'wide' : ''
              }`}
            >
              {/* Top Film Badge */}
              <div className="relative z-10 flex items-center justify-between">
                {proj.isFilm ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold bg-black/80 text-cyan-300">
                    <Play className="w-3 h-3 fill-cyan-300" />
                    FILM
                  </span>
                ) : <div />}

                <span className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Center Wireframe / Glow Accent */}
              <div className="my-auto self-center opacity-25 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                <Sparkles className="w-16 h-16 text-cyan-400" />
              </div>

              {/* Bottom Meta */}
              <div className="relative z-10 pt-4 border-t border-white/10">
                <b className="block font-heading font-black text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </b>
                <small className="font-mono text-xs text-slate-300">
                  {proj.tag}
                </small>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.behance.net/bwcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="btn solid cursor-pointer"
          >
            Show all 38 projects on Behance ↗
          </a>
        </div>

      </div>
    </section>
  );
}


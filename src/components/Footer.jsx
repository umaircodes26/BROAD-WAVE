
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowUpRight, Terminal, Mail, Check, MapPin } from 'lucide-react';
import Logo from './Logo';
import { playSound } from '../utils/audio';

export default function Footer({ soundEnabled, onOpenProjectModal }) {
  const [timeUtc, setTimeUtc] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toTimeString().split(' ')[0] + ' PKT/GST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    playSound('click', soundEnabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    playSound('click', soundEnabled);
    setSubscribed(true);
  };

  return (
    <footer className="relative pt-20 pb-12 px-6 sm:px-12 lg:px-16 z-20 bg-[#061117] text-white border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto">
        {/* FOOTER TOP ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800">
          {/* Col 1: Brand & Hubs */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo />
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6 font-normal">
              A high-end 3D product animation, photoreal CGI, and virtual production studio. Operating across Lahore, Pakistan and Ras Al-Khaimah, UAE.
            </p>

            <div className="flex items-center gap-2 font-mono-hud text-xs text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>STUDIOS: LAHORE (PK) · RAS AL-KHAIMAH (UAE)</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-mono-hud text-xs font-bold text-white uppercase tracking-widest mb-4">
              SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-400">
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">3D Product Animation</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Photoreal CGI Stills</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">CAD to CGI Conversion</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">AI Video & Generative VFX</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Packaging & CMF</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Exhibition & Spaces</a></li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div>
            <h4 className="font-mono-hud text-xs font-bold text-white uppercase tracking-widest mb-4">
              INDUSTRIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-400">
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Footwear & Apparel</a></li>
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Fragrance & Luxury Glass</a></li>
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Skincare & Cosmetics</a></li>
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Consumer Electronics</a></li>
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Automotive & Mobility</a></li>
              <li><a href="#industries" className="hover:text-cyan-300 transition-colors">Industrial Hardware</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Inquiries */}
          <div>
            <h4 className="font-mono-hud text-xs font-bold text-white uppercase tracking-widest mb-4">
              CGI DISPATCH
            </h4>
            <p className="text-xs text-slate-400 mb-3 font-normal">
              Direct insights on neural rendering, CAD conversions, and launch campaign analytics.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-xs font-mono-hud text-cyan-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>SUBSCRIBED TO DISPATCH</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="name@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 text-xs text-white placeholder-slate-500 border border-slate-700 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-mono-hud font-bold text-black bg-[#2dc2ce] hover:bg-[#3cd3df] transition-colors"
                >
                  JOIN DISPATCH
                </button>
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-hud text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STUDIO TIME: <span className="text-white">{timeUtc}</span>
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>BW CREATIONS // 3D VISUALIZATION STUDIO</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} BROAD WAVE CREATIONS. ALL RIGHTS RESERVED.</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

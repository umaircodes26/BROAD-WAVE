import React, { useState } from 'react';
import { Send, CheckCircle, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ContactSection({ soundEnabled }) {
  const [service, setService] = useState('3D Product Animation');
  const [timeline, setTimeline] = useState('Standard (4-6 Weeks)');
  const [budget, setBudget] = useState('$25k - $50k');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('click', soundEnabled);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-28 px-6 sm:px-12 lg:px-16 z-20 bg-white text-[#051117] border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto">
        <div className="rounded-3xl bg-[#091820] text-white p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT: STUDIO INFO & EXACT LOCATIONS */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-mono-hud text-xs tracking-wider uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>START A CONVERSATION</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-heading font-black text-white leading-tight mb-4">
                  Let’s bring your <br />
                  <span className="text-[#32d5e3]">product to life.</span>
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-normal">
                  Whether you have finished SolidWorks assemblies or an early concept brief, our directors will analyze your requirements and deliver a LookDev strategy.
                </p>

                {/* Studio Locations: Lahore & Ras Al-Khaimah */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 text-xs font-mono-hud">
                    <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">COMMERCIAL INQUIRIES</span>
                      <a href="mailto:hello@bwcreations.co" className="hover:text-cyan-300 text-sm font-sans font-semibold text-white">
                        hello@bwcreations.co
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300 text-xs font-mono-hud">
                    <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">STUDIO HUBS</span>
                      <span className="text-sm font-sans font-semibold text-white">
                        Lahore, Pakistan · Ras Al-Khaimah, UAE
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300 text-xs font-mono-hud">
                    <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">RESPONSE METRIC</span>
                      <span className="text-sm font-sans font-semibold text-emerald-400">&lt; 4 Hours Guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-cyan-500/20 text-xs font-mono-hud text-slate-400">
                // BROAD WAVE CREATIONS — ALL RIGHTS RESERVED
              </div>
            </div>

            {/* RIGHT: DIRECT BRIEF FORM */}
            <div className="lg:col-span-7 bg-[#040e14] p-6 sm:p-10 rounded-2xl border border-cyan-500/20 shadow-inner">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-4 text-cyan-300">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-white mb-2">
                    Transmission Received.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto mb-6">
                    Our lead CGI supervisor in Lahore & UAE is reviewing your brief. Expect our initial deck in your inbox shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-mono-hud font-bold text-black bg-[#2dc2ce] hover:bg-[#3cd3df]"
                  >
                    SUBMIT ANOTHER BRIEF
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dynamic Service Dropdown */}
                    <div>
                      <label className="block text-[11px] font-mono-hud text-slate-300 uppercase tracking-wider mb-2">
                        Core Service:
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 text-xs font-mono-hud text-white border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                      >
                        <option>3D Product Animation</option>
                        <option>Photoreal CGI & LookDev</option>
                        <option>CAD to CGI Conversion</option>
                        <option>AI Video & Generative VFX</option>
                        <option>Packaging & CMF Renders</option>
                        <option>Exhibition & Brand Spaces</option>
                      </select>
                    </div>

                    {/* Timeline Dropdown */}
                    <div>
                      <label className="block text-[11px] font-mono-hud text-slate-300 uppercase tracking-wider mb-2">
                        Target Launch Timeline:
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 text-xs font-mono-hud text-white border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                      >
                        <option>Rush Express (2-3 Weeks)</option>
                        <option>Standard (4-6 Weeks)</option>
                        <option>Comprehensive (8+ Weeks)</option>
                        <option>Ongoing Retainer</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-[11px] font-mono-hud text-slate-300 uppercase tracking-wider mb-2">
                      Budget Bracket:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['$10k - $25k', '$25k - $50k', '$50k+ Enterprise'].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => {
                            playSound('hover', soundEnabled);
                            setBudget(b);
                          }}
                          className={`py-2 px-2 rounded-xl text-[11px] font-mono-hud text-center transition-all ${
                            budget === b
                              ? 'bg-[#2dc2ce] text-black font-bold shadow-md'
                              : 'bg-black/40 text-slate-400 border border-cyan-500/15'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 text-xs text-white placeholder-slate-500 border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 text-xs text-white placeholder-slate-500 border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <textarea
                    rows="3"
                    placeholder="Provide details on your product asset, CAD file format (SolidWorks, STEP, Rhino), and launch objectives..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 text-xs text-white placeholder-slate-500 border border-cyan-500/20 focus:border-cyan-400 focus:outline-none resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-heading text-xs font-bold tracking-wider text-black bg-[#2dc2ce] hover:bg-[#3cd3df] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/30 cursor-pointer"
                  >
                    <span>TRANSMIT BRIEF TO DIRECTORS</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

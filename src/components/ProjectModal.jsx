import React, { useState } from 'react';
import { X, CheckCircle, Send, Sparkles, Box, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ProjectModal({ isOpen, onClose, soundEnabled }) {
  const [selectedServices, setSelectedServices] = useState(['3D Product Animation']);
  const [budget, setBudget] = useState('$25k - $50k');
  const [timeline, setTimeline] = useState('Standard (4-6 Weeks)');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleService = (srv) => {
    playSound('hover', soundEnabled);
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('click', soundEnabled);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl glass-panel-glow p-6 sm:p-10 border border-cyan-400/40 shadow-2xl overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full glass-panel text-slate-400 hover:text-white hover:border-cyan-400 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-12 relative z-10">
            <div className="w-20 h-20 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-6 text-cyan-300 shadow-xl shadow-cyan-400/30 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-heading font-black text-white mb-3">
              Transmission Received.
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
              Our 3D creative director will review your project parameters and respond with LookDev proposals & budget estimations within 24 hours.
            </p>
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 max-w-sm mx-auto mb-8 text-left text-xs font-mono-hud text-slate-400 space-y-1">
              <div>PROJECT_REF: #CP-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div>CLIENT: {formData.name || 'Anonymous Brand'}</div>
              <div>SERVICES: {selectedServices.join(', ')}</div>
              <div>STATUS: QUEUED FOR DIRECTORIAL REVIEW</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-8 py-3 rounded-full text-xs font-mono-hud font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/30"
            >
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-hud font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INITIATE PROJECT // BRIEF SPECIFICATION</span>
              </div>
              <h3 className="text-3xl font-heading font-black text-white">
                Let’s bring your product to life.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select your deliverables and tell us about your brand launch timeline.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deliverables selection */}
              <div>
                <label className="block text-xs font-mono-hud text-slate-300 uppercase tracking-wider mb-2.5">
                  1. Required Deliverables (Select all that apply):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    '3D Product Animation',
                    'Photoreal CGI',
                    'CAD to CGI',
                    'AI Video',
                    'Packaging',
                    'Exhibition & Brand',
                  ].map((srv) => (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-sans text-left transition-all flex items-center justify-between border cursor-pointer ${
                        selectedServices.includes(srv)
                          ? 'bg-cyan-400/20 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="truncate">{srv}</span>
                      {selectedServices.includes(srv) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-mono-hud text-slate-300 uppercase tracking-wider mb-2.5">
                  2. Anticipated Investment:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['$10k - $25k', '$25k - $50k', '$50k - $100k+'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => {
                        playSound('hover', soundEnabled);
                        setBudget(b);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-mono-hud text-center transition-all border ${
                        budget === b
                          ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-md shadow-cyan-400/20'
                          : 'glass-panel text-slate-400 border-cyan-500/15'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-panel text-sm text-white placeholder-slate-500 border-cyan-500/20 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-panel text-sm text-white placeholder-slate-500 border-cyan-500/20 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows="3"
                  placeholder="Describe your product asset, CAD file format, and launch deadline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-panel text-sm text-white placeholder-slate-500 border-cyan-500/20 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-full font-heading text-sm font-bold tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/30"
              >
                <span>TRANSMIT PROJECT BRIEF</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';

const TESTIMONIALS = [
  {
    quote: "Working with Talha was an absolute joy. His attention to detail in the product, and his willingness to go the extra mile made it so much fun and easy to work together.",
    author: "Erim Cicek",
    role: "SAFe Scrum Master",
    initials: "EC",
  },
  {
    quote: "BWCreations restored my faith and delivered an exceptional product that far exceeded my expectations.",
    author: "Scott Leishman",
    role: "Director · Li-Tech Solutions",
    initials: "SL",
  },
  {
    quote: "This is the 2nd job we engage Talha to do it as he is very skilled, could understand what we want and bring concepts so we could adjust from there.",
    author: "Sara Barletta",
    role: "Powerhouse Workforce",
    initials: "SB",
  },
];

const MARQUEE_REVIEWS = [
  { text: "Talha does excellent, detailed work in 3D modeling and product design. Great communicator.", author: "Chris Cano", company: "CEO · BM Productions" },
  { text: "BWCreations was very responsive and quickly returned files, I was able to use in my electrical CAD program.", author: "Zachariah Peterson", company: "Northwest Engineering Solutions" },
  { text: "BWCreations provided us with excellent work. Will rehire in the future.", author: "Jay Jaber", company: "Founder · BOXI" },
  { text: "He completed the task within agreed time. He was open to changes. Highly recommended!", author: "Muhammad Imran G", company: "CEO · BM Productions" },
  { text: "Talha was professional to the point and timely. He accommodated my speed.", author: "Rodney Masri", company: "Client" },
  { text: "BWCreations was communicative and prompt to deliver a 3D model.", author: "Artem Avdacev", company: "SBX Robotics" },
  { text: "It was great working with BWCreations, specifically with changes needed while finalizing the Idea.", author: "Abdulla AlKhanji", company: "Business Coach" },
];

export default function ProofSection({ soundEnabled }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const nextTestimonial = () => {
    playSound('hover', soundEnabled);
    setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    playSound('hover', soundEnabled);
    setCurrentIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIdx];

  return (
    <section id="voices" className="relative py-28 px-6 sm:px-12 lg:px-16 bg-[#121212] text-white border-t border-white/10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* TOP ROW: WHAT CLIENTS SAY */}
        <div className="flex items-center justify-between pb-8 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="eyebrow text-cyan-400 font-mono">08 · VOICES</span>
            <span className="text-slate-400 text-xs font-mono">What clients say</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-cyan-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              ))}
            </div>
            <span className="font-mono text-xs text-slate-400">
              0{currentIdx + 1} / 0{TESTIMONIALS.length}
            </span>
          </div>
        </div>

        {/* FEATURED TESTIMONIAL QUOTE */}
        <div className="max-w-4xl mb-20 min-h-[160px] flex flex-col justify-between">
          <blockquote className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white leading-tight mb-8">
            “{current.quote}”
          </blockquote>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400 text-black font-heading font-black text-lg flex items-center justify-center">
                {current.initials}
              </div>
              <div>
                <b className="block font-heading font-bold text-base text-white">
                  {current.author}
                </b>
                <span className="font-mono text-xs text-slate-400">
                  {current.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 CORE STATS FROM BWCREATIONS.CO */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 py-10 mb-16 text-center">
          <div className="py-6 px-4 flex flex-col items-center">
            <b className="font-heading font-black text-6xl sm:text-7xl text-cyan-400">
              7+
            </b>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest mt-2">
              Years of experience
            </span>
          </div>

          <div className="py-6 px-4 flex flex-col items-center">
            <b className="font-heading font-black text-6xl sm:text-7xl text-cyan-400">
              250+
            </b>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest mt-2">
              Projects delivered
            </span>
          </div>

          <div className="py-6 px-4 flex flex-col items-center">
            <b className="font-heading font-black text-6xl sm:text-7xl text-cyan-400">
              94%
            </b>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest mt-2">
              Client satisfaction
            </span>
          </div>
        </div>

        {/* CLIENT REVIEWS MARQUEE */}
        <div className="marquee">
          <div className="track">
            {MARQUEE_REVIEWS.concat(MARQUEE_REVIEWS).map((rev, i) => (
              <div key={i} className="mq">
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  “{rev.text}”
                </p>
                <div>
                  <b className="font-sans font-bold text-xs text-white block">
                    {rev.author}
                  </b>
                  <span className="font-mono text-[10px] text-slate-400 uppercase block mt-0.5">
                    {rev.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RATINGS BADGES */}
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-slate-300">
            <b className="text-cyan-400 font-bold">5.0 ★</b>
            <span>50+ reviews on Freelancer.com</span>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-slate-300">
            <b className="text-cyan-400 font-bold">5.0 ★</b>
            <span>100+ reviews on Upwork</span>
          </div>
        </div>

      </div>
    </section>
  );
}


import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSound } from '../utils/audio';
import ServiceDiceCube from './ServiceDiceCube';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    n: '01',
    title: '3D Product Animation',
    desc: 'Launch films, explainers, 360° spins.',
    link: '#work',
    cta: 'See animation →',
  },
  {
    n: '02',
    title: 'Photoreal CGI',
    desc: 'E-commerce and ad stills. No photoshoot.',
    link: '#work',
    cta: 'See renders →',
  },
  {
    n: '03',
    title: 'CAD to CGI',
    desc: 'From SolidWorks or STEP to production-true 3D.',
    link: '#inside',
    cta: 'See modeling →',
  },
  {
    n: '04',
    title: 'AI Video',
    desc: 'AI-assisted campaigns, anchored by real CGI.',
    link: '#work',
    cta: 'See the AI campaign →',
  },
  {
    n: '05',
    title: 'Packaging',
    desc: "See it on shelf before it's printed.",
    link: '#work',
    cta: 'See packaging →',
  },
  {
    n: '06',
    title: 'Exhibition & Brand',
    desc: 'Booths and brand spaces, built in 3D first.',
    link: '#contact',
    cta: 'Step inside ↓',
  },
];

export default function CapabilitiesSection({ soundEnabled }) {
  const sectionRef = useRef(null);
  const [serviceProgress, setServiceProgress] = useState(0); // 0.0 to 5.0
  const [activeFace, setActiveFace] = useState(0); // 0 to 5

  // GSAP ScrollTrigger Integration with scrub physics
  // As the user scrolls with mouse wheel, the 3D cube rolls like a dice
  // and the left side heading updates in exact synchronization!
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          const s = p * 5.0; // 0.0 to 5.0
          setServiceProgress(s);

          const idx = Math.min(Math.floor(p * 5.999), 5);
          setActiveFace(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="chapter relative h-[450vh] bg-[#f0f4f6]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-between px-8 sm:px-14 lg:px-24">
        
        {/* =========================================================================
            LEFT SIDE: SERVICES TEXT PANEL
            (100% EXACT MATCH TO media_1793193937770_c6ada8d2.png & media_1793194005845_72a03af4.png)
           ========================================================================= */}
        <div className="caps-panel relative z-20 flex flex-col justify-center max-w-[480px] lg:max-w-[520px]">
          {/* Eyebrow: SERVICES · 01 / 06 */}
          <p className="font-mono font-bold text-xs sm:text-[13px] text-[#64748b] uppercase tracking-[0.22em] mb-4 select-none">
            SERVICES · <span className="text-[#121212]">0{activeFace + 1}</span> / 06
          </p>

          {/* Heading, Description, and Link per active service */}
          <div className="relative min-h-[260px] sm:min-h-[280px]">
            {SERVICES.map((srv, i) => (
              <div
                key={srv.n}
                className={`transition-all duration-300 absolute inset-0 flex flex-col justify-start ${
                  activeFace === i
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Main Large Headline */}
                <h3 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#121212] tracking-tight leading-[0.98] select-none">
                  {srv.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-lg sm:text-xl text-[#4a5568] font-normal leading-[1.45] mt-5 select-none">
                  {srv.desc}
                </p>

                {/* Call-to-action Link */}
                <a
                  href={srv.link}
                  className="font-sans font-bold text-base sm:text-[17px] text-[#0e6f77] hover:text-[#0b5c64] hover:underline inline-flex items-center gap-1.5 mt-6 transition-colors duration-150 cursor-pointer"
                  onClick={() => playSound('hover', soundEnabled)}
                >
                  {srv.cta}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            RIGHT SIDE: 3D BRUSHED METAL CUBE ROLLING LIKE A DICE ON SCROLL
            (100% EXACT MATCH TO USER'S REFERENCE IMAGES)
            - As mouse scrolls, cube rolls 90° per service with physical hop & tilt!
            - Front face debossed text shows:
              01: 3D PRODUCT ANIMATION
              02: PHOTOREAL CGI
              03: CAD TO CGI
              04: AI VIDEO PRODUCTION
              05: PACKAGING & MOCKUPS
              06: EXHIBITION & BRAND
           ========================================================================= */}
        <div className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[640px] h-[480px] sm:h-[540px] lg:h-[600px] flex items-center justify-center pointer-events-auto z-10">
          <ServiceDiceCube
            serviceProgress={serviceProgress}
            isInteractive={true}
          />
        </div>

      </div>
    </section>
  );
}

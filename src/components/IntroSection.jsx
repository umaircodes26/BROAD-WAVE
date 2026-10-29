import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BwIcon } from './Logo';
import Bw3DCube from './Bw3DCube';
import { playSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    n: '01',
    titleLines: ['3D Product', 'Animation'],
    title: '3D Product Animation',
    desc: 'Launch films, explainers, 360° spins.',
    link: '#work',
    cta: 'See animation →',
  },
  {
    n: '02',
    titleLines: ['Photoreal CGI'],
    title: 'Photoreal CGI',
    desc: 'E-commerce and ad stills. No photoshoot.',
    link: '#work',
    cta: 'See renders →',
  },
  {
    n: '03',
    titleLines: ['CAD to CGI'],
    title: 'CAD to CGI',
    desc: 'From SolidWorks or STEP to production-true 3D.',
    link: '#inside',
    cta: 'See modeling →',
  },
  {
    n: '04',
    titleLines: ['AI Video'],
    title: 'AI Video',
    desc: 'AI-assisted campaigns, anchored by real CGI.',
    link: '#work',
    cta: 'See the AI campaign →',
  },
  {
    n: '05',
    titleLines: ['Packaging'],
    title: 'Packaging',
    desc: "See it on shelf before it's printed.",
    link: '#work',
    cta: 'See packaging →',
  },
  {
    n: '06',
    titleLines: ['Exhibition & Brand'],
    title: 'Exhibition & Brand',
    desc: 'Booths and brand spaces, built in 3D first.',
    link: '#contact',
    cta: 'See spaces →',
  },
];

/**
 * Calculates complementary polygon clip-paths and laser stroke path.
 * Top Polygon clips the 2D logo to the region ABOVE the wave line.
 * Bottom Polygon clips the 3D cube to the region BELOW the wave line.
 */
function getWaveClipPaths(morphProgress) {
  const clampedP = Math.min(Math.max(morphProgress, 0), 1);
  const yPos = 104 - clampedP * 108;
  const amplitude = 3.6;
  const frequency = 2.2;
  const steps = 32;

  const linePoints = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const rad = (x / 100) * frequency * 2 * Math.PI;
    const y = yPos + Math.sin(rad) * amplitude + Math.cos(rad * 0.7) * (amplitude * 0.3);
    linePoints.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }

  const topPolygonPoints = ['0% 0%', '100% 0%'];
  for (let i = steps; i >= 0; i--) {
    topPolygonPoints.push(`${linePoints[i].x}% ${linePoints[i].y}%`);
  }
  const topPolygon = `polygon(${topPolygonPoints.join(', ')})`;

  const bottomPolygonPoints = [];
  for (let i = 0; i <= steps; i++) {
    bottomPolygonPoints.push(`${linePoints[i].x}% ${linePoints[i].y}%`);
  }
  bottomPolygonPoints.push('100% 100%', '0% 100%');
  const bottomPolygon = `polygon(${bottomPolygonPoints.join(', ')})`;

  const lineD = `M ${linePoints[0].x} ${linePoints[0].y} ` + linePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  return { topPolygon, bottomPolygon, lineD, yPos };
}

export default function IntroSection({ soundEnabled, onOpenProjectModal, onScrollProgressUpdate }) {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // GSAP ScrollTrigger Integration with scrub physics
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Real-time HUD Scene & Frame synchronization matching reference images:
          // 1. Hero: Frame 0000 (Scene 01 · The wave)
          // 2. Stage 1 (Born from colour): Frame 0085 (Scene 01 · The wave)
          // 3. Transition: Frame 0085 -> 0137 (Scene 01 · The wave)
          // 4. Stage 2 (Engineered like a product): Frame 0137 -> 0215 (Scene 02 · Engineering)
          // 5. Transition to Services (media_1793194716254_c58ab100.png): Frame 0229 (Scene 03 · Services)
          // 6. Services 01 to 06: Frame 0229 -> 0240 (Scene 03 · Services)
          let frame = 0;
          let scene = '01 · The wave';
          let sectionName = 'intro';

          if (p <= 0.08) {
            frame = Math.round((p / 0.08) * 85);
            scene = '01 · The wave';
            sectionName = 'intro';
          } else if (p <= 0.28) {
            frame = 85;
            scene = '01 · The wave';
            sectionName = 'intro';
          } else if (p <= 0.42) {
            const t = (p - 0.28) / 0.14;
            frame = Math.round(85 + t * (137 - 85));
            scene = '01 · The wave';
            sectionName = 'intro';
          } else if (p <= 0.54) {
            const t = (p - 0.42) / 0.12;
            frame = Math.round(137 + t * (215 - 137));
            scene = '02 · Engineering';
            sectionName = 'intro';
          } else if (p <= 0.60) {
            const t = (p - 0.54) / 0.06;
            frame = Math.round(215 + t * (229 - 215)); // Exactly Frame 0229 in media_1793194716254_c58ab100.png!
            scene = '03 · Services';
            sectionName = 'services';
          } else {
            const t = Math.min((p - 0.60) / 0.34, 1);
            frame = Math.round(229 + t * (240 - 229));
            scene = '03 · Services';
            sectionName = 'services';
          }

          if (onScrollProgressUpdate) {
            onScrollProgressUpdate(p, frame, scene, sectionName);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [onScrollProgressUpdate]);

  // =========================================================================
  // MASTER UNIFIED SCROLL CHOREOGRAPHY (720vh)
  // ONE CONTINUOUS 3D CUBE:
  // 1. Hero: p 0.00 - 0.08
  // 2. Stage 1 (Pehla box - BW Logo zooming): p 0.08 - 0.28
  // 3. Stage 1.5 (Cyan laser wave slice): p 0.28 - 0.42
  // 4. Stage 2 (Glide to right + "Engineered like a product"): p 0.42 - 0.54
  // 5. Stage 2 -> 3 Transition (media_1793194716254_c58ab100.png): p 0.54 - 0.60
  // 6. Stage 3 (Services 01 to 06 Rolling Dice on same right-side box): p 0.60 - 0.94
  // 7. Exit into Inside section: p > 0.94
  // =========================================================================

  // Hero text opacity
  const heroOpacity = Math.max(1 - scrollProgress * 12.0, 0);

  // Pure clean studio background (dissolves back to turquoise on transition to Inside the Box)
  const bgWhiteFadeIn = Math.min(Math.max((scrollProgress - 0.06) / 0.08, 0), 1);
  const bgWhiteFadeOut = Math.min(Math.max((scrollProgress - 0.88) / 0.08, 0), 1);
  const bgWhiteOpacity = bgWhiteFadeIn * (1 - bgWhiteFadeOut);

  // Master Box Container visibility (fades out as Exhibition & Brand zooms in)
  const boxIn = Math.min(Math.max((scrollProgress - 0.08) / 0.06, 0), 1);
  const boxOut = Math.min(Math.max((scrollProgress - 0.88) / 0.06, 0), 1);
  const masterBoxOpacity = boxIn * (1 - boxOut);

  // Stage 1 Bottom-left Text ("Born from colour.")
  const stage1In = Math.min(Math.max((scrollProgress - 0.08) / 0.06, 0), 1);
  const stage1Out = Math.min(Math.max((scrollProgress - 0.26) / 0.06, 0), 1);
  const stage1TextOpacity = stage1In * (1 - stage1Out);

  // Stage 1.5 Wave Morph Progress (0.0 to 1.0)
  const morphProgress = Math.min(Math.max((scrollProgress - 0.28) / 0.14, 0), 1);
  const { topPolygon, bottomPolygon, lineD } = getWaveClipPaths(morphProgress);

  // Stage 2 Glide to Right Side (starts at p=0.42, finishes at p=0.52)
  const glideProgress = Math.min(Math.max((scrollProgress - 0.42) / 0.10, 0), 1);
  const easeGlide = glideProgress * glideProgress * (3 - 2 * glideProgress);

  // Continuous zoom scale: 0.85 -> 1.24 during Stage 1; scales to 1.36 on right side
  let zoomScale = 0.85;
  if (scrollProgress <= 0.08) {
    zoomScale = 0.85;
  } else if (scrollProgress <= 0.28) {
    const t = (scrollProgress - 0.08) / 0.20;
    const ease = t * t * (3 - 2 * t);
    zoomScale = 0.85 + ease * 0.39; // 0.85 -> 1.24
  } else if (scrollProgress <= 0.42) {
    zoomScale = 1.24;
  } else if (scrollProgress <= 0.54) {
    const t = (scrollProgress - 0.42) / 0.12;
    const ease = t * t * (3 - 2 * t);
    zoomScale = 1.24 + ease * 0.12; // 1.24 -> 1.36
  } else {
    zoomScale = 1.36;
  }

  // Stage 2 Left Text: "Engineered like a product. Rendered like a film."
  // In media_1793194716254_c58ab100.png, it smoothly slides UP as Services enters!
  const stage2In = Math.min(Math.max((scrollProgress - 0.42) / 0.06, 0), 1);
  const stage2Out = Math.min(Math.max((scrollProgress - 0.54) / 0.06, 0), 1);
  const stage2TextOpacity = stage2In * (1 - stage2Out);
  const stage2ShiftY = (1 - stage2In) * 35 - stage2Out * 75; // slides up into top-left on exit!

  // Stage 3 Services 01 to 06:
  // In media_1793194716254_c58ab100.png, Services enters from bottom while Stage 2 exits!
  const servicesIn = Math.min(Math.max((scrollProgress - 0.54) / 0.06, 0), 1);
  const servicesOut = Math.min(Math.max((scrollProgress - 0.94) / 0.05, 0), 1);
  const servicesPanelOpacity = servicesIn * (1 - servicesOut);
  const servicesShiftY = (1 - servicesIn) * 60; // slides in from below

  // Service Progress for the 3D Rolling Dice Cube (0.0 to 5.0)
  const serviceProgress = Math.min(Math.max((scrollProgress - 0.60) / 0.34, 0), 1) * 5.0;
  const activeFace = Math.min(Math.floor((serviceProgress / 5.0) * 5.999), 5);

  return (
    <section id="intro" ref={sectionRef} className="chapter relative h-[720vh]">
      {/* Anchor for navbar 'Services' link */}
      <div id="capabilities" className="absolute top-[54%] w-full h-1 pointer-events-none" />

      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Clean Studio Background (transitions from silk hero to clean off-white studio) */}
        <div
          className="absolute inset-0 bg-[#f0f4f6] pointer-events-none transition-opacity duration-300 ease-out z-0"
          style={{ opacity: bgWhiteOpacity }}
        />

        {/* =========================================================================
            STAGE 0: HERO VIEW (0.00 - 0.08)
            (100% EXACT MATCH TO media_1793183705326_ff0628a8.png)
           ========================================================================= */}
        <div
          className="intro-block hero absolute inset-0 flex flex-col justify-center gap-5 sm:gap-6 z-20 px-8 sm:px-14 lg:px-20 pointer-events-auto transition-transform"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${-scrollProgress * 200}px)`,
            pointerEvents: heroOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          <div
            className="font-mono font-bold text-[13px] sm:text-[14px] text-[#121212] tracking-[0.16em] uppercase leading-tight select-none"
            style={{ color: '#121212' }}
          >
            <div>3D PRODUCT VISUALIZATION</div>
            <div>STUDIO</div>
          </div>

          <h1
            className="font-heading font-black text-[#121212] tracking-[-0.035em] text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.92]"
            style={{ color: '#121212' }}
          >
            Bringing products
          </h1>

          <p
            className="text-[17px] sm:text-[19px] text-[#121212] max-w-[440px] font-normal leading-[1.45]"
            style={{ color: '#121212' }}
          >
            Product animation, photoreal CGI and AI
            <br className="hidden sm:inline" /> video for launch-ready brands.
          </p>

          <div className="flex items-center gap-3.5 pt-1 flex-wrap">
            <a
              className="inline-flex items-center justify-center bg-[#121212] hover:bg-[#252525] text-white font-heading font-semibold text-[14.5px] sm:text-[15px] px-6 py-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
              style={{ color: '#FFFFFF', backgroundColor: '#121212' }}
              href="#finale"
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
              className="inline-flex items-center justify-center bg-transparent hover:bg-black/5 text-[#121212] border border-[#121212] font-heading font-semibold text-[14.5px] sm:text-[15px] px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
              style={{ color: '#121212', borderColor: '#121212' }}
              href="#work"
              onClick={() => playSound('hover', soundEnabled)}
            >
              See the work
            </a>
          </div>
        </div>

        {/* =========================================================================
            STAGE 1: "BORN FROM COLOUR." TEXT (BOTTOM-LEFT, 0.08 - 0.28)
           ========================================================================= */}
        <div
          className="intro-block stage-1 absolute left-8 sm:left-14 lg:left-20 bottom-16 sm:bottom-20 z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: stage1TextOpacity,
            transform: `translateY(${(1 - stage1In) * 25 - stage1Out * 25}px)`,
            pointerEvents: stage1TextOpacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <p className="font-mono text-xs sm:text-[13px] text-[#737373] uppercase tracking-[0.18em] mb-2.5 font-semibold select-none">
            LAHORE · RAS AL-KHAIMAH
          </p>

          <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-[#121212] tracking-tight leading-[1.0] select-none">
            Born from colour.
          </h2>
        </div>

        {/* =========================================================================
            STAGE 2: "ENGINEERED LIKE A PRODUCT." (LEFT SIDE)
            (EXACT MATCH TO media_1793194716254_c58ab100.png: Slides up on exit!)
           ========================================================================= */}
        <div
          className="intro-block stage-2 absolute left-8 sm:left-14 lg:left-20 top-1/2 -translate-y-1/2 max-w-[540px] z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: stage2TextOpacity,
            transform: `translateY(calc(-50% + ${stage2ShiftY}px))`,
            pointerEvents: stage2TextOpacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <p className="font-mono text-xs sm:text-[13px] text-[#737373] uppercase tracking-[0.18em] mb-4 font-semibold select-none">
            INNOVATION · ENGINEERING · MOTION
          </p>

          <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-[#121212] tracking-tight leading-[1.04] select-none">
            Engineered <br />
            like a product. <br />
            Rendered <br />
            like a film.
          </h2>
        </div>

        {/* =========================================================================
            STAGE 3: SERVICES 01 TO 06 (LEFT SIDE, 0.54 - 0.94)
            (EXACT 100% MATCH TO REFERENCE IMAGES: media_1793270207145_61a9a273.png,
             media_1793270231208_bc73db50.png, media_1793270247206_99ffb95e.png,
             media_1793270295055_61126602.png)
           ========================================================================= */}
        <div
          className="intro-block stage-3 absolute left-8 sm:left-14 lg:left-24 top-1/2 -translate-y-1/2 max-w-[520px] lg:max-w-[580px] z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: servicesPanelOpacity,
            transform: `translateY(calc(-50% + ${servicesShiftY}px))`,
            pointerEvents: servicesPanelOpacity > 0.4 ? 'auto' : 'none',
          }}
        >
          {/* Eyebrow: SERVICES · 01 / 06 */}
          <p className="font-mono font-medium text-xs sm:text-[13px] text-[#64748b] uppercase tracking-[0.20em] mb-5 sm:mb-6 select-none">
            SERVICES &middot; <span className="font-bold text-[#121212]">0{activeFace + 1}</span> / 06
          </p>

          <div className="relative min-h-[300px] sm:min-h-[340px]">
            {SERVICES.map((srv, i) => (
              <div
                key={srv.n}
                className={`transition-all duration-300 absolute inset-0 flex flex-col justify-start ${
                  activeFace === i
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <h3 className="font-heading font-black text-4xl sm:text-5xl md:text-[56px] lg:text-[64px] text-[#121212] tracking-[-0.035em] leading-[1.03] select-none">
                  {srv.titleLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </h3>

                <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#4a5568] font-normal leading-[1.45] mt-5 sm:mt-6 select-none max-w-[460px]">
                  {srv.desc}
                </p>

                <a
                  href={srv.link}
                  className="group font-sans font-semibold text-base sm:text-[17px] text-[#0e6f77] hover:text-[#0b5c64] inline-flex items-center gap-2 mt-6 sm:mt-8 transition-colors duration-150 cursor-pointer w-fit"
                  onClick={() => playSound('hover', soundEnabled)}
                >
                  <span>{srv.cta.replace('→', '').trim()}</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MAIN UNIFIED 3D BOX (RIGHT SIDE)
            - Starts centered in Stage 1 & 1.5
            - Glides smoothly to right side in Stage 2
            - STAYS PINNED ON THE RIGHT SIDE and ROLLS LIKE A DICE in Stage 3!
            - 100% SAME CONTINUOUS ACTOR!
           ========================================================================= */}
        <div
          className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            opacity: masterBoxOpacity,
            pointerEvents: masterBoxOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          <div
            className="relative pointer-events-auto flex items-center justify-center will-change-transform"
            style={{
              transform: `translate3d(${easeGlide * 23}vw, 0, 0) scale(${zoomScale})`,
            }}
          >
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px] flex items-center justify-center">
              
              {/* LAYER 0: The 3D Metal Cube (Handles both Stage 2 & Stage 3 Dice Rolling!) */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                style={{
                  opacity: morphProgress > 0.001 ? 1 : 0,
                  clipPath: (morphProgress > 0.001 && morphProgress < 0.999) ? bottomPolygon : 'none',
                  WebkitClipPath: (morphProgress > 0.001 && morphProgress < 0.999) ? bottomPolygon : 'none',
                  pointerEvents: morphProgress >= 0.8 ? 'auto' : 'none',
                }}
              >
                <Bw3DCube
                  scrollProgress={scrollProgress}
                  serviceProgress={serviceProgress}
                  isInteractive={morphProgress >= 0.8}
                />
              </div>

              {/* LAYER 1: Pehla wala 2D BW Logo Box (BwIcon) */}
              {morphProgress < 0.999 && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20"
                  style={{
                    clipPath: morphProgress > 0.001 ? topPolygon : 'none',
                    WebkitClipPath: morphProgress > 0.001 ? topPolygon : 'none',
                  }}
                >
                  <div className="w-[340px] h-[282px] sm:w-[420px] sm:h-[348px] md:w-[480px] md:h-[398px] lg:w-[500px] lg:h-[415px] flex items-center justify-center -translate-y-2">
                    <BwIcon className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.06)]" />
                  </div>
                </div>
              )}

              {/* LAYER 2: Glowing Cyan Neon Laser Divider Line */}
              {morphProgress > 0.005 && morphProgress < 0.995 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#33C0CA"
                    strokeWidth="6.0"
                    strokeLinecap="round"
                    style={{ opacity: 0.5, filter: 'drop-shadow(0 0 12px #33C0CA)' }}
                  />
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ opacity: 0.85, filter: 'drop-shadow(0 0 6px #38BDF8)' }}
                  />
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#E0FCFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 3 -> 4 TRANSITION: ZOOMING "EXHIBITION & BRAND"
            (EXACT MATCH TO media_1793195425332_82063534.png)
            - As user scrolls past Service 06 (Exhibition & Brand), this text scales up
              from the cube towards the camera, transitioning to turquoise canvas and
              taking the user into "Every industry. One studio."
           ========================================================================= */}
        {scrollProgress > 0.88 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-30 will-change-transform"
            style={{
              opacity: Math.min((scrollProgress - 0.88) / 0.05, 1),
              transform: `translate3d(${Math.max(1 - (scrollProgress - 0.88) / 0.08, 0) * 16}vw, 0, 0) scale(${1.0 + Math.max((scrollProgress - 0.88) / 0.08, 0) * 1.5})`,
            }}
          >
            <div className="font-heading font-black text-6xl sm:text-8xl md:text-[130px] lg:text-[170px] xl:text-[210px] text-white/55 tracking-[0.06em] leading-[0.88] text-center drop-shadow-[0_0_40px_rgba(255,255,255,0.7)]">
              <div>EXHIBITION</div>
              <div>& BRAND</div>
            </div>
          </div>
        )}

        {/* Bottom Scroll Hint */}
        <div
          className="absolute bottom-6 right-8 sm:right-14 z-20 font-mono text-[11px] font-semibold tracking-[0.25em] text-[#121212] uppercase transition-opacity duration-300 select-none pointer-events-none"
          style={{ opacity: heroOpacity, color: '#121212' }}
        >
          SCROLL
        </div>

      </div>
    </section>
  );
}

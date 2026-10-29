import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSound } from '../utils/audio';
import Cybertruck3DStage from './Cybertruck3DStage';
import InteractiveParallaxStage from './InteractiveParallaxStage';
import FootwearStage from './FootwearStage';
import FragranceStage from './FragranceStage';
import SkincareStage from './SkincareStage';
import AdvertisingStage from './AdvertisingStage';

// User-uploaded high-res reference screenshots
import footwearImg from '@user_uploaded/media_1793202590252_ab909e53.jpg';
import skincareImg from '@user_uploaded/media_1793197217211_9909509c.png';
import electronicsImg from '@user_uploaded/media_1793197230864_9f4524f4.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * 8 Showcase Categories:
 * - 01/08: Footwear (Step 0: Image -> Step 1: Video)
 * - 02/08: Fragrance (Step 2: Liquid Hand Perfume Video)
 * - 03/08: Skincare (Step 3: Image)
 * - 04/08: Electronics (Step 4: Image)
 * - 05/08: Automotive (Step 5: 3D Cybertruck Stage)
 * - 06/08: Industrial (Step 6)
 * - 07/08: Home & bath (Step 7)
 * - 08/08: Advertising (Step 8)
 */
export const SHOWCASE_CATEGORIES = [
  {
    id: 'footwear',
    num: '01 / 08',
    title: 'Footwear',
    subTag: 'LAUNCH FILM · PREMIUM SNEAKER',
    frame: 850,
    bgTone: '#1e1a12',
    accentColor: '#38bdf8',
    hasBakedUi: false,
  },
  {
    id: 'fragrance',
    num: '02 / 08',
    title: 'Fragrance',
    subTag: 'GLASS, LIQUID & LIGHT',
    frame: 863,
    bgTone: '#2a0a0e',
    accentColor: '#38bdf8',
    hasBakedUi: false,
  },
  {
    id: 'skincare',
    num: '03 / 08',
    title: 'Skincare',
    subTag: 'CGI + AI CAMPAIGN · PROVEN',
    frame: 915,
    bgTone: '#12161c',
    accentColor: '#38bdf8',
    hasBakedUi: false,
  },
  {
    id: 'electronics',
    num: '04 / 08',
    title: 'Electronics',
    subTag: 'EXPLODED VIEW · SMARTPHONE',
    frame: 941,
    bgTone: '#0a0b0d',
    accentColor: '#38bdf8',
    image: electronicsImg,
    hasBakedUi: true,
  },
  {
    id: 'advertising',
    num: '08 / 08',
    title: 'Advertising',
    subTag: 'CGI IN LIVE FOOTAGE',
    frame: 1114,
    bgTone: '#18181b',
    accentColor: '#38bdf8',
    hasBakedUi: false,
  },
];

const TOTAL_STEPS = 5;

export default function InsideSection({ soundEnabled, onScrollProgressUpdate }) {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0); // Starts on Slide 01: Footwear
  const [progress, setProgress] = useState(0.0);

  // GSAP ScrollTrigger: Pinned container scrubbing through all steps seamlessly
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          setProgress(p);

          const stepPos = p * (TOTAL_STEPS - 1);
          const catIdx = Math.min(Math.floor(stepPos + 0.4), TOTAL_STEPS - 1);

          setActiveIdx(catIdx);

          const curCat = SHOWCASE_CATEGORIES[catIdx];
          if (onScrollProgressUpdate) {
            onScrollProgressUpdate(p, curCat.frame, '04 · Inside the box', 'industries');
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [onScrollProgressUpdate]);

  const activeCategory = SHOWCASE_CATEGORIES[activeIdx];

  // Continuous scroll-driven transition calculation for each step
  const getStepStyle = (index) => {
    const currentPos = progress * (TOTAL_STEPS - 1);
    const diff = currentPos - index;
    const dist = Math.abs(diff);

    // If completely out of range (more than 1 step distance away), hide
    if (dist >= 1.0) {
      return {
        opacity: 0,
        transform: 'scale(0.96)',
        pointerEvents: 'none',
        visibility: 'hidden',
      };
    }

    // Smoothstep interpolation for silky continuous crossfade
    const t = 1 - dist;
    const opacity = t * t * (3 - 2 * t);
    const scale = 0.97 + opacity * 0.03;
    const translateY = diff * -25; // Subtle cinematic parallax shift

    return {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      pointerEvents: opacity > 0.6 ? 'auto' : 'none',
      visibility: opacity > 0.005 ? 'visible' : 'hidden',
      willChange: 'opacity, transform',
    };
  };

  // Click on indicator dot smoothly scrolls to that category
  const scrollToCategory = (idx) => {
    playSound('hover', soundEnabled);
    setActiveIdx(idx);
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    
    const scrollTarget =
      section.offsetTop +
      (idx / (TOTAL_STEPS - 1)) * (section.offsetHeight - window.innerHeight);

    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  };

  const currentStepPos = progress * (TOTAL_STEPS - 1);

  return (
    <section
      id="inside"
      ref={sectionRef}
      className="chapter relative h-[500vh] bg-[#0e1114] text-white select-none"
    >
      {/* Pinned Fullscreen Stage Viewport (sticky top-0) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* =====================================================================
            STAGE BACKDROPS & 3D MODELS (SCROLL-DRIVEN PROGRESSION)
            - Step 0: Footwear IMAGE (Air Jordan 12 Screenshot)
            - Step 1: Footwear VIDEO (gemini_generated_video_89c10a2d.mp4)
            - Step 2: Fragrance VIDEO (Liquid_hand_holding_perfume_bottle_8df488cc.mp4)
            - Step 3: Skincare VIDEO (Cosmetic_jar_opening_with_water_b3f4d9e9.mp4)
            - Step 4: Electronics IMAGE
            - Step 5: Advertising VIDEO (Products_floating_in_commercial_…_f706c028.mp4)
           ===================================================================== */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
          
          {/* Step 0: DIRECT FOOTWEAR VIDEO (D:\images\gemini_generated_video_89c10a2d.mp4) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
            style={getStepStyle(0)}
          >
            <FootwearStage
              isActive={Math.abs(currentStepPos - 0) < 0.8}
            />
          </div>

          {/* Step 1: FRAGRANCE VIDEO (Liquid_hand_holding_perfume_bottle_8df488cc.mp4) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
            style={getStepStyle(1)}
          >
            <FragranceStage
              isActive={Math.abs(currentStepPos - 1) < 0.8}
            />
          </div>

          {/* Step 2: SKINCARE VIDEO (Cosmetic_jar_opening_with_water_b3f4d9e9.mp4) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
            style={getStepStyle(2)}
          >
            <SkincareStage
              isActive={Math.abs(currentStepPos - 2) < 0.8}
            />
          </div>

          {/* Step 3: ELECTRONICS (Exploded View Smartphone) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
            style={getStepStyle(3)}
          >
            <InteractiveParallaxStage
              image={electronicsImg}
              alt="Electronics - Exploded View Smartphone"
              glowTone="rgba(56, 189, 248, 0.10)"
            />
          </div>

          {/* Step 4: ADVERTISING VIDEO (Products_floating_in_commercial_…_f706c028.mp4) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
            style={getStepStyle(4)}
          >
            <AdvertisingStage
              isActive={Math.abs(currentStepPos - 4) < 0.8}
            />
          </div>
        </div>

        {/* Top spacer (reserves header clearance for Navbar) */}
        <div className="z-20 h-16 pointer-events-none" />

        {/* =====================================================================
            BOTTOM UI BAR (EXACT MATCH TO REFERENCE SCREENSHOTS):
            - For slides with baked-in reference screenshots (Footwear, Fragrance,
              Skincare, Electronics), the bottom-left text is hidden to avoid duplicate text.
            - For Automotive (Slide 05) and custom slides, live HTML UI renders cleanly.
            - Bottom-right pagination dots & counter stay interactive across ALL slides!
           ===================================================================== */}
        <div className="z-30 px-8 sm:px-14 lg:px-16 pb-8 sm:pb-12 flex items-end justify-between pointer-events-none w-full">
          
          {/* Bottom-Left Information Stack */}
          <div
            className={`flex flex-col items-start gap-1 sm:gap-1.5 max-w-[680px] transition-opacity duration-300 ${
              activeCategory.hasBakedUi ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
          >
            {/* 1. Category Sub-Tag in Teal/Cyan font */}
            <p className="font-mono text-xs sm:text-[13px] font-bold text-[#38bdf8] uppercase tracking-[0.22em] select-none transition-all duration-300">
              {activeCategory.subTag}
            </p>

            {/* 2. Main Large Category Title */}
            <h2 className="font-heading font-black text-6xl sm:text-7xl md:text-8xl lg:text-[104px] text-white tracking-[-0.035em] leading-[0.92] select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              {activeCategory.title}
            </h2>

            {/* 3. Capsule/Pill-Shaped HUD Metadata Box */}
            <div className="mt-2.5 inline-flex items-center gap-2 bg-[#181d22]/85 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md select-none pointer-events-auto">
              <span className="font-mono text-[11px] sm:text-xs text-[#e2e8f0] tracking-[0.16em] uppercase font-medium">
                SCENE 04 · INSIDE THE BOX &nbsp; FRAME {String(activeCategory.frame).padStart(4, '0')} / 24 FPS
              </span>
            </div>
          </div>

          {/* Bottom-Right Pagination Counter */}
          <div className="flex flex-col items-end gap-3 select-none">
            {/* Category quick indicator dots (interactive for all 8 categories) */}
            <div className="hidden sm:flex items-center gap-1.5 pointer-events-auto">
              {SHOWCASE_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === idx
                      ? 'w-6 bg-[#38bdf8]'
                      : 'w-1.5 bg-white/25 hover:bg-white/60'
                  }`}
                  title={cat.title}
                />
              ))}
            </div>

            {/* Pagination Counter: "01 / 08", "05 / 08", etc. (only shown when not baked into image) */}
            <div
              className={`font-mono font-bold text-base sm:text-lg text-white/90 tracking-[0.22em] transition-opacity duration-300 ${
                activeCategory.hasBakedUi ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {activeCategory.num}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

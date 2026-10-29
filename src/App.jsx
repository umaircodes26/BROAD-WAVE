import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BackgroundWaveCanvas from './components/BackgroundWaveCanvas';
import Navbar from './components/Navbar';
import HudBar from './components/HudBar';
import IntroSection from './components/IntroSection';
import InsideSection from './components/InsideSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [hudScene, setHudScene] = useState('01 · The wave');
  const [hudFrame, setHudFrame] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');

  // 1. Initialize Lenis Smooth Scrolling (Apple-style Momentum Feel)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  // 2. Dynamic HUD scene & frame tracker matching bwcreations.co
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const introH = window.innerHeight * 6.2;

      // Update scene label & active nav section when scrolled past IntroSection
      if (scrollY >= introH) {
        setHudScene('04 · Industries');
        setActiveSection('industries');
        setHudFrame(240);
      } else {
        setActiveSection('intro');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-[#121212] selection:bg-[#33C0CA] selection:text-[#121212]">
      {/* 1. Fullscreen 2D Fluid Silk Wave Canvas (#gl) */}
      <BackgroundWaveCanvas />

      {/* 2. Header Bar (Brand Logo & Dark Navigation Capsule) */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        activeSection={activeSection}
      />

      {/* 3. Floating Bottom HUD Bar (Scene 01 · The wave | Frame 0000 / 24 fps) */}
      <HudBar
        scene={hudScene}
        frame={hudFrame}
        isVisible={activeSection !== 'industries'}
      />

      {/* 4. Main Scroll Chapters */}
      <main className="relative z-10">
        {/* Master Intro & Capabilities Chapter (#intro & #capabilities: 720vh) */}
        <IntroSection
          soundEnabled={soundEnabled}
          onOpenProjectModal={() => setIsProjectModalOpen(true)}
          onScrollProgressUpdate={(p, frame, scene, sectionName) => {
            if (scene) setHudScene(scene);
            if (sectionName) setActiveSection(sectionName);
            if (frame !== undefined) setHudFrame(frame);
          }}
        />

        {/* Inside the Box Chapter (#inside: 500vh) */}
        <InsideSection
          soundEnabled={soundEnabled}
          onScrollProgressUpdate={(p, frame, scene, sectionName) => {
            if (scene) setHudScene(scene);
            if (sectionName) setActiveSection(sectionName);
            if (frame !== undefined) setHudFrame(frame);
          }}
        />
      </main>

      {/* 5. Footer */}
      <Footer soundEnabled={soundEnabled} />

      {/* 6. Interactive "Start a Project" Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}

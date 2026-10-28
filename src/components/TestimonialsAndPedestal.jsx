import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles, Upload } from 'lucide-react';
import { playSound } from '../utils/audio';

const TESTIMONIALS = [
  {
    quote: "Broad Wave Creations transformed our CAD files into a visual masterpiece that powered our entire global keynote launch. Their photoreal rendering exceeded what physical cameras could achieve.",
    author: "Elena Rostova",
    role: "VP of Brand Innovation",
    company: "Aether Dynamics",
    stars: 5,
  },
  {
    quote: "The interactive 3D WebGL configurator increased our e-commerce dwell time by 340%. The fluid simulations and material lookdev are genuinely museum-grade.",
    author: "Marcus Vance",
    role: "Global Creative Director",
    company: "Kinetix Footwear",
    stars: 5,
  },
  {
    quote: "Zero physical prototypes were needed for our campaign. Broad Wave delivered 16K stills and 3 cinematic commercials 3 months before tooling was even finished.",
    author: "David Kim",
    role: "Head of Product Design",
    company: "Vektor EV Mobility",
    stars: 5,
  },
];

export default function TestimonialsAndPedestal({ soundEnabled, onOpenProjectModal }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const pedestalMountRef = useRef(null);

  // Pedestal 3D Scene
  useEffect(() => {
    const container = pedestalMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x22d3ee, 4.0);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    // Pedestal Base
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.3, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x071922,
      metalness: 0.9,
      roughness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.5;
    pedestalGroup.add(baseMesh);

    // Glowing Neon Rim
    const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 3.0,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.34;
    pedestalGroup.add(ringMesh);

    // Holographic Floating "Your Product Goes Here" Placeholder Geometry
    const placeholderGroup = new THREE.Group();
    scene.add(placeholderGroup);

    // Floating Glass Icosahedron / Diamond
    const icoGeo = new THREE.IcosahedronGeometry(0.75, 1);
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.8,
      roughness: 0.1,
      thickness: 1.0,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.y = 0.5;
    placeholderGroup.add(icoMesh);

    // Glowing Wireframe Cage around placeholder
    const wireGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.y = 0.5;
    placeholderGroup.add(wireMesh);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow pedestal spin
      pedestalGroup.rotation.y += 0.005;

      // Anti-gravity float & spin of placeholder
      placeholderGroup.rotation.y += 0.015;
      placeholderGroup.rotation.x = Math.sin(elapsed * 1.5) * 0.15;
      placeholderGroup.position.y = Math.sin(elapsed * 2.0) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

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
    <section className="relative py-24 px-6 sm:px-10 z-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: CLIENT TESTIMONIALS CAROUSEL */}
          <div className="lg:col-span-7 bg-[#071922] rounded-3xl p-8 sm:p-12 border border-cyan-500/25 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(current.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <span className="font-mono-hud text-xs text-cyan-400 font-bold tracking-widest uppercase">
                // CLIENT VERIFIED
              </span>
            </div>

            <Quote className="w-10 h-10 text-cyan-400/30 mb-4" />

            <blockquote className="text-xl sm:text-2xl font-heading font-medium text-white leading-relaxed mb-8 min-h-[110px]">
              “{current.quote}”
            </blockquote>

            <div className="flex items-center justify-between pt-6 border-t border-cyan-500/20">
              <div>
                <h4 className="font-heading font-bold text-lg text-white">
                  {current.author}
                </h4>
                <p className="font-mono-hud text-xs text-cyan-300">
                  {current.role} — <span className="text-slate-300 font-semibold">{current.company}</span>
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2.5 rounded-full bg-black/40 text-slate-300 hover:text-white hover:bg-cyan-950/60 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2.5 rounded-full bg-black/40 text-slate-300 hover:text-white hover:bg-cyan-950/60 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE 3D "YOUR PRODUCT GOES HERE" PEDESTAL */}
          <div className="lg:col-span-5 bg-[#071922] rounded-3xl p-8 border border-cyan-500/25 shadow-2xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-mono-hud text-xs tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE STAGE</span>
            </div>

            <h3 className="text-2xl font-heading font-black text-white mb-1">
              Your Product Goes Here.
            </h3>
            <p className="text-xs text-slate-300 mb-2 max-w-xs">
              Upload your CAD or send us your concept napkin sketch. We engineer the rest.
            </p>

            {/* 3D Pedestal Mount */}
            <div ref={pedestalMountRef} className="w-full h-64 select-none relative" />

            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenProjectModal();
              }}
              className="w-full py-3.5 rounded-full font-mono-hud text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/30 active:scale-95 cursor-pointer mt-2"
            >
              <Upload className="w-4 h-4" />
              <span>CLAIM YOUR LAUNCH STAGE NOW</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


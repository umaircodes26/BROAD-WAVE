import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sliders, Sun, Camera, Layers, Box, Eye, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function RenderStageConfigurator({ soundEnabled, onOpenProjectModal }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const lightsRef = useRef({});
  const partsRef = useRef([]);

  const [renderMode, setRenderMode] = useState('pbr'); // 'pbr', 'clay', 'wireframe', 'xray'
  const [lightingPreset, setLightingPreset] = useState('studio'); // 'studio', 'cyber', 'golden', 'rim'
  const [cameraView, setCameraView] = useState('side'); // 'side', 'front', 'top', 'back'
  const [explodeSlider, setExplodeSlider] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4, 1.5, 4.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Dynamic Lights for presets
    const ambLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5f3fc, 1.5);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 3.5);
    rimLight.position.set(-3, -2, -4);
    scene.add(rimLight);

    lightsRef.current = { ambLight, keyLight, fillLight, rimLight };

    // Procedural Studio Shadow Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.9;
    scene.add(floorMesh);

    // ==========================================
    // 3D SNEAKER / HIGH-TECH PRODUCT GEOMETRY
    // ==========================================
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const parts = [];

    // Part 1: Outsole (Aerodynamic Traction Base)
    const outsoleGeo = new THREE.CylinderGeometry(0.7, 0.95, 0.28, 32);
    outsoleGeo.scale(1.8, 1, 0.9);
    const outsoleMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.1,
    });
    const outsoleMesh = new THREE.Mesh(outsoleGeo, outsoleMat);
    outsoleMesh.position.y = -0.65;
    modelGroup.add(outsoleMesh);
    parts.push({ mesh: outsoleMesh, basePos: new THREE.Vector3(0, -0.65, 0), explodeOffset: new THREE.Vector3(0, -0.8, 0), originalColor: 0x0f172a, originalMetal: 0.1 });

    // Part 2: Carbon Fiber Kinetic Midsole Plate
    const plateGeo = new THREE.BoxGeometry(2.3, 0.08, 1.2);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.25,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -0.45;
    modelGroup.add(plateMesh);
    parts.push({ mesh: plateMesh, basePos: new THREE.Vector3(0, -0.45, 0), explodeOffset: new THREE.Vector3(0, -0.4, 0.5), originalColor: 0x1e293b, originalMetal: 0.9 });

    // Part 3: Cushioning Energy Core / Air Chamber (Translucent Cyan)
    const airGeo = new THREE.TorusGeometry(0.55, 0.15, 16, 32);
    airGeo.scale(1.5, 0.6, 1);
    const airMat = new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      transmission: 0.85,
      roughness: 0.05,
      thickness: 1.0,
      transparent: true,
      opacity: 0.9,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
    });
    const airMesh = new THREE.Mesh(airGeo, airMat);
    airMesh.position.y = -0.3;
    airMesh.rotation.x = Math.PI / 2;
    modelGroup.add(airMesh);
    parts.push({ mesh: airMesh, basePos: new THREE.Vector3(0, -0.3, 0), explodeOffset: new THREE.Vector3(0, -0.2, -0.6), originalColor: 0x22d3ee, originalMetal: 0.3 });

    // Part 4: Upper Textile / Aerodynamic Chassis
    const upperGeo = new THREE.ConeGeometry(0.85, 1.5, 32);
    upperGeo.scale(1.4, 0.8, 1);
    upperGeo.rotateZ(Math.PI / 1.7);
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.3,
    });
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0.1, 0.1, 0);
    modelGroup.add(upperMesh);
    parts.push({ mesh: upperMesh, basePos: new THREE.Vector3(0.1, 0.1, 0), explodeOffset: new THREE.Vector3(0, 0.6, 0), originalColor: 0x0284c7, originalMetal: 0.3 });

    // Part 5: Exo-Lacing Harness & Heel Counter
    const collarGeo = new THREE.TorusGeometry(0.48, 0.12, 16, 32);
    collarGeo.rotateX(Math.PI / 3);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(-0.5, 0.6, 0);
    modelGroup.add(collarMesh);
    parts.push({ mesh: collarMesh, basePos: new THREE.Vector3(-0.5, 0.6, 0), explodeOffset: new THREE.Vector3(-0.7, 1.1, 0.4), originalColor: 0x38bdf8, originalMetal: 0.8 });

    partsRef.current = parts;

    // Mouse drag rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.2;
    let rotY = -0.6;

    const handleDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    // Resize
    const handleResize = () => {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        rotY += 0.003;
      }
      modelGroup.rotation.y += (rotY - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x += (rotX - modelGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  // Update Render Mode (PBR, Clay, Wireframe, X-Ray)
  useEffect(() => {
    partsRef.current.forEach(({ mesh, originalColor, originalMetal }) => {
      if (!mesh || !mesh.material) return;
      const mat = mesh.material;

      if (renderMode === 'clay') {
        mat.wireframe = false;
        mat.color.setHex(0xe2e8f0);
        mat.roughness = 0.9;
        mat.metalness = 0.0;
        mat.transparent = false;
        mat.opacity = 1.0;
      } else if (renderMode === 'wireframe') {
        mat.wireframe = true;
        mat.color.setHex(0x22d3ee);
        mat.roughness = 0.2;
        mat.metalness = 0.5;
        mat.transparent = true;
        mat.opacity = 0.85;
      } else if (renderMode === 'xray') {
        mat.wireframe = false;
        mat.color.setHex(0x38bdf8);
        mat.transparent = true;
        mat.opacity = 0.35;
        mat.roughness = 0.1;
      } else {
        // PBR Full
        mat.wireframe = false;
        mat.color.setHex(originalColor);
        mat.roughness = 0.35;
        mat.metalness = originalMetal;
        mat.transparent = false;
        mat.opacity = 1.0;
      }
      mat.needsUpdate = true;
    });
  }, [renderMode]);

  // Update Lighting Presets
  useEffect(() => {
    const { keyLight, fillLight, rimLight, ambLight } = lightsRef.current;
    if (!keyLight) return;

    if (lightingPreset === 'cyber') {
      keyLight.color.setHex(0x06b6d4);
      keyLight.intensity = 3.5;
      fillLight.color.setHex(0xec4899);
      fillLight.intensity = 2.5;
      rimLight.color.setHex(0x22d3ee);
      rimLight.intensity = 4.5;
      ambLight.intensity = 0.6;
    } else if (lightingPreset === 'golden') {
      keyLight.color.setHex(0xf59e0b);
      keyLight.intensity = 3.8;
      fillLight.color.setHex(0xd97706);
      fillLight.intensity = 2.0;
      rimLight.color.setHex(0xfef3c7);
      rimLight.intensity = 2.5;
      ambLight.intensity = 0.8;
    } else if (lightingPreset === 'rim') {
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 0.6;
      fillLight.color.setHex(0x083344);
      fillLight.intensity = 0.4;
      rimLight.color.setHex(0x38bdf8);
      rimLight.intensity = 6.0;
      ambLight.intensity = 0.3;
    } else {
      // Studio
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 2.8;
      fillLight.color.setHex(0xa5f3fc);
      fillLight.intensity = 1.8;
      rimLight.color.setHex(0x22d3ee);
      rimLight.intensity = 3.5;
      ambLight.intensity = 1.2;
    }
  }, [lightingPreset]);

  // Update Camera View Presets
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    if (cameraView === 'front') {
      cam.position.set(0, 0.4, 5.2);
    } else if (cameraView === 'top') {
      cam.position.set(0, 5.5, 0.8);
    } else if (cameraView === 'back') {
      cam.position.set(-4.5, 1.2, -3.2);
    } else {
      // Side profile
      cam.position.set(4, 1.5, 4.5);
    }
    cam.lookAt(0, 0, 0);
  }, [cameraView]);

  // Update Exploded View Slider
  useEffect(() => {
    partsRef.current.forEach(({ mesh, basePos, explodeOffset }) => {
      if (!mesh) return;
      const targetPos = basePos.clone().add(explodeOffset.clone().multiplyScalar(explodeSlider));
      mesh.position.copy(targetPos);
    });
  }, [explodeSlider]);

  return (
    <section id="configurator" className="relative py-24 px-6 sm:px-10 z-20">
      <div className="max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071922] text-cyan-300 font-mono-hud text-xs tracking-widest uppercase mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            FEATURE 03 // CAD TO FILM RENDER STAGE
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#071720] tracking-tight">
            Interactive 3D LookDev & <br />
            <span className="text-cyan-900 underline decoration-cyan-400 decoration-wavy decoration-2">
              Virtual Production Stage.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#082a37]/85 mt-3 max-w-xl mx-auto font-medium">
            Toggle between Clay AO, Wireframe geometry, and raytraced PBR materials in real-time. Test multiple lighting rigs and camera angles directly in your browser.
          </p>
        </div>

        {/* 3D VIEWPORT CONTAINER */}
        <div className="relative rounded-3xl bg-[#071922] border border-cyan-500/30 shadow-2xl p-4 sm:p-8 overflow-hidden">
          {/* Top HUD Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/20 z-20 relative">
            {/* Render Shading Modes */}
            <div className="flex items-center gap-2">
              <span className="font-mono-hud text-xs text-slate-400 uppercase tracking-wider mr-1">
                SHADING:
              </span>
              {[
                { id: 'pbr', label: 'PBR Materials' },
                { id: 'clay', label: 'Clay AO' },
                { id: 'wireframe', label: 'Wireframe' },
                { id: 'xray', label: 'X-Ray Cutaway' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setRenderMode(m.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud font-bold transition-all ${
                    renderMode === m.id
                      ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30'
                      : 'bg-black/40 text-slate-300 hover:text-white border border-cyan-500/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Lighting Rig Presets */}
            <div className="flex items-center gap-2">
              <span className="font-mono-hud text-xs text-slate-400 uppercase tracking-wider mr-1">
                LIGHT RIG:
              </span>
              {[
                { id: 'studio', label: 'Studio Softbox' },
                { id: 'cyber', label: 'Cyber Neon' },
                { id: 'golden', label: 'Golden Hour' },
                { id: 'rim', label: 'Dark Rim' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    playSound('hover', soundEnabled);
                    setLightingPreset(l.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud font-bold transition-all ${
                    lightingPreset === l.id
                      ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30'
                      : 'bg-black/40 text-slate-300 hover:text-white border border-cyan-500/20'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center 3D Viewport Area */}
          <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden my-4 bg-gradient-to-b from-[#020d13] to-[#041a24] flex items-center justify-center">
            {/* The 3D Canvas */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            />

            {/* Watermark in corner */}
            <div className="absolute top-4 left-4 font-mono-hud text-[11px] text-cyan-400/80 border border-cyan-500/30 px-3 py-1 rounded-md bg-black/80 pointer-events-none">
              CAD_VIEWPORT // BROAD WAVE ENGINE v2.4
            </div>

            {/* Camera Angle Selector Over Viewport */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-[#030e14]/95 p-1.5 rounded-xl border border-cyan-500/30 z-20">
              <span className="font-mono-hud text-[10px] text-slate-400 px-2 py-0.5 uppercase">
                CAM_ANGLES
              </span>
              {[
                { id: 'side', label: 'Side 45°' },
                { id: 'front', label: 'Front Elevation' },
                { id: 'top', label: 'Top-Down' },
                { id: 'back', label: 'Back Heel' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setCameraView(c.id);
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono-hud font-semibold text-left transition-all ${
                    cameraView === c.id
                      ? 'bg-cyan-400 text-black font-bold'
                      : 'text-slate-300 hover:bg-cyan-950/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Drag hint */}
            <div className="absolute bottom-4 left-4 font-mono-hud text-[11px] text-slate-300 bg-black/80 px-3 py-1 rounded-md pointer-events-none">
              ⟲ DRAG ANYWHERE TO ROTATE 360°
            </div>
          </div>

          {/* Bottom Controls: Exploded View Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-cyan-500/20 z-20 relative">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="font-mono-hud text-xs font-bold text-cyan-300 uppercase tracking-widest shrink-0">
                EXPLODED VIEW (0% - 100%):
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodeSlider}
                onChange={(e) => setExplodeSlider(parseFloat(e.target.value))}
                onInput={() => playSound('hover', soundEnabled)}
                className="w-full sm:w-64 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono-hud text-xs text-slate-300 font-bold shrink-0">
                {Math.round(explodeSlider * 100)}%
              </span>
            </div>

            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenProjectModal();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full font-mono-hud text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
            >
              LOAD YOUR CAD MODEL INTO STAGE →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playSound } from '../utils/audio';

/**
 * ============================================================================
 * SCENE 05 · CAD TO FILM (ANATOMY OF A RENDER)
 * Exact 100% Match to Reference Screenshot (media_1793209701877_c6764217.png)
 * - Eyebrow: ANATOMY OF A RENDER
 * - Title: CAD to film.
 * - 4 Stages: 01 Wireframe | 02 Clay | 03 Materials | 04 Light
 * - Interactive Slider: ← RENDER ... CAD →
 * - Right Side: Live Interactive 3D Sneaker (Wireframe / Clay / Materials / Light)
 * - HUD Pill Badge: SCENE 05 · CAD TO FILM  FRAME 1236 / 24 FPS
 * ============================================================================
 */

const STAGES = [
  { id: 'wireframe', num: '01', label: 'Wireframe', sliderVal: 100 },
  { id: 'clay', num: '02', label: 'Clay', sliderVal: 66 },
  { id: 'materials', num: '03', label: 'Materials', sliderVal: 33 },
  { id: 'light', num: '04', label: 'Light', sliderVal: 0 },
];

export default function CadToFilmSection({ soundEnabled, onScrollProgressUpdate }) {
  const sectionRef = useRef(null);
  const canvasMountRef = useRef(null);
  const [activeStageIdx, setActiveStageIdx] = useState(0); // 0 = Wireframe (default in reference screenshot)
  const [sliderValue, setSliderValue] = useState(100); // 100 = CAD / Wireframe, 0 = RENDER / Light
  const [isDragging, setIsDragging] = useState(false);
  const sliderBarRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sneakerGroupRef = useRef(null);
  const materialsRef = useRef({});
  const lightsRef = useRef({});
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update slider position based on clicked stage
  const handleSelectStage = (idx) => {
    playSound('hover', soundEnabled);
    setActiveStageIdx(idx);
    setSliderValue(STAGES[idx].sliderVal);
  };

  // Slider dragging logic
  const updateSliderFromPointer = (clientX) => {
    if (!sliderBarRef.current) return;
    const rect = sliderBarRef.current.getBoundingClientRect();
    const rawP = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, rawP));
    const val = Math.round(clamped * 100);
    setSliderValue(val);

    // Map slider value (0-100) to closest stage:
    // val 0-16: Light (3), 17-50: Materials (2), 51-83: Clay (1), 84-100: Wireframe (0)
    let closestIdx = 0;
    if (val < 20) closestIdx = 3; // Light
    else if (val < 50) closestIdx = 2; // Materials
    else if (val < 80) closestIdx = 1; // Clay
    else closestIdx = 0; // Wireframe

    if (closestIdx !== activeStageIdx) {
      setActiveStageIdx(closestIdx);
      playSound('hover', soundEnabled);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSliderFromPointer(e.clientX);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDragging) {
        updateSliderFromPointer(e.clientX);
      }
    };
    const handlePointerUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, activeStageIdx]);

  // =========================================================================
  // THREE.JS 3D SNEAKER STAGE SETUP
  // =========================================================================
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Hero 3/4 perspective matching media_1793209701877_c6764217.png
    camera.position.set(-2.8, 1.8, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.5);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // Vibrant Cyan Rim Light for dramatic silhouette edge glow
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    rimLight.position.set(2, 6, -5);
    scene.add(rimLight);

    lightsRef.current = { ambLight, keyLight, fillLight, rimLight };

    // Sneaker Model Group
    const sneakerGroup = new THREE.Group();
    scene.add(sneakerGroup);
    sneakerGroupRef.current = sneakerGroup;

    // -----------------------------------------------------------------------
    // Material Definitions for the 4 Stages
    // -----------------------------------------------------------------------
    // 1. WIREFRAME MAT (Cyan glowing wireframe matching reference screenshot)
    const wireframeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38bdf8'),
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.65,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.4,
    });

    // 2. CLAY MAT (Studio matte clay finish)
    const clayMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d1d5db'),
      roughness: 0.9,
      metalness: 0.05,
      wireframe: false,
    });

    // 3. PHOTOREAL PBR MATERIALS (Air Jordan 12 / Premium sneaker)
    const pbrSoleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14171a'),
      roughness: 0.6,
      metalness: 0.1,
    });
    const pbrWhiteLeatherMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f8fafc'),
      roughness: 0.28,
      metalness: 0.15,
    });
    const pbrBlackLeatherMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c2024'),
      roughness: 0.42,
      metalness: 0.2,
    });
    const pbrCyanAccentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38bdf8'),
      roughness: 0.15,
      metalness: 0.85,
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.35,
    });
    const pbrLaceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#222830'),
      roughness: 0.75,
      metalness: 0.05,
    });

    materialsRef.current = {
      wireframeMat,
      clayMat,
      pbrSoleMat,
      pbrWhiteLeatherMat,
      pbrBlackLeatherMat,
      pbrCyanAccentMat,
      pbrLaceMat,
    };

    // -----------------------------------------------------------------------
    // High-Fidelity Sneaker Geometry
    // -----------------------------------------------------------------------
    const meshes = [];

    // 1. Sole / Outsole
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-1.8, -0.4);
    soleShape.lineTo(1.8, -0.4);
    soleShape.quadraticCurveTo(2.3, -0.2, 2.2, 0.1);
    soleShape.lineTo(1.7, 0.18);
    soleShape.quadraticCurveTo(0.2, 0.05, -1.2, 0.12);
    soleShape.quadraticCurveTo(-1.9, 0.0, -1.8, -0.4);

    const extrudeSettings = {
      depth: 1.1,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };
    const soleGeo = new THREE.ExtrudeGeometry(soleShape, extrudeSettings);
    soleGeo.center();
    const soleMesh = new THREE.Mesh(soleGeo, wireframeMat);
    soleMesh.position.set(0, -0.65, 0);
    sneakerGroup.add(soleMesh);
    meshes.push({ mesh: soleMesh, pbrMat: pbrSoleMat });

    // 2. Midsole Cushion Layer
    const midGeo = new THREE.BoxGeometry(3.6, 0.28, 1.15, 12, 4, 8);
    const midMesh = new THREE.Mesh(midGeo, wireframeMat);
    midMesh.position.set(0.05, -0.45, 0);
    sneakerGroup.add(midMesh);
    meshes.push({ mesh: midMesh, pbrMat: pbrBlackLeatherMat });

    // 3. Upper Body (Jordan 12 Contour)
    const upperGeo = new THREE.CylinderGeometry(0.55, 0.68, 1.8, 24, 16);
    upperGeo.scale(1.9, 0.9, 0.85);
    const upperMesh = new THREE.Mesh(upperGeo, wireframeMat);
    upperMesh.rotation.z = Math.PI / 2.3;
    upperMesh.position.set(0.1, 0.15, 0);
    sneakerGroup.add(upperMesh);
    meshes.push({ mesh: upperMesh, pbrMat: pbrWhiteLeatherMat });

    // 4. Heel / Ankle Collar
    const ankleGeo = new THREE.CylinderGeometry(0.48, 0.58, 1.1, 20, 10);
    ankleGeo.scale(0.85, 1.0, 0.85);
    const ankleMesh = new THREE.Mesh(ankleGeo, wireframeMat);
    ankleMesh.position.set(-0.95, 0.55, 0);
    ankleMesh.rotation.z = -0.15;
    sneakerGroup.add(ankleMesh);
    meshes.push({ mesh: ankleMesh, pbrMat: pbrWhiteLeatherMat });

    // 5. Toe Cap (Mudguard Curve)
    const toeGeo = new THREE.SphereGeometry(0.68, 20, 16, 0, Math.PI);
    toeGeo.scale(1.2, 0.65, 0.9);
    const toeMesh = new THREE.Mesh(toeGeo, wireframeMat);
    toeMesh.position.set(1.3, -0.22, 0);
    toeMesh.rotation.x = -Math.PI / 2;
    sneakerGroup.add(toeMesh);
    meshes.push({ mesh: toeMesh, pbrMat: pbrBlackLeatherMat });

    // 6. Mudguard Side Curves (Left and Right)
    const guardGeo = new THREE.TorusGeometry(0.95, 0.16, 12, 28, Math.PI * 0.7);
    const guardMeshL = new THREE.Mesh(guardGeo, wireframeMat);
    guardMeshL.position.set(0.4, -0.32, 0.5);
    guardMeshL.rotation.z = -0.35;
    sneakerGroup.add(guardMeshL);
    meshes.push({ mesh: guardMeshL, pbrMat: pbrBlackLeatherMat });

    const guardMeshR = guardMeshL.clone();
    guardMeshR.position.z = -0.5;
    sneakerGroup.add(guardMeshR);
    meshes.push({ mesh: guardMeshR, pbrMat: pbrBlackLeatherMat });

    // 7. Laces & Metallic Eyelets
    for (let i = 0; i < 5; i++) {
      const laceBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.72, 10, 4),
        wireframeMat
      );
      laceBar.rotation.x = Math.PI / 2;
      laceBar.rotation.z = 0.45;
      laceBar.position.set(-0.35 + i * 0.32, 0.12 + i * 0.16, 0);
      sneakerGroup.add(laceBar);
      meshes.push({ mesh: laceBar, pbrMat: pbrLaceMat });

      // Cyan metallic eyelet clips
      const eyeletL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.08, 4, 4, 4), wireframeMat);
      eyeletL.position.set(-0.35 + i * 0.32, 0.12 + i * 0.16, 0.38);
      sneakerGroup.add(eyeletL);
      meshes.push({ mesh: eyeletL, pbrMat: pbrCyanAccentMat });

      const eyeletR = eyeletL.clone();
      eyeletR.position.z = -0.38;
      sneakerGroup.add(eyeletR);
      meshes.push({ mesh: eyeletR, pbrMat: pbrCyanAccentMat });
    }

    // 8. Tongue
    const tongueGeo = new THREE.BoxGeometry(1.6, 0.12, 0.65, 12, 3, 6);
    const tongueMesh = new THREE.Mesh(tongueGeo, wireframeMat);
    tongueMesh.position.set(-0.1, 0.5, 0);
    tongueMesh.rotation.z = 0.55;
    sneakerGroup.add(tongueMesh);
    meshes.push({ mesh: tongueMesh, pbrMat: pbrBlackLeatherMat });

    materialsRef.current.meshList = meshes;

    // Orientation matching reference screenshot:
    // Tilted forward-up hero angle, toe pointing towards the right foreground
    sneakerGroup.rotation.set(-0.25, 0.85, 0.22);
    sneakerGroup.scale.setScalar(1.28);

    // Subtle contact floor glow
    const shadowGeo = new THREE.PlaneGeometry(5, 2.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 64, 5, 128, 64, 70);
    sGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
    sGrad.addColorStop(0.5, 'rgba(20, 50, 70, 0.08)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.45, 0);
    scene.add(shadowMesh);

    // Mouse Parallax Interaction
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX * 0.18;
      mouseRef.current.targetY = normY * 0.18;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      width = container.clientWidth || 800;
      height = container.clientHeight || 700;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // -----------------------------------------------------------------------
    // Render Loop
    // -----------------------------------------------------------------------
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Gentle floating levitation
      const floatY = Math.sin(elapsed * 1.5) * 0.06;
      const rotY = 0.85 + Math.sin(elapsed * 0.8) * 0.04 + mouseRef.current.x;
      const rotX = -0.25 + mouseRef.current.y;

      sneakerGroup.position.set(0, floatY, 0);
      sneakerGroup.rotation.y = rotY;
      sneakerGroup.rotation.x = rotX;

      shadowMesh.scale.setScalar(1 + floatY * 0.5);

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // =========================================================================
  // UPDATE 3D MODEL SHADER ON STAGE / SLIDER CHANGE
  // =========================================================================
  useEffect(() => {
    const mats = materialsRef.current;
    if (!mats || !mats.meshList) return;

    const { wireframeMat, clayMat, meshList } = mats;
    const lights = lightsRef.current;

    // 0 = Wireframe, 1 = Clay, 2 = Materials, 3 = Light
    meshList.forEach(({ mesh, pbrMat }) => {
      if (activeStageIdx === 0) {
        // Wireframe Mode
        mesh.material = wireframeMat;
      } else if (activeStageIdx === 1) {
        // Clay Mode
        mesh.material = clayMat;
      } else {
        // Materials (2) or Light (3) Mode
        mesh.material = pbrMat;
      }
    });

    // Dramatic lighting switch for "04 Light"
    if (lights.rimLight) {
      if (activeStageIdx === 3) {
        // High dramatic cinematic rim light
        lights.rimLight.intensity = 5.0;
        lights.keyLight.intensity = 3.5;
        lights.ambLight.intensity = 0.8;
      } else {
        lights.rimLight.intensity = 3.0;
        lights.keyLight.intensity = 2.8;
        lights.ambLight.intensity = 1.2;
      }
    }
  }, [activeStageIdx]);

  return (
    <section
      id="cadtofilm"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#0e1114] text-white flex flex-col justify-between overflow-hidden select-none py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-16"
    >
      {/* Background Subtle Studio Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[900px] h-[600px] rounded-full blur-[180px] bg-cyan-500/5 pointer-events-none" />
      </div>

      {/* Top Clearance Spacer for Fixed Navbar */}
      <div className="h-10 sm:h-12 w-full pointer-events-none" />

      {/* Main 2-Column Grid Matching Reference Screenshot */}
      <div className="relative z-10 max-w-[1520px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1 my-auto">
        
        {/* ===================================================================
            LEFT COLUMN: ANATOMY OF A RENDER + CAD TO FILM + 4 STAGES + SLIDER
           =================================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-center max-w-[560px]">
          
          {/* Eyebrow: ANATOMY OF A RENDER */}
          <p className="font-mono text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-[0.24em] mb-3">
            ANATOMY OF A RENDER
          </p>

          {/* Main Display Headline: CAD to film. */}
          <h2 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] text-white tracking-[-0.035em] leading-[0.95] mb-10 sm:mb-12">
            CAD to film<span className="text-[#38bdf8]">.</span>
          </h2>

          {/* 4 Interactive Stage Items Stacked Vertically */}
          <div className="flex flex-col w-full">
            {STAGES.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  className={`group relative flex items-center gap-4 py-4 sm:py-5 text-left border-t border-white/10 transition-all duration-300 cursor-pointer ${
                    isActive ? 'opacity-100' : 'opacity-55 hover:opacity-85'
                  }`}
                >
                  {/* Stage Number (e.g. 01, 02) */}
                  <span
                    className={`font-mono text-sm sm:text-base font-bold transition-colors duration-300 ${
                      isActive ? 'text-[#38bdf8]' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {stage.num}
                  </span>

                  {/* Stage Name (e.g. Wireframe, Clay, Materials, Light) */}
                  <span
                    className={`font-heading font-bold text-2xl sm:text-3xl tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Interactive Slider: ← RENDER ... CAD → */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-col gap-3">
            {/* Slider Top Labels */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase select-none">
              <span>← RENDER</span>
              <span>CAD →</span>
            </div>

            {/* Slider Track and Draggable Handle */}
            <div
              ref={sliderBarRef}
              onPointerDown={handlePointerDown}
              className="relative w-full h-8 flex items-center cursor-pointer group"
            >
              {/* Inactive Track Background */}
              <div className="w-full h-1.5 bg-[#1e242a] rounded-full overflow-hidden">
                {/* Active Progress Fill (Cyan) */}
                <div
                  className="h-full bg-[#38bdf8] transition-all duration-75"
                  style={{ width: `${sliderValue}%` }}
                />
              </div>

              {/* Draggable Knob */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.85)] border-2 border-white transition-transform duration-75 group-hover:scale-125"
                style={{ left: `${sliderValue}%` }}
              />
            </div>
          </div>

        </div>

        {/* ===================================================================
            RIGHT COLUMN: LIVE 3D SNEAKER CANVAS (CYAN WIREFRAME / PBR)
           =================================================================== */}
        <div className="lg:col-span-7 relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center">
          <div
            ref={canvasMountRef}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          />
        </div>

      </div>

      {/* =====================================================================
          BOTTOM HUD BAR: SCENE 05 · CAD TO FILM  FRAME 1236 / 24 FPS
          (Exact 1:1 match to reference screenshot media_1793209701877_c6764217.png)
         ===================================================================== */}
      <div className="relative z-20 w-full pt-8 flex items-end justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-[#181d22]/85 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md select-none pointer-events-auto">
          <span className="font-mono text-[11px] sm:text-xs text-[#e2e8f0] tracking-[0.16em] uppercase font-medium">
            SCENE 05 · CAD TO FILM &nbsp; FRAME 1236 / 24 FPS
          </span>
        </div>
      </div>
    </section>
  );
}


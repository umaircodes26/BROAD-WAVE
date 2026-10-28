import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * High-End 3D Tesla Cybertruck Automotive Showcase Stage
 * Matches media_1793197249658_dbf9b4f2.png 100%:
 * - Stainless steel origami body with sharp angular creases
 * - Glowing white front LED light bar & red tail light strip
 * - Chunky off-road tires with angular aero covers
 * - Reflective striped studio runway floor with glowing LED boundary strips
 * - Volumetric background light beams and high-end studio lighting
 * - Interactive mouse parallax, drag orbit, and idle suspension float
 */
export default function Cybertruck3DStage({ isInteractive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 1200;
    let height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1114, 0.035);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Perspective matching media_1793197249658_dbf9b4f2.png (front-left 3/4 view)
    camera.position.set(-6.8, 2.2, 9.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // STUDIO LIGHTING SETUP
    // Key light (top-right), cool cyan fill, sharp rear rim light, bounce light
    // =========================================================================
    const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(9, 14, 11);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.4);
    fillLight.position.set(-10, 5, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 3.2);
    rimLight.position.set(0, 9, -14);
    scene.add(rimLight);

    const groundBounce = new THREE.DirectionalLight(0x22303c, 0.8);
    groundBounce.position.set(0, -6, 4);
    scene.add(groundBounce);

    // =========================================================================
    // BACKGROUND VOLUMETRIC LIGHT BEAMS
    // Angled light beams cutting across the dark studio backdrop
    // =========================================================================
    function createBeamTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.3, 'rgba(200, 230, 255, 0.18)');
      grad.addColorStop(0.7, 'rgba(150, 200, 230, 0.05)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);
      return new THREE.CanvasTexture(canvas);
    }

    const beamTex = createBeamTexture();
    const beamGeo = new THREE.PlaneGeometry(6, 18);
    const beamMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const beamGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(-16 + i * 5.2, 7, -10 + (i % 3) * 2);
      beam.rotation.z = -0.38 + (i % 2) * 0.08;
      beam.rotation.y = 0.2;
      beamGroup.add(beam);
    }
    scene.add(beamGroup);

    // =========================================================================
    // RUNWAY FLOOR & GLOWING LED STRIPS
    // Dark reflective runway with horizontal curved track lines and boundary LEDs
    // =========================================================================
    function createRunwayTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      // Base dark studio asphalt
      ctx.fillStyle = '#0e1114';
      ctx.fillRect(0, 0, 2048, 2048);

      // Fine horizontal curved track lines radiating forward
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      for (let y = 0; y < 2048; y += 28) {
        ctx.beginPath();
        const curveOffset = Math.sin((y / 2048) * Math.PI) * 40;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(700, y - curveOffset, 1348, y - curveOffset, 2048, y);
        ctx.stroke();
      }

      // Center track lane dashes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 4;
      ctx.setLineDash([40, 60]);
      ctx.beginPath();
      ctx.moveTo(1024, 0);
      ctx.lineTo(1024, 2048);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    }

    const runwayTex = createRunwayTexture();
    const runwayGeo = new THREE.PlaneGeometry(80, 80);
    const runwayMat = new THREE.MeshStandardMaterial({
      map: runwayTex,
      roughness: 0.22,
      metalness: 0.75,
    });
    const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
    runwayMesh.rotation.x = -Math.PI / 2;
    runwayMesh.position.y = -1.15;
    runwayMesh.receiveShadow = true;
    scene.add(runwayMesh);

    // Glowing LED Runway Boundary Strips (Horizontal white light lines in background)
    const ledMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 3.2,
      roughness: 0.1,
    });

    const ledGroup = new THREE.Group();
    const ledBoxGeo = new THREE.BoxGeometry(0.38, 0.08, 0.14);
    // Line of boundary LEDs extending into distance on left and right
    for (let i = -18; i <= 18; i++) {
      const ledL = new THREE.Mesh(ledBoxGeo, ledMat);
      ledL.position.set(i * 1.05, -1.1, -5.5);
      ledGroup.add(ledL);
    }
    scene.add(ledGroup);

    // =========================================================================
    // TESLA CYBERTRUCK 3D MODEL
    // Angular origami stainless steel body, lightbars, tinted glass, all-terrain wheels
    // =========================================================================
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Materials
    const steelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a8b0b8'),
      roughness: 0.18,
      metalness: 0.94,
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#586068'),
      roughness: 0.28,
      metalness: 0.90,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#080a0d'),
      roughness: 0.05,
      metalness: 0.96,
    });

    const blackTrimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14171a'),
      roughness: 0.65,
      metalness: 0.2,
    });

    const lightBarMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    const tailLightMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff1e1e'),
      emissive: new THREE.Color('#ff1e1e'),
      emissiveIntensity: 3.0,
      roughness: 0.1,
    });

    const fogLightMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff4500'),
      emissive: new THREE.Color('#ff4500'),
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14171a'),
      roughness: 0.82,
      metalness: 0.08,
    });

    const aeroWheelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#101215'),
      roughness: 0.32,
      metalness: 0.82,
    });

    // 1. Lower Body Chassis / Rocker Panels
    const lowerBodyGeo = new THREE.BoxGeometry(7.2, 0.75, 2.75);
    const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, darkSteelMat);
    lowerBodyMesh.position.set(0, -0.2, 0);
    lowerBodyMesh.castShadow = true;
    lowerBodyMesh.receiveShadow = true;
    carGroup.add(lowerBodyMesh);

    // 2. Main Origami Stainless Steel Cab & Bed
    // Triangular roof apex contour
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-3.6, -0.2); // Rear bumper
    cabShape.lineTo(3.6, -0.2);  // Front bumper
    cabShape.lineTo(3.55, 0.35); // Front nose edge
    cabShape.lineTo(1.1, 0.62);  // Base of windshield / hood crease
    cabShape.lineTo(-0.45, 1.72);// Roof apex peak!
    cabShape.lineTo(-3.4, 0.68); // Top of tailgate
    cabShape.lineTo(-3.6, 0.55); // Rear tailgate
    cabShape.lineTo(-3.6, -0.2); // Close

    const cabExtrude = {
      depth: 2.7,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const cabGeo = new THREE.ExtrudeGeometry(cabShape, cabExtrude);
    cabGeo.center();
    const cabMesh = new THREE.Mesh(cabGeo, steelMat);
    cabMesh.position.set(0, 0.42, 0);
    cabMesh.castShadow = true;
    cabMesh.receiveShadow = true;
    carGroup.add(cabMesh);

    // 3. Tinted Glass Greenhouse (Windshield, Side Windows, Roof Apex)
    const glassShape = new THREE.Shape();
    glassShape.moveTo(1.05, 0.65);
    glassShape.lineTo(-0.42, 1.74);
    glassShape.lineTo(-2.2, 0.88);
    glassShape.lineTo(-2.2, 0.65);
    glassShape.lineTo(1.05, 0.65);

    const glassExtrude = {
      depth: 2.52,
      bevelEnabled: false,
    };
    const glassGeo = new THREE.ExtrudeGeometry(glassShape, glassExtrude);
    glassGeo.center();
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(-0.25, 0.72, 0);
    carGroup.add(glassMesh);

    // 4. Front Full-Width LED Light Bar
    const lightBarGeo = new THREE.BoxGeometry(0.12, 0.09, 2.58);
    const lightBarMesh = new THREE.Mesh(lightBarGeo, lightBarMat);
    lightBarMesh.position.set(3.58, 0.78, 0);
    carGroup.add(lightBarMesh);

    // Secondary lower accent lights
    const subLightGeo = new THREE.BoxGeometry(0.08, 0.05, 0.6);
    const subLightL = new THREE.Mesh(subLightGeo, fogLightMat);
    subLightL.position.set(3.6, 0.18, 0.85);
    carGroup.add(subLightL);

    const subLightR = subLightL.clone();
    subLightR.position.z = -0.85;
    carGroup.add(subLightR);

    // 5. Rear Full-Width Red Tail Light Strip
    const tailLightGeo = new THREE.BoxGeometry(0.08, 0.07, 2.62);
    const tailLightMesh = new THREE.Mesh(tailLightGeo, tailLightMat);
    tailLightMesh.position.set(-3.62, 0.98, 0);
    carGroup.add(tailLightMesh);

    // 6. Angular Flared Fender Flares (Polygonal Wheel Arches)
    const flareGeo = new THREE.BoxGeometry(1.7, 0.45, 0.16);
    const positions = [
      { x: 2.3, z: 1.4 },
      { x: 2.3, z: -1.4 },
      { x: -2.3, z: 1.4 },
      { x: -2.3, z: -1.4 },
    ];
    positions.forEach((pos) => {
      const flare = new THREE.Mesh(flareGeo, blackTrimMat);
      flare.position.set(pos.x, 0.05, pos.z);
      carGroup.add(flare);
    });

    // 7. Rugged All-Terrain Wheels with Aero Covers
    function createWheel() {
      const wGroup = new THREE.Group();
      
      // Tire with deep rugged cylindrical tread
      const tGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.52, 24);
      tGeo.rotateZ(Math.PI / 2);
      const tMesh = new THREE.Mesh(tGeo, tireMat);
      tMesh.castShadow = true;
      wGroup.add(tMesh);

      // Aero wheel cover (black polygonal 7-sided shield)
      const aeroGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.55, 7);
      aeroGeo.rotateZ(Math.PI / 2);
      const aeroMesh = new THREE.Mesh(aeroGeo, aeroWheelMat);
      wGroup.add(aeroMesh);

      // Center hub
      const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.58, 12);
      hubGeo.rotateZ(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeo, darkSteelMat);
      wGroup.add(hubMesh);

      return wGroup;
    }

    const wheelFL = createWheel();
    wheelFL.position.set(2.3, -0.42, 1.35);
    carGroup.add(wheelFL);

    const wheelFR = createWheel();
    wheelFR.position.set(2.3, -0.42, -1.35);
    carGroup.add(wheelFR);

    const wheelRL = createWheel();
    wheelRL.position.set(-2.3, -0.42, 1.35);
    carGroup.add(wheelRL);

    const wheelRR = createWheel();
    wheelRR.position.set(-2.3, -0.42, -1.35);
    carGroup.add(wheelRR);

    // 8. Contact Shadows on Ground
    const shadowGeo = new THREE.PlaneGeometry(8.5, 3.8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 128, 20, 256, 128, 200);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.13, 0);
    scene.add(shadowMesh);

    // Initial Cybertruck Stance (Exact match to media_1793197249658_dbf9b4f2.png)
    // Angled facing front-left
    const baseRotY = 0.65;
    const baseRotX = 0.04;
    carGroup.rotation.set(baseRotX, baseRotY, 0);
    carGroup.position.set(0.2, -0.05, 0);
    carGroup.scale.setScalar(1.08);

    // Interactive pointer drag tracking
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let dragRotOffset = { x: 0, y: 0 };
    let mouseParallax = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      if (!isInteractive) return;
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallax.x = normX * 0.12;
      mouseParallax.y = normY * 0.08;

      if (isDragging && isInteractive) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        dragRotOffset.y += dx * 0.006;
        dragRotOffset.x += dy * 0.004;
        prevPointer = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      width = container.clientWidth || 1200;
      height = container.clientHeight || 750;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId;
    const clock = new THREE.Clock();
    const curRot = { x: baseRotX, y: baseRotY };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle suspension floating
      const floatY = Math.sin(elapsed * 1.4) * 0.015;

      if (!isDragging) {
        dragRotOffset.x *= 0.94;
        dragRotOffset.y *= 0.94;
      }

      const lerp = 0.08;
      curRot.x += (baseRotX + mouseParallax.y + dragRotOffset.x - curRot.x) * lerp;
      curRot.y += (baseRotY + mouseParallax.x + dragRotOffset.y - curRot.y) * lerp;

      carGroup.rotation.set(curRot.x, curRot.y, 0);
      carGroup.position.set(0.2, -0.05 + floatY, 0);

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      cabGeo.dispose();
      glassGeo.dispose();
      lowerBodyGeo.dispose();
      lightBarGeo.dispose();
      tailLightGeo.dispose();
      flareGeo.dispose();
      shadowGeo.dispose();
      runwayGeo.dispose();
      beamGeo.dispose();
      runwayTex.dispose();
      beamTex.dispose();
      shadowTex.dispose();
      [steelMat, darkSteelMat, glassMat, blackTrimMat, lightBarMat, tailLightMat, fogLightMat, tireMat, aeroWheelMat, runwayMat, beamMat, shadowMat, ledMat].forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [isInteractive]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center pointer-events-auto"
      title="Click and drag to orbit the 3D vehicle"
    />
  );
}


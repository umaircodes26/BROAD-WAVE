import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export default function Bw3DCube({ scrollProgress = 0, serviceProgress = 0, isInteractive = true }) {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const serviceRef = useRef(serviceProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    serviceRef.current = serviceProgress;
  }, [serviceProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 560;
    let height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // HIGH-END APPLE / OCTANE STUDIO LIGHTING
    // Key light (top-right), cool fill light, turquoise rim light, ground bounce
    // =========================================================================
    const ambLight = new THREE.AmbientLight(0xffffff, 1.75);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f4f8, 1.4);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 2.2);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    const groundBounce = new THREE.DirectionalLight(0xffffff, 0.6);
    groundBounce.position.set(0, -6, 2);
    scene.add(groundBounce);

    // =========================================================================
    // PROCEDURAL 2048x2048 BRUSHED ALUMINUM WITH DEBOSSED CNC ENGRAVED TEXT
    // =========================================================================
    function createBrushedMetalFace(line1, line2) {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      // Base aerospace brushed aluminum gradient
      const grad = ctx.createLinearGradient(0, 0, 2048, 0);
      grad.addColorStop(0.00, '#7c848b');
      grad.addColorStop(0.20, '#939ba2');
      grad.addColorStop(0.40, '#838b92');
      grad.addColorStop(0.65, '#9da5ac');
      grad.addColorStop(0.85, '#878f96');
      grad.addColorStop(1.00, '#788087');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Fine horizontal hairline brushed metal striations
      for (let y = 0; y < 2048; y += 2) {
        const n = Math.sin(y * 14.7) * 0.5 + 0.5;
        const alpha = (n * 0.16 + Math.random() * 0.14) * 0.9;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.38})`;
        ctx.fillRect(0, y, 2048, 1);
        
        ctx.fillStyle = `rgba(18, 24, 28, ${alpha * 0.32})`;
        ctx.fillRect(0, y + 1, 2048, 1);
      }

      // Soft anisotropic radial sheen across the face
      const sheenGrad = ctx.createRadialGradient(1024, 900, 100, 1024, 1024, 1200);
      sheenGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.15)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
      sheenGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Setup typography for clean debossed sans-serif engraved text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 162px "Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '0.04em';

      const y1 = line2 ? 920 : 1024;
      const y2 = line2 ? 1120 : 1024;

      // 1. Top inner shadow (recessed into aluminum)
      ctx.fillStyle = 'rgba(15, 20, 24, 0.70)';
      ctx.fillText(line1, 1020, y1 - 6);
      if (line2) ctx.fillText(line2, 1020, y2 - 6);

      // 2. Bottom specular rim (light catching the bottom bevel)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillText(line1, 1028, y1 + 6);
      if (line2) ctx.fillText(line2, 1028, y2 + 6);

      // 3. Recessed engraved text face
      ctx.fillStyle = '#6f777e';
      ctx.fillText(line1, 1024, y1);
      if (line2) ctx.fillText(line2, 1024, y2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 16;
      return texture;
    }

    // Top Face: Glowing cyan neon "CAD TO CGI"
    function createCyanTopCadTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      const baseGrad = ctx.createLinearGradient(0, 0, 2048, 2048);
      baseGrad.addColorStop(0.0, '#1db4c2');
      baseGrad.addColorStop(0.4, '#31d2dd');
      baseGrad.addColorStop(0.7, '#24c0cc');
      baseGrad.addColorStop(1.0, '#179da8');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      const glowGrad = ctx.createRadialGradient(1024, 1024, 120, 1024, 1024, 1100);
      glowGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.28)');
      glowGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
      glowGrad.addColorStop(1.0, 'rgba(10, 110, 120, 0.25)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 176px "Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '0.06em';

      const y1 = 920;
      const y2 = 1120;

      // Outer glow
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 68;
      ctx.fillStyle = '#00f2fe';
      ctx.fillText('CAD TO', 1024, y1);
      ctx.fillText('CGI', 1024, y2);

      // Inner aura
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#67e8f9';
      ctx.fillText('CAD TO', 1024, y1);
      ctx.fillText('CGI', 1024, y2);

      // Core white glow
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('CAD TO', 1024, y1);
      ctx.fillText('CGI', 1024, y2);

      ctx.shadowBlur = 0;

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 16;
      return texture;
    }

    // Soft contact shadow
    function createContactShadowTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const radGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 240);
      radGrad.addColorStop(0.00, 'rgba(15, 24, 30, 0.24)');
      radGrad.addColorStop(0.25, 'rgba(20, 30, 38, 0.16)');
      radGrad.addColorStop(0.55, 'rgba(30, 42, 50, 0.07)');
      radGrad.addColorStop(0.85, 'rgba(40, 50, 60, 0.02)');
      radGrad.addColorStop(1.00, 'rgba(0, 0, 0, 0.00)');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }

    // Pre-create all 6 service textures (100% exact match to reference images)
    const serviceTextures = [
      createBrushedMetalFace('3D PRODUCT', 'ANIMATION'),    // 0: 3D Product Animation
      createBrushedMetalFace('PHOTOREAL', 'CGI'),            // 1: Photoreal CGI
      createBrushedMetalFace('CAD TO', 'CGI'),               // 2: CAD to CGI
      createBrushedMetalFace('AI VIDEO', 'PRODUCTION'),      // 3: AI Video Production
      createBrushedMetalFace('PACKAGING', '& MOCKUPS'),      // 4: Packaging & Mockups
      createBrushedMetalFace('EXHIBITION', '& BRAND'),       // 5: Exhibition & Brand
    ];

    const texCyanCad = createCyanTopCadTexture();
    const texShadow = createContactShadowTexture();

    // Cube Materials for the 6 faces:
    // +X (Index 0): Initially Service 1 (Photoreal CGI)
    const matPosX = new THREE.MeshStandardMaterial({
      map: serviceTextures[1],
      roughness: 0.24,
      metalness: 0.86,
    });

    // -X (Index 1): Service 3 (AI Video Production)
    const matNegX = new THREE.MeshStandardMaterial({
      map: serviceTextures[3],
      roughness: 0.24,
      metalness: 0.86,
    });

    // +Y (Index 2): Top Glowing Cyan Neon Face
    const matTop = new THREE.MeshStandardMaterial({
      map: texCyanCad,
      roughness: 0.16,
      metalness: 0.22,
      emissive: new THREE.Color('#0b5c64'),
      emissiveIntensity: 0.65,
    });

    // -Y (Index 3): Bottom Metal Face
    const matBottom = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22262a'),
      roughness: 0.36,
      metalness: 0.8,
    });

    // +Z (Index 4): Initially Service 0 (3D Product Animation)
    const matPosZ = new THREE.MeshStandardMaterial({
      map: serviceTextures[0],
      roughness: 0.24,
      metalness: 0.86,
    });

    // -Z (Index 5): Service 2 (CAD to CGI)
    const matNegZ = new THREE.MeshStandardMaterial({
      map: serviceTextures[2],
      roughness: 0.24,
      metalness: 0.86,
    });

    const materials = [
      matPosX,   // 0: +X
      matNegX,   // 1: -X
      matTop,    // 2: +Y
      matBottom, // 3: -Y
      matPosZ,   // 4: +Z
      matNegZ,   // 5: -Z
    ];

    const cubeGeo = new RoundedBoxGeometry(2.45, 2.45, 2.45, 6, 0.08);
    const cubeMesh = new THREE.Mesh(cubeGeo, materials);

    const cubeGroup = new THREE.Group();
    cubeGroup.add(cubeMesh);
    scene.add(cubeGroup);

    // Subtle soft contact shadow underneath floating cube
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texShadow,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.65;
    scene.add(shadowMesh);

    // Initial isometric stance matching Stage 2
    const stage2RotX = 0.42;
    const stage2RotY = -0.785;

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
      mouseParallax.y = normY * 0.12;

      if (isDragging && isInteractive) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        dragRotOffset.y += dx * 0.008;
        dragRotOffset.x += dy * 0.008;
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
      width = container.clientWidth || 560;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Smooth Scroll Lerp Loop
    let animId;
    const curRot = { x: stage2RotX, y: stage2RotY, z: 0 };
    let curHopY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const s = Math.min(Math.max(serviceRef.current, 0), 5);

      // Dynamic texture swapping for 6 services on 4 vertical faces
      if (s >= 2.0 && matPosZ.map !== serviceTextures[4]) {
        matPosZ.map = serviceTextures[4];
        matPosZ.needsUpdate = true;
      } else if (s < 2.0 && matPosZ.map !== serviceTextures[0]) {
        matPosZ.map = serviceTextures[0];
        matPosZ.needsUpdate = true;
      }

      if (s >= 3.0 && matPosX.map !== serviceTextures[5]) {
        matPosX.map = serviceTextures[5];
        matPosX.needsUpdate = true;
      } else if (s < 3.0 && matPosX.map !== serviceTextures[1]) {
        matPosX.map = serviceTextures[1];
        matPosX.needsUpdate = true;
      }

      // =======================================================================
      // CONTINUOUS ORIENTATION CHOREOGRAPHY:
      // - When s === 0 (Stage 2: "Engineered like a product"):
      //   Cube is at exact isometric angle (rotX: 0.42, rotY: -0.785)
      //   showing front "3D PRODUCT ANIMATION", side "PHOTOREAL CGI", top "CAD TO CGI"
      // - When s > 0 (Services 01 to 06):
      //   Cube transitions smoothly and rolls like a dice 90° per service!
      // =======================================================================
      let targetRotX = stage2RotX;
      let targetRotY = stage2RotY;
      let targetHop = 0;
      let targetWobbleZ = 0;

      if (s <= 0.001) {
        // Pure Stage 2 stance
        targetRotX = stage2RotX;
        targetRotY = stage2RotY;
        targetHop = 0;
        targetWobbleZ = 0;
      } else {
        // Dice roll progress through services
        // Smoothly transitions from isometric (-0.785) into dice roll sequence
        const stepFrac = s % 1;
        const hopSin = Math.sin(stepFrac * Math.PI);
        targetHop = hopSin * 0.12;

        const diceTiltX = 0.28 + hopSin * 0.14;
        targetRotX = diceTiltX;

        // Base angle transitions from -0.785 to -0.16 as rolling starts
        const diceBaseY = -0.785 - s * (Math.PI / 2);
        targetRotY = diceBaseY;
        targetWobbleZ = Math.sin(stepFrac * Math.PI * 2) * 0.04;
      }

      if (!isDragging) {
        dragRotOffset.x *= 0.94;
        dragRotOffset.y *= 0.94;
      }

      const lerp = 0.10;
      curRot.x += (targetRotX + mouseParallax.y + dragRotOffset.x - curRot.x) * lerp;
      curRot.y += (targetRotY + mouseParallax.x + dragRotOffset.y - curRot.y) * lerp;
      curRot.z += (targetWobbleZ - curRot.z) * lerp;
      curHopY += (targetHop - curHopY) * lerp;

      // Apply transforms
      cubeGroup.rotation.set(curRot.x, curRot.y, curRot.z);
      cubeGroup.position.set(0, curHopY, 0);

      shadowMesh.scale.setScalar(1 + curHopY * 0.9);
      shadowMat.opacity = 0.85 - curHopY * 0.8;

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
      cubeGeo.dispose();
      shadowGeo.dispose();
      serviceTextures.forEach((t) => t.dispose());
      texCyanCad.dispose();
      texShadow.dispose();
      materials.forEach((m) => m.dispose());
      shadowMat.dispose();
      renderer.dispose();
    };
  }, [isInteractive]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center pointer-events-auto"
      title="Scroll or drag to roll the 3D metal dice"
    />
  );
}

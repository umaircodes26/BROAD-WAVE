import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Sneaker3DModel({ isVisible = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    // Exact 45° angle matching media_1793195510574_643b959b.png
    camera.position.set(-3.2, 2.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.8);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    rimLight.position.set(2, 6, -5);
    scene.add(rimLight);

    const sneakerGroup = new THREE.Group();
    scene.add(sneakerGroup);

    // Materials
    const soleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14171a'),
      roughness: 0.55,
      metalness: 0.1,
    });

    const whiteLeatherMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f0f4f8'),
      roughness: 0.32,
      metalness: 0.15,
    });

    const blackLeatherMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c2024'),
      roughness: 0.42,
      metalness: 0.2,
    });

    const cyanAccentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38bdf8'),
      roughness: 0.2,
      metalness: 0.6,
      emissive: new THREE.Color('#0c4a6e'),
      emissiveIntensity: 0.4,
    });

    const laceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#222830'),
      roughness: 0.7,
      metalness: 0.05,
    });

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
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const soleGeo = new THREE.ExtrudeGeometry(soleShape, extrudeSettings);
    soleGeo.center();
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.set(0, -0.65, 0);
    sneakerGroup.add(soleMesh);

    // 2. Midsole cushion layer
    const midGeo = new THREE.BoxGeometry(3.6, 0.28, 1.15);
    const midMesh = new THREE.Mesh(midGeo, blackLeatherMat);
    midMesh.position.set(0.05, -0.45, 0);
    sneakerGroup.add(midMesh);

    // 3. Upper body (White leather with sleek Jordan 12 contour)
    const upperGeo = new THREE.CylinderGeometry(0.55, 0.68, 1.8, 16);
    upperGeo.scale(1.9, 0.9, 0.85);
    const upperMesh = new THREE.Mesh(upperGeo, whiteLeatherMat);
    upperMesh.rotation.z = Math.PI / 2.3;
    upperMesh.position.set(0.1, 0.15, 0);
    sneakerGroup.add(upperMesh);

    // 4. Heel / Ankle Collar
    const ankleGeo = new THREE.CylinderGeometry(0.48, 0.58, 1.1, 16);
    ankleGeo.scale(0.85, 1.0, 0.85);
    const ankleMesh = new THREE.Mesh(ankleGeo, whiteLeatherMat);
    ankleMesh.position.set(-0.95, 0.55, 0);
    ankleMesh.rotation.z = -0.15;
    sneakerGroup.add(ankleMesh);

    // 5. Toe Cap (Black mudguard curve)
    const toeGeo = new THREE.SphereGeometry(0.68, 16, 12, 0, Math.PI);
    toeGeo.scale(1.2, 0.65, 0.9);
    const toeMesh = new THREE.Mesh(toeGeo, blackLeatherMat);
    toeMesh.position.set(1.3, -0.22, 0);
    toeMesh.rotation.x = -Math.PI / 2;
    sneakerGroup.add(toeMesh);

    // 6. Mudguard side overlay (textured black curve)
    const guardGeo = new THREE.TorusGeometry(0.95, 0.16, 8, 24, Math.PI * 0.7);
    const guardMesh = new THREE.Mesh(guardGeo, blackLeatherMat);
    guardMesh.position.set(0.4, -0.32, 0.5);
    guardMesh.rotation.z = -0.35;
    sneakerGroup.add(guardMesh);

    const guardMesh2 = guardMesh.clone();
    guardMesh2.position.z = -0.5;
    sneakerGroup.add(guardMesh2);

    // 7. Laces & Eyelets
    for (let i = 0; i < 5; i++) {
      const laceBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.72, 8),
        laceMat
      );
      laceBar.rotation.x = Math.PI / 2;
      laceBar.rotation.z = 0.45;
      laceBar.position.set(-0.35 + i * 0.32, 0.12 + i * 0.16, 0);
      sneakerGroup.add(laceBar);

      // Cyan metallic eyelet clips
      const eyeletL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.08), cyanAccentMat);
      eyeletL.position.set(-0.35 + i * 0.32, 0.12 + i * 0.16, 0.38);
      sneakerGroup.add(eyeletL);

      const eyeletR = eyeletL.clone();
      eyeletR.position.z = -0.38;
      sneakerGroup.add(eyeletR);
    }

    // 8. Tongue
    const tongueGeo = new THREE.BoxGeometry(1.6, 0.12, 0.65);
    const tongueMesh = new THREE.Mesh(tongueGeo, blackLeatherMat);
    tongueMesh.position.set(-0.1, 0.5, 0);
    tongueMesh.rotation.z = 0.55;
    sneakerGroup.add(tongueMesh);

    // Orientation matching media_1793195510574_643b959b.png:
    // Floating at 45° angle, toe pointing towards right-up
    sneakerGroup.rotation.set(-0.25, 0.85, 0.22);
    sneakerGroup.scale.setScalar(1.25);

    // Subtle contact shadow underneath floating sneaker
    const shadowGeo = new THREE.PlaneGeometry(4.8, 2.4);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 64, 5, 128, 64, 60);
    sGrad.addColorStop(0, 'rgba(10, 45, 55, 0.35)');
    sGrad.addColorStop(0.5, 'rgba(15, 60, 70, 0.15)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.45, 0);
    scene.add(shadowMesh);

    // Mouse parallax
    let mouseParallax = { x: 0, y: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallax.x = normX * 0.15;
      mouseParallax.y = normY * 0.15;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      width = container.clientWidth || 800;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle levitation float
      const floatY = Math.sin(elapsed * 1.5) * 0.06;
      const rotY = 0.85 + Math.sin(elapsed * 0.8) * 0.05 + mouseParallax.x;
      const rotX = -0.25 + mouseParallax.y;

      sneakerGroup.position.set(0, floatY, 0);
      sneakerGroup.rotation.y = rotY;
      sneakerGroup.rotation.x = rotX;

      shadowMesh.scale.setScalar(1 + floatY * 0.7);
      shadowMat.opacity = 0.75 - floatY * 0.6;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      soleGeo.dispose();
      midGeo.dispose();
      upperGeo.dispose();
      ankleGeo.dispose();
      toeGeo.dispose();
      guardGeo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      [soleMat, whiteLeatherMat, blackLeatherMat, cyanAccentMat, laceMat, shadowMat].forEach(m => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none select-none flex items-center justify-center"
    />
  );
}


import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * ============================================================================
 * APPLE-STYLE PRODUCT REVEAL CANVAS SCROLL ANIMATION
 * ============================================================================
 * Features:
 * 1. HTML5 Canvas with HiDPI / Retina scaling (window.devicePixelRatio) - 100% blur-free.
 * 2. Preloads image sequence (50-100 frames) or generates real-time 3D rendered frames.
 * 3. Frame scrub synchronized with GSAP ScrollTrigger scroll progress.
 * 4. Easy configuration for custom image sequence source (e.g., /frames/frame_001.png).
 */

export default function CanvasScrollSequence({
  scrollProgress = 0,
  frameCount = 80,
  framePathPattern = '/frames/frame_%d.png', // Pattern for image sequence
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Fallback 3D scene renderer for generating frames dynamically
  const threeRendererRef = useRef(null);
  const threeSceneRef = useRef(null);
  const threeCameraRef = useRef(null);
  const threeMeshGroupRef = useRef(null);
  const threeMaterialsRef = useRef([]);

  // =========================================================================
  // 1. IMAGE SEQUENCE PRELOADER (APPLE-STYLE)
  // =========================================================================
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images = [];

    // Helper to get image path for given frame index (0-indexed or 1-indexed)
    const getFrameUrl = (index) => {
      const paddedIndex = String(index).padStart(3, '0');
      // Replace %d or %03d in framePathPattern
      return framePathPattern.replace('%d', paddedIndex);
    };

    // Preload frames
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(frameCount, 10) && !isCancelled) {
          // Once initial batch is ready, switch to image sequence mode
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // If external image files do not exist, fall back to procedural 3D frames
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [frameCount, framePathPattern]);

  // =========================================================================
  // 2. PROCEDURAL 3D SCENE SETUP (FOR INSTANT RETINA-SHARP RENDERING)
  // =========================================================================
  useEffect(() => {
    // Setup offscreen Three.js WebGL renderer
    const width = 1024;
    const height = 1024;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Studio Lighting setup
    const ambLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.4);
    fillLight.position.set(-6, 2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x33c0ca, 1.6);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Dynamic textures for Stage 1 & Stage 2
    function createBTexture() {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 1024;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 960px "Mona Sans", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B', 490, 520);
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 16;
      return tex;
    }

    function createWTexture() {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 1024;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 900px "Mona Sans", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('W', 512, 530);
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 16;
      return tex;
    }

    function createCyanTopTexture() {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 1024;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#33C0CA';
      ctx.fillRect(0, 0, 1024, 1024);
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 16;
      return tex;
    }

    const texB = createBTexture();
    const texW = createWTexture();
    const texCyan = createCyanTopTexture();

    const wMat = new THREE.MeshStandardMaterial({ map: texW, roughness: 0.3, metalness: 0.05 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.35, metalness: 0.05 });
    const topMat = new THREE.MeshStandardMaterial({ map: texCyan, roughness: 0.22, metalness: 0.08 });
    const bMat = new THREE.MeshStandardMaterial({ map: texB, roughness: 0.3, metalness: 0.05 });

    const materials = [wMat, darkMat, topMat, darkMat, bMat, darkMat];
    threeMaterialsRef.current = materials;

    const geo = new RoundedBoxGeometry(2.45, 2.45, 2.45, 5, 0.06);
    const mesh = new THREE.Mesh(geo, materials);

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    threeRendererRef.current = renderer;
    threeSceneRef.current = scene;
    threeCameraRef.current = camera;
    threeMeshGroupRef.current = group;

    return () => {
      renderer.dispose();
      geo.dispose();
      materials.forEach((m) => m.dispose());
      [texB, texW, texCyan].forEach((t) => t.dispose());
    };
  }, []);

  // =========================================================================
  // 3. CANVAS DRAW & SCRUB FRAME RENDERER (RETINA / HiDPI COMPLIANT)
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Screen dimensions
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    // Ensure physical canvas resolution matches device pixels (Zero blur on Retina)
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Clamp progress
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    const frameIndex = Math.min(Math.floor(p * (frameCount - 1)), frameCount - 1);

    // If preloaded image frames are available, draw from image sequence
    const img = imagesRef.current[frameIndex];
    if (imagesLoaded && img && img.complete && img.naturalWidth > 0) {
      // Calculate aspect ratio 'contain' in center
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const targetW = Math.min(width * 0.45, 540);
      const targetH = targetW / imgAspect;
      const drawX = (width - targetW) / 2;
      const drawY = (height - targetH) / 2;

      ctx.drawImage(img, drawX, drawY, targetW, targetH);
    } else if (threeRendererRef.current && threeSceneRef.current) {
      // Procedural 3D Frame Rendering:
      // Compute 3D rotation based on frameIndex / scroll progress
      const baseRotX = 0.42;
      const baseRotY = -0.785;
      const rotProgress = p;

      // Smooth scrub rotation matching Apple product reveals
      const curRotX = baseRotX + Math.sin(rotProgress * Math.PI) * 0.15;
      const curRotY = baseRotY + (rotProgress - 0.2) * 1.2;

      threeMeshGroupRef.current.rotation.set(curRotX, curRotY, 0);

      // Render 3D offscreen frame
      const r = threeRendererRef.current;
      r.render(threeSceneRef.current, threeCameraRef.current);

      // Draw onto Retina canvas
      const targetSize = Math.min(width * 0.55, height * 0.65, 560);
      const drawX = (width - targetSize) / 2;
      const drawY = (height - targetSize) / 2;

      ctx.drawImage(r.domElement, drawX, drawY, targetSize, targetSize);
    }

    ctx.restore();
  }, [scrollProgress, frameCount, imagesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
      style={{
        display: 'block',
      }}
    />
  );
}


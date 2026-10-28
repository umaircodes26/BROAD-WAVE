import React from 'react';

/**
 * InteractiveParallaxStage:
 * Clean slide stage for reference images (Fragrance, Skincare, Electronics).
 * Mouse hover tilt removed to keep experience rock-solid and scroll-driven.
 */
export default function InteractiveParallaxStage({
  image,
  alt = 'Showcase Stage',
  glowTone = 'rgba(56, 189, 248, 0.12)',
  opacity = 1,
  scale = 1,
}) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
      }}
    >
      {/* Ambient background studio glow matching slide tone */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[850px] h-[550px] rounded-full blur-[160px] pointer-events-none"
          style={{ backgroundColor: glowTone }}
        />
      </div>

      {/* Main Reference Image (Clean & Steady, No Mouse Tilt) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover object-center pointer-events-none filter brightness-[1.02] contrast-[1.03]"
          loading="eager"
          decoding="async"
        />

        {/* Subtle Edge Vignette to blend seamlessly with dark studio floor */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 70%, rgba(14, 17, 20, 0.5) 100%)',
          }}
        />
      </div>
    </div>
  );
}

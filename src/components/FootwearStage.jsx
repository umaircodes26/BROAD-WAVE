import React, { useEffect, useRef, useState } from 'react';
import footwearVideo from '@images/gemini_generated_video_89c10a2d.mp4';

/**
 * FootwearStage:
 * Clean, steady video stage playing "D:\images\gemini_generated_video_89c10a2d.mp4"
 * Mouse hover/parallax effects removed as requested by user.
 * Driven purely by scroll transitions.
 */
export default function FootwearStage({
  isActive = true,
  opacity = 1,
  scale = 1,
}) {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Auto-play/pause based on active slide visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled silently
        });
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
      }}
    >
      {/* Ambient background studio glow matching shoe's golden stripes & cyan UI */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[850px] h-[550px] rounded-full blur-[160px] bg-amber-500/12 pointer-events-none" />
        <div className="w-[600px] h-[400px] rounded-full blur-[140px] bg-cyan-400/8 pointer-events-none" />
      </div>

      {/* Main Video Presentation Container (Clean & Steady, No Mouse Tilt) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={footwearVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover object-center pointer-events-none filter brightness-[1.02] contrast-[1.03] transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-90'
          }`}
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

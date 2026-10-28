import React from 'react';

export default function HudBar({ scene = '01 · The wave', frame = 0, isVisible = true }) {
  // Format scene to uppercase: e.g. "SCENE 01 · THE WAVE"
  let sceneUpper = scene.toUpperCase();
  if (!sceneUpper.startsWith('SCENE')) {
    sceneUpper = `SCENE ${sceneUpper}`;
  }

  const frameStr = `FRAME ${String(frame).padStart(4, '0')} / 24 FPS`;

  return (
    <div
      className={`fixed z-50 left-8 sm:left-14 bottom-6 flex items-center gap-4 px-3.5 sm:px-4 py-1.5 rounded-xl border border-[#102426]/10 shadow-sm text-[10.5px] sm:text-[11.5px] font-mono font-semibold tracking-wider uppercase tabular-nums select-none pointer-events-none transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(214, 240, 242, 0.95)',
        color: '#121212',
      }}
    >
      <span className="text-[#121212]">{sceneUpper}</span>
      <span className="text-[#121212]">{frameStr}</span>
    </div>
  );
}

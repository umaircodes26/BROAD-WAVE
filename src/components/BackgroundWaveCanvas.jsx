import React from 'react';

// Clean, crisp, bright turquoise canvas matching the reference image 100%
// Zero blur filters, zero backdrop-blur, high-performance solid & smooth gradient
export default function BackgroundWaveCanvas() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        backgroundColor: '#33C0CA',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, #3fe0ed 0%, #33C0CA 50%, #20b0bc 100%)
        `,
      }}
    />
  );
}

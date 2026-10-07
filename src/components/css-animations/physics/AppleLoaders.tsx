import React from 'react';

// 1. Apple macOS Radial 8-Bar Spinner
export function AppleRadialSpinner({
  theme = 'dark',
  className = '',
}: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const bars = Array.from({ length: 8 });

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes apple_bar_fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
        .apple-bar {
          animation: apple_bar_fade 0.8s linear infinite;
        }
      `}</style>
      <div className="relative w-8 h-8 flex items-center justify-center">
        {bars.map((_, i) => (
          <div
            key={i}
            className={`apple-bar absolute top-0 left-1/2 -translate-x-1/2 w-[2.5px] h-[7px] rounded-full origin-[center_16px] ${
              theme === 'dark' ? 'bg-[#f5f5f7]' : 'bg-[#1d1d1f]'
            }`}
            style={{
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              animationDelay: `${(i * 0.8) / 8 - 0.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 2. Pulse Orbit 3-Dots Loader
export function PulseOrbitDots({
  theme = 'dark',
  className = '',
}: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes orbit_dot_pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .orbit-dot-1 { animation: orbit_dot_pulse 1.2s ease-in-out 0s infinite both; }
        .orbit-dot-2 { animation: orbit_dot_pulse 1.2s ease-in-out 0.2s infinite both; }
        .orbit-dot-3 { animation: orbit_dot_pulse 1.2s ease-in-out 0.4s infinite both; }
      `}</style>
      <div className="flex items-center gap-2.5">
        <div className={`w-3 h-3 rounded-full orbit-dot-1 ${theme === 'dark' ? 'bg-[#0a84ff]' : 'bg-[#0071e3]'}`} />
        <div className={`w-3 h-3 rounded-full orbit-dot-2 ${theme === 'dark' ? 'bg-[#64d2ff]' : 'bg-[#34aadc]'}`} />
        <div className={`w-3 h-3 rounded-full orbit-dot-3 ${theme === 'dark' ? 'bg-[#0a84ff]' : 'bg-[#0071e3]'}`} />
      </div>
    </div>
  );
}

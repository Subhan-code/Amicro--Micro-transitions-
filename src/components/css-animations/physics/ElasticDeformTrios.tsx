import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// ==========================================
// ROW 7: ELASTIC MORPHING (3 VARIATIONS)
// ==========================================

// Variation 2: Liquid Droplet Squish
export function DropletSquish({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2400);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes droplet_squish {
          0%, 100% { transform: scale(1, 1); border-radius: 50%; }
          35% { transform: scale(1.4, 0.6); border-radius: 40% 40% 50% 50%; }
          60% { transform: scale(0.7, 1.35); border-radius: 50% 50% 30% 30%; }
          80% { transform: scale(1.1, 0.9); }
        }
        .droplet-anim {
          animation: droplet_squish 2.4s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex items-center justify-center">
        <div className="w-[48px] h-[48px] droplet-anim bg-blue-500 shadow-md" />
      </div>
    </div>
  );
}

// Variation 3: Segmented Link Stretch
export function SegmentedLinkStretch({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2400);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes link_gap_stretch {
          0%, 100% { gap: 4px; }
          40%, 75% { gap: 18px; }
        }
        .segmented-link {
          animation: link_gap_stretch 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex items-center justify-center segmented-link">
        <div className="w-5 h-8 rounded-full bg-blue-400" />
        <div className="w-5 h-8 rounded-full bg-blue-500" />
        <div className="w-5 h-8 rounded-full bg-blue-600" />
      </div>
    </div>
  );
}

// ==========================================
// ROW 8: BLINDS & LOUVERS (3 VARIATIONS)
// ==========================================

// Variation 2: Rotating Louver Slats
export function RotatingLouvers({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes louver_rotate {
          0%, 100% { transform: perspective(400px) rotateX(0deg); }
          40%, 75% { transform: perspective(400px) rotateX(75deg); }
        }
        .louver-slat {
          animation: louver_rotate 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[90px] h-[10px] rounded-sm bg-blue-500 louver-slat shadow-sm"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// Variation 3: Radial Camera Aperture Diaphragm
export function RadialAperture({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes aperture_rotate_scale {
          0%, 100% { transform: rotate(0deg) scale(0.4); }
          40%, 75% { transform: rotate(90deg) scale(1); }
        }
        .aperture-core {
          animation: aperture_rotate_scale 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[70px] h-[70px] rounded-full border-2 border-neutral-700 flex items-center justify-center">
        <div className="w-[45px] h-[45px] rounded-xl bg-blue-500 aperture-core" />
      </div>
    </div>
  );
}

// ==========================================
// ROW 9: BALANCE & MOMENTUM (3 VARIATIONS)
// ==========================================

// Variation 2: Newton's Cradle Transfer
export function NewtonsCradle({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2400);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes cradle_left_ball {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(35deg); }
        }
        @keyframes cradle_right_ball {
          0%, 50%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(-35deg); }
        }
        .cradle-left  { transform-origin: top center; animation: cradle_left_ball 2.4s ease-in-out infinite both; }
        .cradle-right { transform-origin: top center; animation: cradle_right_ball 2.4s ease-in-out infinite both; }
      `}</style>
      <div key={activeKey} className="relative flex items-start gap-3">
        <div className="cradle-left flex flex-col items-center">
          <div className="w-[1.5px] h-[36px] bg-neutral-600" />
          <div className="w-4 h-4 rounded-full bg-blue-400" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-[36px] bg-neutral-600" />
          <div className="w-4 h-4 rounded-full bg-blue-500" />
        </div>
        <div className="cradle-right flex flex-col items-center">
          <div className="w-[1.5px] h-[36px] bg-neutral-600" />
          <div className="w-4 h-4 rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Variation 3: Gyroscope Concentric Ring Spin
export function GyroscopeRings({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes ring_orbit_3d {
          0% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
          100% { transform: perspective(500px) rotateX(360deg) rotateY(180deg); }
        }
        .gyro-ring {
          animation: ring_orbit_3d 3s linear infinite;
        }
      `}</style>
      <div key={activeKey} className="relative w-[70px] h-[70px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 gyro-ring" />
        <div className="w-4 h-4 rounded-full bg-blue-400 shadow-sm" />
      </div>
    </div>
  );
}

// ==========================================
// ROW 10: HARMONIC SPRINGS & CUBES (3 VARIATIONS)
// ==========================================

// Variation 2: Slinky Coil Spring
export function SlinkyCoil({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2400);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes slinky_expand {
          0%, 100% { transform: scaleY(0.4); }
          45%, 70% { transform: scaleY(1.3); }
        }
        .slinky-stack {
          transform-origin: center bottom;
          animation: slinky_expand 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex flex-col items-center gap-1.5 slinky-stack">
        <div className="w-12 h-2 rounded-full bg-blue-300" />
        <div className="w-12 h-2 rounded-full bg-blue-400" />
        <div className="w-12 h-2 rounded-full bg-blue-500" />
        <div className="w-12 h-2 rounded-full bg-blue-600" />
        <div className="w-12 h-2 rounded-full bg-blue-700" />
      </div>
    </div>
  );
}

// Variation 3: Squash-and-Stretch Sphere Bounce
export function SquashStretchSphere({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2200);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes sphere_squash_bounce {
          0% { transform: translateY(-50px) scale(0.85, 1.25); }
          40% { transform: translateY(0) scale(1.4, 0.6); }
          55% { transform: translateY(-15px) scale(0.9, 1.15); }
          70% { transform: translateY(0) scale(1.15, 0.85); }
          85%, 100% { transform: translateY(-50px) scale(1, 1); }
        }
        .squash-sphere {
          transform-origin: center bottom;
          animation: sphere_squash_bounce 2.2s cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-blue-500 squash-sphere shadow-md" />
        <div className="w-14 h-1 rounded-full bg-neutral-700 mt-2" />
      </div>
    </div>
  );
}

// ==========================================
// ROW 11: CASCADES & DOMINOES (3 VARIATIONS)
// ==========================================

// Variation 2: Card Deck Shuffle Cascade
export function CardDeckCascade({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes card_fan_spread {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          40%, 75% { transform: rotate(var(--rot)) translateX(var(--tx)); }
        }
        .fan-card {
          transform-origin: bottom center;
          animation: card_fan_spread 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[75px] flex items-center justify-center">
        <div className="absolute w-[42px] h-[58px] rounded-xl bg-blue-700 border border-neutral-600 fan-card" style={{ '--rot': '-22deg', '--tx': '-24px' } as React.CSSProperties} />
        <div className="absolute w-[42px] h-[58px] rounded-xl bg-blue-600 border border-neutral-500 fan-card" style={{ '--rot': '0deg', '--tx': '0px' } as React.CSSProperties} />
        <div className="absolute w-[42px] h-[58px] rounded-xl bg-blue-500 border border-neutral-400 fan-card" style={{ '--rot': '22deg', '--tx': '24px' } as React.CSSProperties} />
      </div>
    </div>
  );
}

// Variation 3: Interlocking Gear Step
export function GearToothStep({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes gear_cw { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes gear_ccw { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        .gear-1 { animation: gear_cw 4s linear infinite; }
        .gear-2 { animation: gear_ccw 4s linear infinite; }
      `}</style>
      <div key={activeKey} className="relative flex items-center gap-1">
        <div className="w-10 h-10 rounded-full border-4 border-dashed border-blue-400 gear-1 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
        </div>
        <div className="w-10 h-10 rounded-full border-4 border-dashed border-blue-600 gear-2 flex items-center justify-center -ml-2 mt-4">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROW 12: MAGNETIC & SNAP PHYSICS (3 VARIATIONS)
// ==========================================

// Variation 2: Magnetic Orbit Particle
export function MagneticOrbitParticle({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes orbit_spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .orbit-arm {
          animation: orbit_spin 2.6s linear infinite;
        }
      `}</style>
      <div key={activeKey} className="relative w-[70px] h-[70px] flex items-center justify-center">
        {/* Center Magnetic Core */}
        <div className="w-7 h-7 rounded-full bg-blue-600 shadow-md z-10" />
        {/* Orbiting Satellite Dot */}
        <div className="absolute inset-0 orbit-arm flex items-start justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-400 shadow-sm" />
        </div>
      </div>
    </div>
  );
}

// Variation 3: Magnetic Grid Repel
export function MagneticGridRepel({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2600);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes repel_disperse {
          0%, 100% { transform: translate(0, 0); }
          40%, 75% { transform: translate(var(--tx), var(--ty)); }
        }
        .repel-dot {
          animation: repel_disperse 2.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[60px] h-[60px] grid grid-cols-2 gap-2 place-items-center">
        <div className="w-4 h-4 rounded-full bg-blue-400 repel-dot" style={{ '--tx': '-10px', '--ty': '-10px' } as React.CSSProperties} />
        <div className="w-4 h-4 rounded-full bg-blue-500 repel-dot" style={{ '--tx': '10px', '--ty': '-10px' } as React.CSSProperties} />
        <div className="w-4 h-4 rounded-full bg-blue-600 repel-dot" style={{ '--tx': '-10px', '--ty': '10px' } as React.CSSProperties} />
        <div className="w-4 h-4 rounded-full bg-blue-700 repel-dot" style={{ '--tx': '10px', '--ty': '10px' } as React.CSSProperties} />
      </div>
    </div>
  );
}

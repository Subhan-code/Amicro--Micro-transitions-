import React, { useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionOverlayProps {
  transitionId: string;
  isAnimating: boolean;
  theme?: 'dark' | 'light';
  speedMultiplier?: number;
}

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({
  transitionId,
  isAnimating,
  theme = 'dark',
  speedMultiplier = 1,
}) => {
  const isDark = theme === 'dark';
  const duration = 0.7 * speedMultiplier;
  const EASING: [number, number, number, number] = [0.83, 0, 0.17, 1];

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Liquid Wave SVG Animation
  useEffect(() => {
    if (transitionId !== 'obsidian-liquid-wave' && transitionId !== 'liquid-wave') return;

    if (!isAnimating) {
      pathRefs.current.forEach((path) => {
        if (path) path.setAttribute('d', 'M 0 100 V 100 H 100 V 100 Z');
      });
      return;
    }

    let animId: number;
    const numPoints = 14;
    const numPaths = 3;
    const startTime = performance.now();
    const durationMs = 1200 * speedMultiplier;

    const delays = Array.from({ length: numPaths }, (_, i) =>
      Array.from({ length: numPoints }, () => i * 0.07 + Math.random() * 0.12)
    );

    const animateFrame = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;

      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const stepX = 100 / (numPoints - 1);
        const pointsY = delays[i].map((delay) => {
          const rawProgress = Math.max(0, Math.min(1, (elapsedSec - delay) / (0.6 * speedMultiplier)));
          const easeProgress =
            rawProgress < 0.5
              ? 2 * rawProgress * rawProgress
              : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
          return 100 - easeProgress * 112;
        });

        let d = `M 0 100 V ${pointsY[0]}`;
        for (let j = 0; j < numPoints - 1; j++) {
          const currentX = j * stepX;
          const nextX = (j + 1) * stepX;
          const cpX = currentX + stepX * 0.5;
          d += ` C ${cpX} ${pointsY[j]} ${cpX} ${pointsY[j + 1]} ${nextX} ${pointsY[j + 1]}`;
        }
        d += ` V 100 H 0 Z`;
        path.setAttribute('d', d);
      });

      if (now - startTime < durationMs) {
        animId = requestAnimationFrame(animateFrame);
      }
    };

    animId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(animId);
  }, [isAnimating, transitionId, speedMultiplier]);

  if (!isAnimating && transitionId !== 'obsidian-liquid-wave' && transitionId !== 'liquid-wave') {
    return null;
  }

  // 1. 3D Spatial Door Portal
  if (transitionId === 'spatial-door-portal' || transitionId === 'double-doors') {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none [perspective:800px] flex overflow-hidden rounded-[inherit]">
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -85, x: '-10%' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className={`w-1/2 h-full origin-left border-r ${
            isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}
        />
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 85, x: '10%' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className={`w-1/2 h-full origin-right border-l ${
            isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}
        />
      </div>
    );
  }

  // 2. 3D Architectural French Doors
  if (transitionId === 'french-doors-3d' || transitionId === 'french-doors') {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none [perspective:900px] flex overflow-hidden rounded-[inherit]">
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-1/2 h-full origin-right border-r ${
            isDark ? 'bg-[#1c1c1e] border-white/15' : 'bg-neutral-100 border-neutral-300'
          } shadow-2xl`}
        />
        <motion.div
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-1/2 h-full origin-left border-l ${
            isDark ? 'bg-[#1c1c1e] border-white/15' : 'bg-neutral-100 border-neutral-300'
          } shadow-2xl`}
        />
      </div>
    );
  }

  // 3. Radial Iris Portal
  if (transitionId === 'radial-iris-mask') {
    return (
      <motion.div
        className={`absolute inset-0 z-40 pointer-events-none origin-center rounded-[inherit] ${
          isDark ? 'bg-[#121212]' : 'bg-[#ffffff]'
        }`}
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />
    );
  }

  // 4. 3D Perspective Card Stage
  if (transitionId === 'perspective-flip-stage') {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none [perspective:700px] flex items-center justify-center rounded-[inherit]">
        <motion.div
          initial={{ rotateX: 90, scale: 0.85, opacity: 0 }}
          animate={{ rotateX: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full h-full border ${
            isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-200'
          } shadow-2xl`}
        />
      </div>
    );
  }

  // 5. Layered Glass Curtain
  if (transitionId === 'staggered-glass-curtain') {
    const COLUMNS = 5;
    return (
      <motion.div className="absolute inset-0 z-40 flex pointer-events-none overflow-hidden rounded-[inherit]">
        {[...Array(COLUMNS)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '-105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.65, ease: EASING, delay: i * 0.05 }}
            className={`h-full flex-1 backdrop-blur-md border-r last:border-r-0 ${
              isDark ? 'bg-[#181818]/95 border-white/5' : 'bg-white/95 border-neutral-200'
            }`}
          />
        ))}
      </motion.div>
    );
  }

  // 6. Obsidian Liquid Wave SVG
  if (transitionId === 'obsidian-liquid-wave' || transitionId === 'liquid-wave') {
    return (
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-40 rounded-[inherit]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path ref={(el) => { pathRefs.current[0] = el; }} fill={isDark ? '#262626' : '#e5e5e5'} style={{ opacity: 0.6 }} />
        <path ref={(el) => { pathRefs.current[1] = el; }} fill={isDark ? '#1c1c1c' : '#f4f4f6'} style={{ opacity: 0.85 }} />
        <path ref={(el) => { pathRefs.current[2] = el; }} fill={isDark ? '#121212' : '#ffffff'} />
      </svg>
    );
  }

  return null;
};

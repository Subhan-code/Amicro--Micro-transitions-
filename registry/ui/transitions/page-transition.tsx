import React, { useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';

export type TransitionType =
  | 'double-stairs'
  | 'shutter-stairs'
  | 'split-stairs'
  | 'horizontal-split'
  | 'vertical-split'
  | 'slash'
  | 'lattice'
  | 'curtain-shred'
  | 'pixel'
  | 'pixel-wave'
  | 'pixel-spiral'
  | 'vortex'
  | 'cross-fade'
  | 'expand-grow'
  | 'push-slide'
  | 'pop-over'
  | 'depth-forward'
  | 'liquid-wave';

export interface PageTransitionProps {
  type?: TransitionType;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  type = 'double-stairs',
  isVisible,
  onComplete,
  className = '',
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (type !== 'liquid-wave' || !isVisible) return;
    let animId: number;
    const numPoints = 12;
    const numPaths = 3;
    const startTime = performance.now();

    const delays = Array.from({ length: numPaths }, (_, i) =>
      Array.from({ length: numPoints }, () => i * 0.08 + Math.random() * 0.15)
    );

    const animateFrame = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const stepX = 100 / (numPoints - 1);
        const pointsY = delays[i].map((delay) => {
          const rawProgress = Math.max(0, Math.min(1, (elapsedSec - delay) / 0.65));
          const easeProgress =
            rawProgress < 0.5
              ? 2 * rawProgress * rawProgress
              : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
          return 100 - easeProgress * 110;
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

      if (now - startTime < 1300) {
        animId = requestAnimationFrame(animateFrame);
      } else if (onComplete) {
        onComplete();
      }
    };

    animId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, type, onComplete]);

  if (!isVisible && type !== 'liquid-wave') return null;

  if (type === 'double-stairs') {
    const COLUMNS = 5;
    const variants: Variants = {
      initial: (i: number) => ({ y: i % 2 === 0 ? '-100%' : '100%' }),
      enter: (i: number) => ({
        y: '0%',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 },
      }),
      exit: (i: number) => ({
        y: i % 2 === 0 ? '100%' : '-100%',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 },
      }),
    };

    return (
      <motion.div
        className={`fixed inset-0 z-50 flex h-screen w-screen pointer-events-none ${className}`}
        initial="initial"
        animate={isVisible ? 'enter' : 'exit'}
        onAnimationComplete={() => {
          if (onComplete) onComplete();
        }}
      >
        {[...Array(COLUMNS)].map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            custom={i}
            className="relative h-full flex-1 bg-neutral-900 border-r border-neutral-800 last:border-r-0"
          />
        ))}
      </motion.div>
    );
  }

  if (type === 'liquid-wave') {
    return (
      <svg
        className={`fixed inset-0 w-full h-full pointer-events-none z-50 ${className}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path ref={(el) => { pathRefs.current[0] = el; }} fill="#3f3f46" style={{ opacity: 0.4 }} />
        <path ref={(el) => { pathRefs.current[1] = el; }} fill="#27272a" style={{ opacity: 0.75 }} />
        <path ref={(el) => { pathRefs.current[2] = el; }} fill="#09090b" />
      </svg>
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 bg-neutral-900 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
    />
  );
};

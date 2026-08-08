import React from 'react';

export type TransitionCategory = 'Spatial Doors' | 'Liquid Waves' | 'Iris & Masks' | 'Glass & Layers';

export interface TransitionPreset {
  id: string;
  name: string;
  category: TransitionCategory;
  description: string;
  cliCommand: string;
  code: string;
}

export const transitionCategories: TransitionCategory[] = [
  'Spatial Doors',
  'Liquid Waves',
  'Iris & Masks',
  'Glass & Layers',
];

export const transitionsData: TransitionPreset[] = [
  {
    id: 'spatial-door-portal',
    name: '3D Spatial Door Portal',
    category: 'Spatial Doors',
    description: 'Luxury 3D dual perspective door panels opening inward with smooth depth spring curves and subtle drop shadows.',
    cliCommand: 'npx @subhanhq/amicro@latest add spatial-door-portal',
    code: `import React from 'react';
import { motion } from 'framer-motion';

export const SpatialDoorPortal = ({ isVisible }: { isVisible: boolean }) => (
  <div className="fixed inset-0 z-50 pointer-events-none [perspective:1200px] flex overflow-hidden">
    <motion.div
      initial={{ rotateY: 0 }}
      animate={isVisible ? { rotateY: -85, x: "-10%" } : { rotateY: 0, x: "0%" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="w-1/2 h-full bg-[#181818] origin-left border-r border-white/10 shadow-2xl"
    />
    <motion.div
      initial={{ rotateY: 0 }}
      animate={isVisible ? { rotateY: 85, x: "10%" } : { rotateY: 0, x: "0%" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="w-1/2 h-full bg-[#181818] origin-right border-l border-white/10 shadow-2xl"
    />
  </div>
);`
  },
  {
    id: 'french-doors-3d',
    name: '3D Architectural French Doors',
    category: 'Spatial Doors',
    description: 'Dual 3D origin French doors unfolding outward with realistic perspective depth and lighting.',
    cliCommand: 'npx @subhanhq/amicro@latest add french-doors-3d',
    code: `import React from 'react';
import { motion } from 'framer-motion';

export const FrenchDoors3D = ({ isVisible }: { isVisible: boolean }) => (
  <div className="fixed inset-0 z-50 pointer-events-none [perspective:1400px] flex overflow-hidden">
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={isVisible ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-1/2 h-full bg-[#1c1c1e] origin-right border-r border-white/15 shadow-2xl"
    />
    <motion.div
      initial={{ rotateY: -90, opacity: 0 }}
      animate={isVisible ? { rotateY: 0, opacity: 1 } : { rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-1/2 h-full bg-[#1c1c1e] origin-left border-l border-white/15 shadow-2xl"
    />
  </div>
);`
  },
  {
    id: 'obsidian-liquid-wave',
    name: 'Obsidian Liquid Bezier Wave',
    category: 'Liquid Waves',
    description: 'Multi-layered organic fluid wave wipe crafted with cubic bezier noise curves and glass gradients.',
    cliCommand: 'npx @subhanhq/amicro@latest add obsidian-liquid-wave',
    code: `import React, { useEffect, useRef } from 'react';

export const ObsidianLiquidWave = ({ isVisible }: { isVisible: boolean }) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!isVisible) return;
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
        const pointsY = delays[i].map(delay => {
          const rawProgress = Math.max(0, Math.min(1, (elapsedSec - delay) / 0.65));
          const easeProgress = rawProgress < 0.5 ? 2 * rawProgress * rawProgress : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
          return 100 - easeProgress * 110;
        });

        let d = \`M 0 100 V \${pointsY[0]}\`;
        for (let j = 0; j < numPoints - 1; j++) {
          const currentX = j * stepX;
          const nextX = (j + 1) * stepX;
          const cpX = currentX + stepX * 0.5;
          d += \` C \${cpX} \${pointsY[j]} \${cpX} \${pointsY[j+1]} \${nextX} \${pointsY[j+1]}\`;
        }
        d += \` V 100 H 0 Z\`;
        path.setAttribute("d", d);
      });

      if ((now - startTime) < 1300) {
        animId = requestAnimationFrame(animateFrame);
      }
    };

    animId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(animId);
  }, [isVisible]);

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-50" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path ref={(el) => { pathRefs.current[0] = el; }} fill="#262626" style={{ opacity: 0.6 }} />
      <path ref={(el) => { pathRefs.current[1] = el; }} fill="#1c1c1c" style={{ opacity: 0.85 }} />
      <path ref={(el) => { pathRefs.current[2] = el; }} fill="#121212" />
    </svg>
  );
};`
  },
  {
    id: 'radial-iris-mask',
    name: 'Radial Iris Portal',
    category: 'Iris & Masks',
    description: 'Smooth expanding circular iris portal revealing the next view from center with spring momentum.',
    cliCommand: 'npx @subhanhq/amicro@latest add radial-iris-mask',
    code: `import React from 'react';
import { motion } from 'framer-motion';

export const RadialIrisPortal = ({ isVisible }: { isVisible: boolean }) => (
  <motion.div 
    className="fixed inset-0 z-50 bg-[#121212] pointer-events-none origin-center"
    style={{ clipPath: 'circle(150% at 50% 50%)' }}
    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
    animate={isVisible ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
  />
);`
  },
  {
    id: 'perspective-flip-stage',
    name: '3D Perspective Card Stage',
    category: 'Spatial Doors',
    description: '3D spatial card flip stage with elevation depth transform and realistic drop shadow.',
    cliCommand: 'npx @subhanhq/amicro@latest add perspective-flip-stage',
    code: `import React from 'react';
import { motion } from 'framer-motion';

export const PerspectiveCardStage = ({ isVisible }: { isVisible: boolean }) => (
  <div className="fixed inset-0 z-50 pointer-events-none [perspective:1000px] flex items-center justify-center">
    <motion.div
      initial={{ rotateX: 90, scale: 0.85, opacity: 0 }}
      animate={isVisible ? { rotateX: 0, scale: 1, opacity: 1 } : { rotateX: -90, scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full bg-[#181818] border border-white/10 shadow-2xl"
    />
  </div>
);`
  },
  {
    id: 'staggered-glass-curtain',
    name: 'Layered Glass Curtain',
    category: 'Glass & Layers',
    description: '5 staggered frosted obsidian glass columns sliding vertically with spring timing physics.',
    cliCommand: 'npx @subhanhq/amicro@latest add staggered-glass-curtain',
    code: `import React from 'react';
import { motion } from 'framer-motion';

const COLUMNS = 5;
const EASING = [0.83, 0, 0.17, 1];

export const LayeredGlassCurtain = ({ isVisible }: { isVisible: boolean }) => (
  <motion.div className="fixed inset-0 z-50 flex pointer-events-none overflow-hidden">
    {[...Array(COLUMNS)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "-100%" }}
        animate={isVisible ? { y: "0%" } : { y: "-100%" }}
        transition={{ duration: 0.65, ease: EASING, delay: i * 0.05 }}
        className="h-full flex-1 bg-[#181818]/95 backdrop-blur-md border-r border-white/5 last:border-r-0"
      />
    ))}
  </motion.div>
);`
  }
];

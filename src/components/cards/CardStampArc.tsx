import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardStampArcProps {
  arc?: number;
  spread?: number;
  yOffset?: number;
  isColorful?: boolean;
  duration?: number;
  hoverIntensity?: number;
  className?: string;
  hovered?: boolean;
  images?: string[];
}

export function CardStampArc({
  arc = 25,
  spread = 180,
  yOffset = 40,
  isColorful = false,
  duration = 0.5,
  hoverIntensity = 1,
  className = '',
  hovered,
  images
}: CardStampArcProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;

  const stamps = [
    { id: 0, color: 'bg-red-400 dark:bg-red-500' },
    { id: 1, color: 'bg-blue-400 dark:bg-blue-500' },
    { id: 2, color: 'bg-emerald-400 dark:bg-emerald-500' },
    { id: 3, color: 'bg-amber-400 dark:bg-amber-500' },
    { id: 4, color: 'bg-purple-400 dark:bg-purple-500' }
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {stamps.map((stamp, i) => {
        const dist = i - 2;
        
        let targetRotate = 0;
        let targetX = 0;
        let targetY = 0;
 
        if (active) {
          if (i === 0) {
            targetRotate = -1 * arc;
            targetX = -1 * spread;
            targetY = yOffset;
          } else if (i === 1) {
            targetRotate = -0.48 * arc;
            targetX = -0.5 * spread;
            targetY = 0.25 * yOffset;
          } else if (i === 2) {
            targetRotate = 0;
            targetX = 0;
            targetY = -0.25 * yOffset;
          } else if (i === 3) {
            targetRotate = 0.48 * arc;
            targetX = 0.5 * spread;
            targetY = 0.25 * yOffset;
          } else if (i === 4) {
            targetRotate = arc;
            targetX = spread;
            targetY = yOffset;
          }

          targetRotate *= hoverIntensity;
          targetX *= hoverIntensity;
          targetY *= hoverIntensity;
        }

        const springConfig = {
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.8
        };

        return (
          <motion.div
            key={stamp.id}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: active ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              ...springConfig,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 1,
              backgroundImage: images ? `url(${images[i % images.length]})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(0,0,0,0.1)] border-2 border-dashed border-white/60 dark:border-black/35 ${
              images ? '' : (isColorful ? stamp.color : 'bg-neutral-400 dark:bg-neutral-800')
            }`}
          />
        );
      })}
    </div>
  );
}

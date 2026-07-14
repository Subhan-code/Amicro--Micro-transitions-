import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardCornerFanProps {
  angle?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export function CardCornerFan({
  angle = 40, // Total rotation fan span
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-400 dark:bg-neutral-800',
  className = ''
}: CardCornerFanProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const total = cards.length;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        // Rotate from -10deg to +30deg (span of 40deg)
        const offsetRatio = i / (total - 1); // 0, 0.25, 0.5, 0.75, 1
        const startAngle = -10;
        const targetRotate = isHovered ? (startAngle + offsetRatio * angle) * hoverIntensity : 0;

        const springConfig = {
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.8
        };

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              scale: isHovered && i === 2 ? 1.03 : 1
            }}
            transition={{
              ...springConfig,
              duration
            }}
            style={{
              zIndex: 5 - i,
              originX: 0,
              originY: 1
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(0,0,0,0.1)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
}

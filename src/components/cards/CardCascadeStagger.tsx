import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardCascadeStaggerProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
}

export function CardCascadeStagger({
  className = '',
  cardClassName = 'bg-neutral-400 dark:bg-neutral-850',
  hovered
}: CardCascadeStaggerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        const dist = i - center;
        
        // On hover, offset upward cascadingly
        const targetY = active ? dist * -28 - 14 : dist * 2;
        const targetX = active ? dist * 14 : 0;
        const targetRotate = active ? dist * 6 : 0;

        const springConfig = {
          type: "spring",
          stiffness: 200,
          damping: 22,
          mass: 0.9
        };

        return (
          <motion.div
            key={i}
            animate={{
              y: targetY,
              x: targetX,
              rotate: targetRotate,
              scale: active ? (dist === 0 ? 1.05 : 0.98) : 1
            }}
            transition={{
              ...springConfig
            }}
            style={{
              zIndex: 5 - Math.abs(dist),
              originX: 0.5,
              originY: 0.5
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
}

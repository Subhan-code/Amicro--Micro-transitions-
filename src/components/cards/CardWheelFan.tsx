import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardWheelFanProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
}

export function CardWheelFan({
  className = '',
  cardClassName = 'bg-neutral-400 dark:bg-neutral-850',
  hovered
}: CardWheelFanProps) {
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
        
        const targetRotate = active ? dist * 18 : 0;
        
        // Match radial translation arc heights
        let targetY = 0;
        if (active) {
          if (Math.abs(dist) === 2) targetY = -8;
          else if (Math.abs(dist) === 1) targetY = -22;
          else targetY = -28;
        }

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
              y: targetY,
              scale: active ? (dist === 0 ? 1.05 : 0.98) : 1
            }}
            transition={{
              ...springConfig
            }}
            style={{
              zIndex: 5 - Math.abs(dist),
              originX: 0.5,
              originY: 1.1 // Radius offset center below the cards
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
}

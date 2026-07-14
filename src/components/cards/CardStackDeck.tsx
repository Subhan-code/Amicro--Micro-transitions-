import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardStackDeckProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
}

export function CardStackDeck({
  className = '',
  cardClassName = 'bg-neutral-400 dark:bg-neutral-800',
  hovered
}: CardStackDeckProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;
  
  const cards = [0, 1, 2];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        const dist = i - 1; // Center card is index 1
        
        const targetY = active ? dist * 32 : dist * 4;
        const targetRotate = active ? dist * 6 : 0;
        const targetScale = active && dist === 0 ? 1.03 : 1;

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
              y: targetY,
              rotate: targetRotate,
              scale: targetScale
            }}
            transition={{
              ...springConfig
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 0.5
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
}

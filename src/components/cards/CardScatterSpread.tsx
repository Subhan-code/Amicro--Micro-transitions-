import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardScatterSpreadProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
  images?: string[];
}

export function CardScatterSpread({
  className = '',
  cardClassName = 'bg-neutral-400 dark:bg-neutral-800',
  hovered,
  images
}: CardScatterSpreadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;
  
  const cards = [0, 1, 2, 3, 4];

  // Custom coordinates mapping for overlapping dealt cards
  const offsets = [
    { x: -75, y: 15, rotate: -14 },
    { x: -35, y: -15, rotate: -6 },
    { x: 0, y: -30, rotate: 2 },
    { x: 35, y: -10, rotate: 8 },
    { x: 75, y: 20, rotate: 15 }
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        const targetX = active ? offsets[i].x : 0;
        const targetY = active ? offsets[i].y : 0;
        const targetRotate = active ? offsets[i].rotate : 0;

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
              x: targetX,
              y: targetY,
              rotate: targetRotate,
              scale: active ? (i === 2 ? 1.05 : 0.98) : 1
            }}
            transition={{
              ...springConfig
            }}
            style={{
              zIndex: 5 - Math.abs(i - 2),
              originX: 0.5,
              originY: 0.5,
              backgroundImage: images ? `url(${images[i % images.length]})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
}

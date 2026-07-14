import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardLinearSpreadProps {
  gap?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
  hovered?: boolean;
  images?: string[];
}

export const CardLinearSpread = React.memo(function CardLinearSpread({
  gap = 90,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-400 dark:bg-neutral-800',
  className = '',
  hovered,
  images
}: CardLinearSpreadProps) {
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
        const targetX = active ? dist * (gap / center) * hoverIntensity : 0;

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
              scale: active ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              ...springConfig,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              backgroundImage: images ? `url(${images[i % images.length]})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(0,0,0,0.1)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
    </div>
  );
});

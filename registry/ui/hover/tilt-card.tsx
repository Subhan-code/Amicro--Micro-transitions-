import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
  cardClassName?: string;
}

export function TiltCard({
  children,
  maxTilt = 15,
  className = '',
  cardClassName = '',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for x/y mouse offset relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate normalized position relative to center (-0.5 to 0.5)
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-[4/3] max-w-[320px] cursor-pointer ${className}`}
      style={{ perspective: '800px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`w-full h-full rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-250 dark:from-neutral-850 dark:to-neutral-900 border border-neutral-200/20 shadow-lg flex items-center justify-center p-6 select-none ${cardClassName}`}
      >
        <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="w-full h-full flex flex-col justify-center items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  range = 45,
  strength = 0.35,
  className = '',
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Center point of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance
    const dist = Math.hypot(clientX - centerX, clientY - centerY);

    if (dist < range) {
      // Magnetic pull
      const targetX = (clientX - centerX) * strength;
      const targetY = (clientY - centerY) * strength;
      x.set(targetX);
      y.set(targetY);
    } else {
      // Return to center
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      className={`relative inline-flex items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm h-11 px-6 shadow hover:scale-[1.03] transition-all cursor-pointer select-none border-0 ${className}`}
    >
      <span className="relative z-10 block pointer-events-none">{children}</span>
    </motion.button>
  );
}

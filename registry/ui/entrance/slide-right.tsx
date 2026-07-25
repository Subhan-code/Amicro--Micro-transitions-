import React from 'react';
import { motion } from 'framer-motion';

interface SlideRightProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  xOffset?: number;
  className?: string;
}

export function SlideRight({
  children,
  duration = 0.6,
  delay = 0,
  xOffset = -40,
  className = '',
}: SlideRightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

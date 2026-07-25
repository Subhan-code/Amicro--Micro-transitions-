import React from 'react';
import { motion } from 'framer-motion';

interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  className?: string;
}

export function ScaleIn({
  children,
  duration = 0.5,
  delay = 0,
  initialScale = 0.92,
  className = '',
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // Custom springy cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

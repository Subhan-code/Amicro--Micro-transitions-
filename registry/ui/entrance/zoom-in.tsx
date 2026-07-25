import React from 'react';
import { motion } from 'framer-motion';

interface ZoomInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  initialBlur?: string;
  className?: string;
}

export function ZoomIn({
  children,
  duration = 0.7,
  delay = 0,
  initialScale = 0.85,
  initialBlur = '12px',
  className = '',
}: ZoomInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale, filter: `blur(${initialBlur})` }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
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

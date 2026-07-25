import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ProgressIndicatorProps {
  color?: string;
  height?: number;
  className?: string;
}

export function ProgressIndicator({
  color = 'bg-blue-500',
  height = 4,
  className = '',
}: ProgressIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 left-0 right-0 origin-left z-[9999] ${color} ${className}`}
      style={{
        scaleX,
        height,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        originX: 0,
        zIndex: 9999,
      }}
    />
  );
}

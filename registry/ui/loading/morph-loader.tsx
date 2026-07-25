import React from 'react';
import { motion } from 'framer-motion';

interface MorphLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export function MorphLoader({
  size = 40,
  color = 'bg-blue-500',
  className = '',
}: MorphLoaderProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <motion.div
        animate={{
          borderRadius: ['25%', '50%', '50%', '25%', '25%'],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 0.8, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 2.2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{ width: size, height: size }}
        className={`rounded-2xl ${color} shadow-lg`}
      />
    </div>
  );
}

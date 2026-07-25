import React from 'react';
import { motion } from 'framer-motion';

interface PulseProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Pulse({
  size = 12,
  color = 'bg-blue-500',
  className = '',
}: PulseProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Center Solid Point */}
      <span className={`absolute w-full h-full rounded-full ${color}`} />
      
      {/* Pulsing ring 1 */}
      <motion.span
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 2.8, opacity: 0 }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: 'easeOut',
        }}
        className={`absolute w-full h-full rounded-full ${color} opacity-40`}
      />

      {/* Pulsing ring 2 */}
      <motion.span
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 2.8, opacity: 0 }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          delay: 0.6,
          ease: 'easeOut',
        }}
        className={`absolute w-full h-full rounded-full ${color} opacity-40`}
      />
    </div>
  );
}

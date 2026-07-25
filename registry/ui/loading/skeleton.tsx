import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  shimmerColor?: 'light' | 'dark';
}

export function Skeleton({
  className = '',
  shimmerColor = 'dark',
}: SkeletonProps) {
  const isDark = shimmerColor === 'dark';
  
  const shimmerGradient = isDark
    ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)'
    : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0) 100%)';

  return (
    <div
      className={`relative overflow-hidden rounded-md bg-neutral-200/50 dark:bg-neutral-800/40 ${className}`}
    >
      {/* Premium Shimmer Sweep Animation */}
      <motion.div
        initial={{ x: '-150%' }}
        animate={{ x: '150%' }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: 'easeInOut',
        }}
        style={{
          background: shimmerGradient,
        }}
        className="absolute inset-0 w-[80%] h-full"
      />
    </div>
  );
}

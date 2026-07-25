import React from 'react';
import { motion } from 'framer-motion';

export const WaveformLoader = () => (
  <div className="flex items-center space-x-0.5 h-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ height: [4, 24, 4] }}
        transition={{ duration: 1, repeat: Infinity, delay: Math.sin(i) * 0.5, ease: "easeInOut" }}
      />
    ))}
  </div>
);

import React from 'react';
import { motion } from 'framer-motion';

export const ConcentricSquares = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <motion.div
        className="absolute w-12 h-12 border-2 border-zinc-800 dark:border-zinc-700 rounded-sm"
        animate={{ rotate: [0, 90, 90], scale: [1, 1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-6 h-6 border-2 border-zinc-500 rounded-sm"
        animate={{ rotate: [0, -90, -90], scale: [1, 1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

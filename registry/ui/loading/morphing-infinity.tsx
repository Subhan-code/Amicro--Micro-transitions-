import React from 'react';
import { motion } from 'framer-motion';

export const MorphingInfinity = () => {
  return (
    <div className="w-12 h-6 flex justify-between items-center relative">
      <motion.div
        className="w-6 h-6 border-2 border-zinc-800 dark:border-zinc-700 rounded-full"
        animate={{ x: [0, 24, 0], scale: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-6 h-6 border-2 border-zinc-800 dark:border-zinc-700 rounded-full absolute top-0 left-0"
        animate={{ x: [24, 0, 24], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

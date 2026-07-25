import React from 'react';
import { motion } from 'framer-motion';

export const OrbitingDot = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
      <motion.div
        className="absolute w-full h-full border border-zinc-200 dark:border-zinc-800 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -ml-1.5 -mt-1.5 w-3 h-3 bg-zinc-800 dark:bg-white rounded-full shadow-sm" />
      </motion.div>
    </div>
  );
};

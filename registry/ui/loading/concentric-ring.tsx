import React from 'react';
import { motion } from 'framer-motion';

export const ConcentricRing = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <motion.div
        className="absolute w-12 h-12 border-2 border-zinc-800 dark:border-zinc-700 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-8 h-8 border-2 border-zinc-500 border-b-transparent rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-4 h-4 border-2 border-zinc-300 border-l-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

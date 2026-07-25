import React from 'react';
import { motion } from 'framer-motion';

export const DoubleRing = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        className="absolute w-10 h-10 border-2 border-zinc-200 dark:border-zinc-800 rounded-full border-t-zinc-800 dark:border-t-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-6 h-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-full border-b-zinc-800 dark:border-b-white"
        animate={{ rotate: -360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

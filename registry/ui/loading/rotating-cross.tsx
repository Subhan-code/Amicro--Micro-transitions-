import React from 'react';
import { motion } from 'framer-motion';

export const RotatingCross = () => {
  return (
    <motion.div
      className="relative w-8 h-8 flex items-center justify-center"
      animate={{ rotate: 180 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute w-full h-1.5 bg-zinc-800 dark:bg-white rounded-sm" />
      <div className="absolute h-full w-1.5 bg-zinc-800 dark:bg-white rounded-sm" />
    </motion.div>
  );
};

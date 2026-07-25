import React from 'react';
import { motion } from 'framer-motion';

export const CrossSpinner = () => {
  return (
    <motion.div
      className="relative w-8 h-8 flex items-center justify-center"
      animate={{ rotate: [0, 90, 180, 270, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute w-full h-1.5 bg-zinc-800 dark:bg-white rounded-full" />
      <div className="absolute h-full w-1.5 bg-zinc-800 dark:bg-white rounded-full" />
    </motion.div>
  );
};

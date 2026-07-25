import React from 'react';
import { motion } from 'framer-motion';

export const PulseDot = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        className="absolute w-10 h-10 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ scale: [0, 1], opacity: [0.8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full relative z-10" />
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const PulseDot = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        className="absolute w-3 h-3 bg-zinc-800 dark:bg-white rounded-full"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 1, 10 / 3, 10 / 3, 1],
          opacity: [0, 0.8, 0.12, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.1, 0.72, 0.84, 1],
        }}
      />
      <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full relative z-10" />
    </div>
  );
};

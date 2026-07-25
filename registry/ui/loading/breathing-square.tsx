import React from 'react';
import { motion } from 'framer-motion';

export const BreathingSquare = () => {
  return (
    <motion.div
      className="w-8 h-8 bg-zinc-800 dark:bg-white"
      animate={{
        scale: [1, 1.2, 1],
        borderRadius: ["0%", "50%", "0%"],
        rotate: [0, 90, 180]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const MorphingShape = () => {
  return (
    <motion.div
      className="w-10 h-10 bg-zinc-800 dark:bg-white shadow-sm"
      animate={{
        borderRadius: ["10%", "50%", "10%"],
        rotate: [0, 90, 180],
        scale: [1, 0.8, 1],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

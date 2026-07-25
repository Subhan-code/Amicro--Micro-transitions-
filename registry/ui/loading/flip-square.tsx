import React from 'react';
import { motion } from 'framer-motion';

export const FlipSquare = () => {
  return (
    <motion.div
      className="w-8 h-8 bg-zinc-800 dark:bg-white rounded-md shadow-sm"
      animate={{ rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

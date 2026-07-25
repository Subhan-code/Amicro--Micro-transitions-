import React from 'react';
import { motion } from 'framer-motion';

export const BouncingSquare = () => {
  return (
    <div className="relative w-10 h-12 flex items-end justify-center">
      <div className="absolute bottom-0 w-8 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full blur-sm" />
      <motion.div
        className="w-6 h-6 bg-zinc-800 dark:bg-white rounded-sm origin-bottom"
        animate={{ y: [0, -24, 0], scaleY: [0.8, 1.1, 0.8], scaleX: [1.2, 0.9, 1.2] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

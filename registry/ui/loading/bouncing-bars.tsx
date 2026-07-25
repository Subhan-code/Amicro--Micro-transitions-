import React from 'react';
import { motion } from 'framer-motion';

export const BouncingBars = () => {
  return (
    <div className="flex space-x-1.5 h-8 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-8 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

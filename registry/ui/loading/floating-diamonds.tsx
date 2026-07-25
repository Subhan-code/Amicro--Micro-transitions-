import React from 'react';
import { motion } from 'framer-motion';

export const FloatingDiamonds = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-sm rotate-45"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

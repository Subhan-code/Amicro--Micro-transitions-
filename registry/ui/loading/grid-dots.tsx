import React from 'react';
import { motion } from 'framer-motion';

export const GridDots = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ scale: [1, 0.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: (i % 3) * 0.2 + Math.floor(i / 3) * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

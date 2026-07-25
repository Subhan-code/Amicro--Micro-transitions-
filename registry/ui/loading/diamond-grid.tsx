import React from 'react';
import { motion } from 'framer-motion';

export const DiamondGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-2 rotate-45">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-sm"
          animate={{ scale: [1, 0.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

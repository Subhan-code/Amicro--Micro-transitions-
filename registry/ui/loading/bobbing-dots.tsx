import React from 'react';
import { motion } from 'framer-motion';

export const BobbingDots = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

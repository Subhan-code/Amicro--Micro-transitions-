import React from 'react';
import { motion } from 'framer-motion';

export const WaveDots = () => {
  return (
    <div className="flex space-x-1.5 h-6 items-center">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

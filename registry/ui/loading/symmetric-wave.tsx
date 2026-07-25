import React from 'react';
import { motion } from 'framer-motion';

export const SymmetricWave = () => {
  return (
    <div className="flex space-x-1.5 h-10 items-center">
      {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((val, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ height: [8, 24, 8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: val * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

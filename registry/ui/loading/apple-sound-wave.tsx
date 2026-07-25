import React from 'react';
import { motion } from 'framer-motion';

export const AppleSoundWave = () => (
  <div className="flex space-x-1 h-8 items-center">
    {[1, 2, 3, 2, 1].map((val, i) => (
      <motion.div
        key={i}
        className="w-1 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ height: [4, val * 8, 4] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      />
    ))}
  </div>
);

import React from 'react';
import { motion } from 'framer-motion';

export const SiriWave = () => (
  <div className="flex space-x-1 items-center h-8">
    {[0,1,2,3,4].map(i => (
      <motion.div
        key={i}
        className="w-1 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ height: [4, 24, 4] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      />
    ))}
  </div>
);

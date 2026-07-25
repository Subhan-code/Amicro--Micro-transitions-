import React from 'react';
import { motion } from 'framer-motion';

export const AppleEqualizer = () => (
  <div className="flex space-x-1 h-8 items-end">
    {[0,1,2,3].map(i => (
      <motion.div
        key={i}
        className="w-1.5 bg-zinc-800 dark:bg-white rounded-t-sm"
        animate={{ height: ['20%', '100%', '20%'] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() * 0.5, ease: "circInOut" }}
      />
    ))}
  </div>
);

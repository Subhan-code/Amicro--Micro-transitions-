import React from 'react';
import { motion } from 'framer-motion';

export const ElasticBars = () => (
  <div className="flex space-x-2 h-10 items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ height: [8, 36, 8] }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
);

import React from 'react';
import { motion } from 'framer-motion';

export const SpringDotMatrix = () => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ scale: [1, 0.4, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (Math.floor(i / 3) + (i % 3)) * 0.15
          }}
        />
      ))}
    </div>
  );
};

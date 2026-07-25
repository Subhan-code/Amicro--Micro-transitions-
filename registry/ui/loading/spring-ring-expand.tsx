import React from 'react';
import { motion } from 'framer-motion';

export const SpringRingExpand = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute w-10 h-10 border-2 border-zinc-800 dark:border-white rounded-full"
          initial={{ scale: 0.1, opacity: 1 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
};

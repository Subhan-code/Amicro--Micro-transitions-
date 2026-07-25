import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-zinc-500 dark:bg-zinc-350 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

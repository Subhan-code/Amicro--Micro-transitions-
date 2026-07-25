import React from 'react';
import { motion } from 'framer-motion';

export const BouncingLines = () => {
  return (
    <div className="flex flex-col space-y-1.5 w-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-full h-1.5 bg-zinc-800 dark:bg-white rounded-full origin-left"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

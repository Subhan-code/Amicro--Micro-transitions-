import React from 'react';
import { motion } from 'framer-motion';

export const TextShimmerWave = () => {
  const text = "Thinking";
  return (
    <div className="flex font-medium text-lg">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="text-zinc-900 dark:text-white"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const SpringBars = () => (
  <div className="flex flex-col space-y-2 w-10 justify-center">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="h-1.5 bg-zinc-800 dark:bg-white rounded-full origin-left"
        animate={{ scaleX: [0.2, 1, 0.2] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
);

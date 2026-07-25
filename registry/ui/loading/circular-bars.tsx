import React from 'react';
import { motion } from 'framer-motion';

export const CircularBars = () => {
  return (
    <div className="relative w-10 h-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-[18px] w-1 h-3 bg-zinc-800 dark:bg-white rounded-full origin-[2px_20px]"
          style={{ rotate: i * 45 }}
          animate={{ scaleY: [0.5, 1.5, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

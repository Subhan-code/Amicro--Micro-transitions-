import React from 'react';
import { motion } from 'framer-motion';

export const ClassicSpinner = () => {
  return (
    <div className="relative w-8 h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-[14px] w-[4px] h-[8px] bg-zinc-400 dark:bg-zinc-200 rounded-full origin-[2px_16px]"
          style={{ rotate: i * 30 }}
          animate={{ opacity: [1, 0.2] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            delay: i * (1 / 12),
          }}
        />
      ))}
    </div>
  );
};

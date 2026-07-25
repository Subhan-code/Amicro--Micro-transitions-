import React from 'react';
import { motion } from 'framer-motion';

export const DotsRing = () => {
  return (
    <div className="relative w-12 h-12">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 w-2 h-2 bg-zinc-800 dark:bg-white rounded-full -ml-1 origin-[4px_24px]"
          style={{ rotate: i * 45 }}
          animate={{ scale: [1, 0.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

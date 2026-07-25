import React from 'react';
import { motion } from 'framer-motion';

export const OrbitingCircles = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full" />
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full"
          animate={{ rotate: i === 0 ? 360 : -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-zinc-500 dark:bg-zinc-350 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
};

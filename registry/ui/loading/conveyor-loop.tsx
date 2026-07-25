import React from 'react';
import { motion } from 'framer-motion';

export const ConveyorLoop = () => {
  return (
    <div className="w-16 h-3 overflow-hidden relative rounded-full bg-zinc-200 dark:bg-zinc-800">
      <motion.div
        className="flex h-full space-x-2 absolute top-0 items-center"
        animate={{ x: [0, -32] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-zinc-800 dark:bg-white rounded-full shrink-0" />
        ))}
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const TrailingDots = () => (
  <div className="relative w-10 h-10">
    {[0,1,2,3,4].map((i) => (
      <motion.div
        key={i}
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      >
        <div className={`w-2 h-2 rounded-full absolute top-0 left-1/2 -ml-1 ${i === 0 ? 'bg-zinc-800 dark:bg-white' : 'bg-zinc-400 dark:bg-zinc-200'}`} style={{ opacity: 1 - i * 0.2 }} />
      </motion.div>
    ))}
  </div>
);

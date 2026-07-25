import React from 'react';
import { motion } from 'framer-motion';

export const ConcentricPulse = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-zinc-800 dark:border-zinc-700"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 48, height: 48, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

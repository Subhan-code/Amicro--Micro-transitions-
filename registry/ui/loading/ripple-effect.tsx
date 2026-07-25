import React from 'react';
import { motion } from 'framer-motion';

export const RippleEffect = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Center dot */}
      <div className="absolute w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full" />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 border border-zinc-850 dark:border-white rounded-full"
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
};

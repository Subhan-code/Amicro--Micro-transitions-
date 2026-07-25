import React from 'react';
import { motion } from 'framer-motion';

export const DynamicIsland = () => {
  return (
    <motion.div
      className="bg-zinc-950 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center px-4 py-2 gap-3 h-8 shadow-sm"
      animate={{
        width: [80, 110, 80],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Green indicator dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Waveform line */}
      <div className="flex gap-1 items-center h-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-0.5 bg-zinc-300 dark:bg-zinc-500 rounded-full"
            animate={{ height: [3, 8, 3] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

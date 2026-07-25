import React from 'react';
import { motion } from 'framer-motion';

export const TextShimmer = () => {
  return (
    <div className="relative text-zinc-200 font-medium text-lg">
      Thinking
      <motion.div
        className="absolute inset-0 text-zinc-900 dark:text-white"
        style={{ WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)", WebkitMaskSize: "200% 100%" }}
        animate={{ WebkitMaskPosition: ["100% 0%", "-100% 0%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        Thinking
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const GlassmorphicCard = () => (
  <div className="w-20 h-16 bg-zinc-100 dark:bg-zinc-800/50 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm flex items-center justify-center relative overflow-hidden">
    <motion.div
      className="absolute w-12 h-12 bg-zinc-300 dark:bg-zinc-700 rounded-full blur-xl -z-10"
      animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="w-5 h-5 border-2 border-zinc-800 dark:border-zinc-700 border-t-transparent rounded-full animate-spin" />
  </div>
);

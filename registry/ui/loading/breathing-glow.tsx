import React from 'react';
import { motion } from 'framer-motion';

export const BreathingGlow = () => {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <motion.div
        className="absolute w-8 h-8 bg-blue-500 rounded-full blur-md"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative w-6 h-6 bg-white rounded-full shadow-sm" />
    </div>
  );
};

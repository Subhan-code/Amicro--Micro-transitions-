import React from 'react';
import { motion } from 'framer-motion';

export const CometSpinner = () => {
  return (
    <div className="relative w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center">
      <motion.div
        className="absolute w-full h-full rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(39, 39, 42, 0.1) 60%, rgba(39, 39, 42, 1) 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute bg-white w-8 h-8 rounded-full" />
    </div>
  );
};

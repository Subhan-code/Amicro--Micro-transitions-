import React from 'react';
import { motion } from 'framer-motion';

export const FaceIDScan = () => (
  <div className="w-12 h-12 border-2 border-zinc-300 rounded-xl relative overflow-hidden flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-zinc-300 dark:fill-zinc-700">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
    <motion.div
      className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent to-green-400/30 border-b border-green-500"
      animate={{ top: ["-100%", "100%", "-100%"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

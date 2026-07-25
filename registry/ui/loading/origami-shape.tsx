import React from 'react';
import { motion } from 'framer-motion';

export const OrigamiShape = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute top-0 left-0 w-5 h-5 bg-zinc-800 dark:bg-white rounded-tl-md"
      animate={{ rotateY: [0, 180, 0] }}
      style={{ transformOrigin: "right" }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-5 h-5 bg-zinc-500 dark:bg-zinc-350 rounded-br-md"
      animate={{ rotateY: [0, 180, 0] }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

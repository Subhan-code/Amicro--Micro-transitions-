import React from 'react';
import { motion } from 'framer-motion';

export const AppleTextReveal = () => (
  <div className="font-medium text-lg text-zinc-900 dark:text-white overflow-hidden h-6 relative">
    <motion.div
      animate={{ y: ["100%", "0%", "-100%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading
    </motion.div>
  </div>
);

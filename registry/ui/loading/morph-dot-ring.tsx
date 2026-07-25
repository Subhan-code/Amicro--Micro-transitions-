import React from 'react';
import { motion } from 'framer-motion';

export const MorphDotRing = () => (
  <motion.div
    className="grid grid-cols-2 gap-1 w-6 h-6"
    animate={{ rotate: 180, gap: ["4px", "0px", "4px"] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    {[0,1,2,3].map(i => <div key={i} className="w-full h-full bg-zinc-800 dark:bg-white rounded-full" />)}
  </motion.div>
);

import React from 'react';
import { motion } from 'framer-motion';

export const FluidDiamond = () => (
  <motion.div
    className="w-6 h-6 bg-zinc-800 dark:bg-white rounded-sm"
    style={{ rotate: 45 }}
    animate={{ scaleX: [1, 1.5, 1], scaleY: [1, 0.5, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

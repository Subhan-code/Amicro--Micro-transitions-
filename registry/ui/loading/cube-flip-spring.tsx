import React from 'react';
import { motion } from 'framer-motion';

export const CubeFlipSpring = () => (
  <motion.div
    className="w-8 h-8 bg-zinc-800 dark:bg-white rounded-lg"
    animate={{ rotateX: [0, 180, 180], rotateY: [0, 0, 180] }}
    transition={{ duration: 2, repeat: Infinity, type: "spring", bounce: 0.2 }}
  />
);

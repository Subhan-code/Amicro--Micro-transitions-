import React from 'react';
import { motion } from 'framer-motion';

interface WordRevealProps {
  text: string;
  duration?: number;
  staggerDelay?: number;
  className?: string;
}

export function WordReveal({
  text,
  duration = 0.5,
  staggerDelay = 0.04,
  className = '',
}: WordRevealProps) {
  const words = text.split(/\s+/);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`flex flex-wrap gap-x-2 gap-y-1.5 ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  duration?: number;
  staggerDelay?: number;
  initialBlur?: string;
  className?: string;
}

export function BlurText({
  text,
  duration = 0.5,
  staggerDelay = 0.02,
  initialBlur = '8px',
  className = '',
}: BlurTextProps) {
  const characters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, filter: `blur(${initialBlur})` },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`inline-block ${className}`}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export const GradientArc = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        className="w-10 h-10 rounded-full"
        style={{
          background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
          maskImage: "radial-gradient(transparent 55%, black 60%)",
          WebkitMaskImage: "radial-gradient(transparent 55%, black 60%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

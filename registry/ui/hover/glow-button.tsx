import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export function GlowButton({
  children,
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.15)', // Light blue default
  onClick,
}: GlowButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white font-medium text-sm h-11 px-6 shadow-md transition-colors hover:border-neutral-700 cursor-pointer ${className}`}
    >
      {/* Dynamic Cursor Glow Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      
      {/* Content wrapper */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

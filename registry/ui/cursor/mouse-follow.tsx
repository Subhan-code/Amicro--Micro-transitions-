import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MouseFollowProps {
  children?: React.ReactNode;
  stiffness?: number;
  damping?: number;
  className?: string;
}

export function MouseFollow({
  children,
  stiffness = 180,
  damping = 20,
  className = '',
}: MouseFollowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const x = useSpring(0, { stiffness, damping });
  const y = useSpring(0, { stiffness, damping });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className={`fixed top-0 left-0 pointer-events-none z-[9998] ${className}`}
    >
      {children || (
        <div className="w-6 h-6 rounded-full border border-blue-500/50 bg-blue-500/10" />
      )}
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface CursorTrailProps {
  color?: string;
  size?: number;
  count?: number;
}

export function CursorTrail({
  color = 'bg-blue-500',
  size = 8,
  count = 6,
}: CursorTrailProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
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
  }, [isVisible]);

  // Create an array of springs, each following the one in front of it
  return (
    <>
      {isVisible && Array.from({ length: count }).map((_, index) => {
        // Higher index elements have more damping/delay
        const springConfig = {
          stiffness: 300 - index * 30,
          damping: 25 + index * 2,
          mass: 0.2 + index * 0.1,
        };

        return (
          <TrailDot
            key={index}
            index={index}
            coords={coords}
            springConfig={springConfig}
            size={size}
            color={color}
            count={count}
          />
        );
      })}
    </>
  );
}

interface TrailDotProps {
  index: number;
  coords: { x: number; y: number };
  springConfig: { stiffness: number; damping: number; mass: number };
  size: number;
  color: string;
  count: number;
}

function TrailDot({
  index,
  coords,
  springConfig,
  size,
  color,
  count,
}: TrailDotProps) {
  const x = useSpring(coords.x, springConfig);
  const y = useSpring(coords.y, springConfig);

  useEffect(() => {
    x.set(coords.x);
    y.set(coords.y);
  }, [coords, x, y]);

  // Calculate size and opacity based on index (shrinking tail)
  const dotSize = size * (1 - index / count);
  const opacity = 1 - index / count;

  return (
    <motion.div
      style={{
        x,
        y,
        width: dotSize,
        height: dotSize,
        translateX: '-50%',
        translateY: '-50%',
        opacity,
      }}
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] ${color}`}
    />
  );
}

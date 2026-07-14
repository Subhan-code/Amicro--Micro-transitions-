import React, { useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';

interface CardBorderGlowProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
}

export function CardBorderGlow({
  className = '',
  cardClassName = 'bg-neutral-100 dark:bg-neutral-900',
  hovered
}: CardBorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;

  // Glow position
  const glowX = useSpring(50, { stiffness: 150, damping: 20 });
  const glowY = useSpring(50, { stiffness: 150, damping: 20 });
  const glowOpacity = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    glowX.set(px);
    glowY.set(py);
    glowOpacity.set(1);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    glowOpacity.set(0);
  };

  React.useEffect(() => {
    if (hovered !== undefined) {
      if (!hovered) {
        glowOpacity.set(0);
      } else {
        glowX.set(50);
        glowY.set(50);
        glowOpacity.set(1);
      }
    }
  }, [hovered]);

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`relative w-[8rem] h-[11rem] rounded-2xl overflow-hidden p-[1.5px] cursor-pointer ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)"
      }}
    >
      {/* Glow border trail */}
      <motion.div
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle 50px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(99, 102, 241, 0.8), rgba(236, 72, 153, 0.4), transparent)`
        }}
        className="absolute inset-0 pointer-events-none z-0 animate-pulse-slow"
        ref={(node) => {
          if (node) {
            const unsubscribeX = glowX.on("change", (val) => node.style.setProperty("--glow-x", `${val}%`));
            const unsubscribeY = glowY.on("change", (val) => node.style.setProperty("--glow-y", `${val}%`));
            return () => {
              unsubscribeX();
              unsubscribeY();
            };
          }
        }}
      />

      {/* Card Face Content */}
      <div className={`relative z-10 w-full h-full rounded-[14px] flex flex-col justify-between p-4 ${cardClassName}`}>
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">G</div>
        <div className="space-y-1.5">
          <div className="h-2 w-12 rounded bg-indigo-400/30" />
          <div className="h-1.5 w-8 rounded bg-indigo-400/15" />
        </div>
      </div>
    </div>
  );
}

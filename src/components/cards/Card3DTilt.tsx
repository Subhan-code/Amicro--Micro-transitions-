import React, { useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';

interface Card3DTiltProps {
  className?: string;
  cardClassName?: string;
  hovered?: boolean;
}

export function Card3DTilt({
  className = '',
  cardClassName = 'bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-800 dark:to-neutral-900',
  hovered
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;

  // Spring variables for rotation
  const rotateX = useSpring(0, { stiffness: 120, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 15 });

  // Spring variables for glare pos
  const glareX = useSpring(50, { stiffness: 120, damping: 15 });
  const glareY = useSpring(50, { stiffness: 120, damping: 15 });
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Angle calculations (max +/- 18deg)
    const rx = -(mouseY / (height / 2)) * 18;
    const ry = (mouseX / (width / 2)) * 18;

    rotateX.set(rx);
    rotateY.set(ry);

    const px = ((e.clientX - rect.left) / width) * 100;
    const py = ((e.clientY - rect.top) / height) * 100;
    glareX.set(px);
    glareY.set(py);
    glareOpacity.set(0.65);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    glareOpacity.set(0.65);
  };

  React.useEffect(() => {
    if (hovered !== undefined) {
      if (!hovered) {
        rotateX.set(0);
        rotateY.set(0);
        glareOpacity.set(0);
      } else {
        rotateX.set(10);
        rotateY.set(-10);
        glareOpacity.set(0.45);
      }
    }
  }, [hovered]);

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
      className={`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className={`absolute inset-0 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-neutral-200/20 overflow-hidden flex flex-col justify-between p-4 ${cardClassName}`}
      >
        <div style={{ transform: 'translateZ(20px)' }} className="w-6 h-6 rounded-full bg-white/20 border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-white/50">3D</div>
        <div style={{ transform: 'translateZ(10px)' }} className="space-y-1.5">
          <div className="h-2 w-14 rounded bg-white/35" />
          <div className="h-1.5 w-9 rounded bg-white/20" />
        </div>

        {/* Gloss Overlay */}
        <motion.div
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle 75px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.3), transparent)`
          }}
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
          ref={(node) => {
            if (node) {
              const unsubscribeX = glareX.on("change", (val) => node.style.setProperty("--glare-x", `${val}%`));
              const unsubscribeY = glareY.on("change", (val) => node.style.setProperty("--glare-y", `${val}%`));
              return () => {
                unsubscribeX();
                unsubscribeY();
              };
            }
          }}
        />
      </motion.div>
    </div>
  );
}

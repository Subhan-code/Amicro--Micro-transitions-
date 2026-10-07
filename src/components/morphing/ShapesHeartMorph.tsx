"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export interface ShapesHeartMorphProps {
  className?: string;
  autoLoop?: boolean;
}

export function ShapesHeartMorph({
  className = "",
  autoLoop = true,
}: ShapesHeartMorphProps) {
  // 'shapes' -> 'heart'
  const [phase, setPhase] = useState<"shapes" | "heart">("shapes");
  const [cycleKey, setCycleKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    // Start with shapes, after short pause (1.8s) morph to heart
    t1 = setTimeout(() => {
      setPhase("heart");
    }, 1800);

    // If autoLoop, hold for 3s then loop back
    if (autoLoop) {
      t2 = setTimeout(() => {
        setPhase("shapes");
        setCycleKey((k) => k + 1);
      }, 5200);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [cycleKey, autoLoop]);

  const restart = () => {
    setPhase("shapes");
    setCycleKey((k) => k + 1);
  };

  const bounceSpring = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: "spring", stiffness: 380, damping: 20, mass: 0.8 };

  const heartSpring = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: "spring", stiffness: 320, damping: 22, mass: 0.8 };

  return (
    <div
      onClick={restart}
      className={`relative w-full h-full min-h-[220px] bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none ${className}`}
      title="Click to replay animation"
      aria-label="Cartoon shapes morphing into heart animation"
    >
      <div className="relative size-[220px] flex items-center justify-center">
        {/* 1. Five Flat Cartoon Shapes Orbiting Center */}
        <AnimatePresence>
          {phase === "shapes" && (
            <motion.div
              key={`shapes-group-${cycleKey}`}
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.2,
                transition: { duration: 0.35, ease: "easeInOut" },
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* Shape 1: Purple Irregular Star (Top-Left) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...bounceSpring, delay: 0.05 }}
                className="absolute"
                style={{ top: "18px", left: "22px" }}
              >
                <svg viewBox="0 0 100 100" className="size-14 overflow-visible">
                  <path
                    d="M 50 10 L 63 28 L 88 28 L 71 47 L 78 72 L 53 58 L 28 73 L 34 48 L 14 31 L 38 30 Z"
                    fill="#9333ea"
                  />
                  {/* Two Simple Black Eyes */}
                  <circle cx="43" cy="42" r="3" fill="#000000" />
                  <circle cx="57" cy="42" r="3" fill="#000000" />
                </svg>
              </motion.div>

              {/* Shape 2: Red Circle (Top-Right) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...bounceSpring, delay: 0.15 }}
                className="absolute"
                style={{ top: "20px", right: "24px" }}
              >
                <svg viewBox="0 0 100 100" className="size-13 overflow-visible">
                  <circle cx="50" cy="50" r="36" fill="#ef4444" />
                  {/* Two Simple Black Eyes */}
                  <circle cx="42" cy="48" r="3" fill="#000000" />
                  <circle cx="58" cy="48" r="3" fill="#000000" />
                </svg>
              </motion.div>

              {/* Shape 3: Blue Cloud (Bottom-Left) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...bounceSpring, delay: 0.25 }}
                className="absolute"
                style={{ bottom: "22px", left: "20px" }}
              >
                <svg viewBox="0 0 100 100" className="size-15 overflow-visible">
                  <path
                    d="M 28 58 A 16 16 0 0 1 42 32 A 22 22 0 0 1 72 35 A 16 16 0 0 1 86 58 A 14 14 0 0 1 76 74 L 26 74 A 14 14 0 0 1 28 58 Z"
                    fill="#3b82f6"
                  />
                  {/* Two Simple Black Eyes */}
                  <circle cx="47" cy="54" r="3" fill="#000000" />
                  <circle cx="61" cy="54" r="3" fill="#000000" />
                </svg>
              </motion.div>

              {/* Shape 4: Gray Teardrop (Bottom-Right) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...bounceSpring, delay: 0.35 }}
                className="absolute"
                style={{ bottom: "20px", right: "26px" }}
              >
                <svg viewBox="0 0 100 100" className="size-13 overflow-visible">
                  <path
                    d="M 50 16 C 50 16 22 50 22 66 A 28 28 0 0 0 78 66 C 78 50 50 16 50 16 Z"
                    fill="#71717a"
                  />
                  {/* Two Simple Black Eyes */}
                  <circle cx="42" cy="64" r="3" fill="#000000" />
                  <circle cx="58" cy="64" r="3" fill="#000000" />
                </svg>
              </motion.div>

              {/* Shape 5: Orange Triangle (Top-Center Offset) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...bounceSpring, delay: 0.45 }}
                className="absolute"
                style={{ top: "6px", left: "82px" }}
              >
                <svg viewBox="0 0 100 100" className="size-13 overflow-visible">
                  <path
                    d="M 50 18 L 82 74 A 7 7 0 0 1 76 82 L 24 82 A 7 7 0 0 1 18 74 Z"
                    fill="#f97316"
                  />
                  {/* Two Simple Black Eyes */}
                  <circle cx="43" cy="62" r="3" fill="#000000" />
                  <circle cx="57" cy="62" r="3" fill="#000000" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Solid Red Heart Scaling Up in Center & Holding */}
        <AnimatePresence>
          {phase === "heart" && (
            <motion.div
              key={`heart-${cycleKey}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={heartSpring}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg viewBox="0 0 100 100" className="size-24 overflow-visible">
                <path
                  d="M 50 84 C 20 62 8 44 8 28 A 19 19 0 0 1 48 18 L 50 22 L 52 18 A 19 19 0 0 1 92 28 C 92 44 80 62 50 84 Z"
                  fill="#ef4444"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

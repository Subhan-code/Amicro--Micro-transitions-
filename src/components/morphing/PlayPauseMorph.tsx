"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface PlayPauseMorphProps {
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  className?: string;
}

export function PlayPauseMorph({
  isPlaying: controlledIsPlaying,
  onPlayingChange,
  className = "",
}: PlayPauseMorphProps) {
  const [uncontrolledIsPlaying, setUncontrolledIsPlaying] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : uncontrolledIsPlaying;

  const toggle = () => {
    const next = !isPlaying;
    if (controlledIsPlaying === undefined) setUncontrolledIsPlaying(next);
    onPlayingChange?.(next);
  };

  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };

  // Smooth two-half geometric morph between pause bars and play triangle
  const leftBarPath = isPlaying
    ? "M 14 5 L 18 5 L 18 19 L 14 19 Z" // Pause: right bar
    : "M 13 8.5 L 19 12 L 19 12 L 13 15.5 Z"; // Play: right tip

  const rightBarPath = isPlaying
    ? "M 6 5 L 10 5 L 10 19 L 6 19 Z" // Pause: left bar
    : "M 7 5 L 13 8.5 L 13 15.5 L 7 19 Z"; // Play: left base

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause track" : "Play track"}
        className="size-10 rounded-full bg-black border border-white/[0.08] hover:border-white/20 active:scale-97 flex items-center justify-center cursor-pointer transition-colors shadow-lg"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4.5 fill-white text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d={rightBarPath}
            transition={spring}
            fill="currentColor"
          />
          <motion.path
            d={leftBarPath}
            transition={spring}
            fill="currentColor"
          />
        </svg>
      </motion.button>

      <span className="text-[11px] text-neutral-400 font-mono tracking-tight">
        {isPlaying ? "Playing · 02:45" : "Paused"}
      </span>
    </div>
  );
}

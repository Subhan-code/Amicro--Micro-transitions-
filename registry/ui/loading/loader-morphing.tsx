"use client";
import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";

export interface LoaderMorphingProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  size?: number;
  color?: string;
  duration?: number;
}

export function LoaderMorphing({
  className = "",
  size = 40,
  color = "currentColor",
  duration = 2,
  ...props
}: LoaderMorphingProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        display: "inline-block",
      }}
      animate={{
        borderRadius: ["20%", "50%", "20%", "50%", "20%"],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.2, 1, 1.2, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

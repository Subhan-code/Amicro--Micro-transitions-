"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ShoppingCart, Check, Plus, RotateCcw } from "lucide-react";

export interface AddToCartMorphProps {
  count?: number;
  onCountChange?: (count: number) => void;
  className?: string;
}

export function AddToCartMorph({
  count: controlledCount,
  onCountChange,
  className = "",
}: AddToCartMorphProps) {
  const [uncontrolledCount, setUncontrolledCount] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const count = controlledCount !== undefined ? controlledCount : uncontrolledCount;

  const setCount = (newVal: number) => {
    if (controlledCount === undefined) setUncontrolledCount(newVal);
    onCountChange?.(newVal);
  };

  const handleAdd = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    setIsAdded(true);
    setAnimatingId(nextCount);

    setTimeout(() => {
      setIsAdded(false);
      setAnimatingId(null);
    }, 1400);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    setIsAdded(false);
    setAnimatingId(null);
  };

  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Main Morphing Action Button */}
        <motion.button
          layout
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          className={`relative h-11 px-5 rounded-full font-medium text-xs tracking-tight transition-colors border select-none cursor-pointer flex items-center justify-center overflow-hidden min-w-[110px] ${
            isAdded
              ? "bg-white text-black border-white"
              : "bg-black text-white border-white/[0.08] hover:border-white/20"
          }`}
          aria-label={isAdded ? "Added to cart" : "Add to cart"}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={spring}
                className="flex items-center gap-1.5 font-semibold text-black"
              >
                <Check className="size-3.5 stroke-[2.5]" />
                Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={spring}
                className="flex items-center gap-1.5 text-white"
              >
                <Plus className="size-3.5 stroke-[2]" />
                {count > 0 ? "Add more" : "Add"}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Flying count particle morphing toward cart */}
          {animatingId !== null && (
            <motion.span
              layoutId="cart-counter-flight"
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="absolute size-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center pointer-events-none"
            >
              +1
            </motion.span>
          )}
        </motion.button>

        {/* Target Cart Badge on the same row */}
        <div className="relative">
          <motion.div
            layout
            transition={spring}
            className="size-11 rounded-full bg-black border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-white"
          >
            <ShoppingCart className="size-4 text-neutral-300" />
            <AnimatePresence>
              {count > 0 && (
                <motion.div
                  layoutId={animatingId !== null ? "cart-counter-flight" : undefined}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={spring}
                  className="absolute -top-1 -right-1 size-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center tabular-nums shadow-md"
                >
                  {count}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {count > 0 && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset count"
            className="size-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Reset cart"
          >
            <RotateCcw className="size-3.5" />
          </button>
        )}
      </div>

      <div className="text-[11px] text-neutral-500 tracking-tight">
        {count === 0 ? "Empty cart" : `${count} item${count > 1 ? "s" : ""} in bag`}
      </div>
    </div>
  );
}

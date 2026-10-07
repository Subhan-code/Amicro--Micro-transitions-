"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Timer, Phone, PhoneOff, Check, Package, ChevronRight, X } from "lucide-react";

export type DynamicIslandState = "timer" | "call" | "delivery";

export interface DynamicIslandProps {
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  state?: DynamicIslandState;
  onStateChange?: (state: DynamicIslandState) => void;
  className?: string;
}

export function DynamicIsland({
  expanded: controlledExpanded,
  onExpandedChange,
  state: controlledState,
  onStateChange,
  className = "",
}: DynamicIslandProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const [uncontrolledState, setUncontrolledState] = useState<DynamicIslandState>("timer");
  const islandRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : uncontrolledExpanded;
  const activeState = controlledState !== undefined ? controlledState : uncontrolledState;

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const setState = (next: DynamicIslandState) => {
    if (controlledState === undefined) setUncontrolledState(next);
    onStateChange?.(next);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setExpanded(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="flex gap-1.5 mb-3 bg-[#111113] p-1 rounded-full border border-white/[0.08]">
        {(["timer", "call", "delivery"] as DynamicIslandState[]).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setState(st)}
            className={`px-2.5 py-1 text-[11px] font-medium tracking-tight rounded-full transition-colors cursor-pointer ${
              activeState === st
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {st === "timer" ? "Timer" : st === "call" ? "Call" : "Delivery"}
          </button>
        ))}
      </div>

      <div ref={islandRef} className="relative z-20 flex justify-center">
        <motion.div
          layout
          transition={spring}
          onClick={() => !isExpanded && setExpanded(true)}
          role={isExpanded ? "region" : "button"}
          tabIndex={isExpanded ? undefined : 0}
          onKeyDown={(e) => {
            if (!isExpanded && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setExpanded(true);
            }
          }}
          aria-expanded={isExpanded}
          className={`bg-black text-white border border-white/[0.08] shadow-2xl overflow-hidden cursor-pointer select-none ${
            isExpanded
              ? "rounded-2xl w-[320px] p-4 cursor-default border-white/20"
              : "rounded-full px-3.5 py-2 hover:border-white/20 active:scale-97 flex items-center gap-2.5"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isExpanded ? (
              <motion.div
                key={`collapsed-${activeState}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={spring}
                className="flex items-center gap-2.5 text-xs font-medium tracking-tight whitespace-nowrap"
              >
                {activeState === "timer" && (
                  <>
                    <div className="size-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Timer className="size-3" />
                    </div>
                    <span className="text-white font-mono tabular-nums">04:32</span>
                    <span className="text-neutral-400 text-[11px]">Tea brew</span>
                  </>
                )}
                {activeState === "call" && (
                  <>
                    <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                      <Phone className="size-3" />
                    </div>
                    <span className="text-white">Alex Chen</span>
                    <span className="text-emerald-400 text-[11px]">Incoming</span>
                  </>
                )}
                {activeState === "delivery" && (
                  <>
                    <div className="size-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Package className="size-3" />
                    </div>
                    <span className="text-white font-medium">Uber Eats</span>
                    <span className="text-neutral-400 text-[11px]">4 mins away</span>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`expanded-${activeState}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={spring}
                className="space-y-3.5 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {activeState === "timer" && (
                      <div className="size-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Timer className="size-4" />
                      </div>
                    )}
                    {activeState === "call" && (
                      <div className="size-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Phone className="size-4" />
                      </div>
                    )}
                    {activeState === "delivery" && (
                      <div className="size-9 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                        <Package className="size-4" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {activeState === "timer"
                          ? "Tea brew timer"
                          : activeState === "call"
                          ? "Alex Chen"
                          : "Sweetgreen Delivery"}
                      </h4>
                      <p className="text-xs text-neutral-400 tracking-tight">
                        {activeState === "timer"
                          ? "Remaining: 04:32"
                          : activeState === "call"
                          ? "Mobile · +1 (555) 019-2831"
                          : "Courier arriving in 4 mins"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(false);
                    }}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Collapse island"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {activeState === "timer" && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        +1 Min
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {activeState === "call" && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneOff className="size-3.5" /> Decline
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="size-3.5" /> Accept
                      </button>
                    </>
                  )}
                  {activeState === "delivery" && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Call Driver
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Track <ChevronRight className="size-3" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

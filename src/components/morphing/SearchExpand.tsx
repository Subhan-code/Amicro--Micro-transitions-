"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";

export interface SearchExpandProps {
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchExpand({
  expanded: controlledExpanded,
  onExpandedChange,
  value: controlledValue,
  onChange,
  placeholder = "Search components, tokens...",
  className = "",
}: SearchExpandProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : uncontrolledExpanded;
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const setValue = (val: string) => {
    if (controlledValue === undefined) setUncontrolledValue(val);
    onChange?.(val);
  };

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isExpanded]);

  const handleBlur = (e: React.FocusEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node) &&
      value.trim() === ""
    ) {
      setExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (value.length > 0) {
        setValue("");
      } else {
        setExpanded(false);
      }
    }
  };

  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={`relative flex items-center justify-center w-full max-w-[320px] ${className}`}
    >
      <motion.div
        layout
        transition={spring}
        className={`relative flex items-center bg-black border border-white/[0.08] hover:border-white/20 shadow-md ${
          isExpanded
            ? "w-full h-10 rounded-full px-3 gap-2 border-white/20"
            : "size-10 rounded-full justify-center cursor-pointer"
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0 ${
            isExpanded ? "p-0.5" : "size-full"
          }`}
          aria-label={isExpanded ? "Search" : "Expand search bar"}
        >
          <Search className="size-4" />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={spring}
              className="flex items-center flex-1 overflow-hidden"
            >
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none border-none tracking-tight pr-1"
              />

              {value ? (
                <button
                  type="button"
                  onClick={() => {
                    setValue("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block text-[10px] text-neutral-500 font-mono px-1.5 py-0.5 rounded border border-white/[0.06] shrink-0">
                  ESC
                </kbd>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

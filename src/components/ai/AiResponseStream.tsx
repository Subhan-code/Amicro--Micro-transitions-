import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, RotateCw, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Code2 } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

export interface AiResponseStreamProps {
  theme?: 'dark' | 'light';
  title?: string;
  codeSnippet?: string;
  explanation?: string;
}

const DEFAULT_CODE = `import { motion } from "motion/react";

export function SpringCard() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="p-6 rounded-2xl bg-zinc-900 border border-white/10 shadow-xl"
    >
      <h3 className="text-white font-semibold">Fluid Motion Card</h3>
      <p className="text-zinc-400 text-sm mt-1">Zero layout shifts, pure 60fps spring responsiveness.</p>
    </motion.div>
  );
}`;

export function AiResponseStream({
  theme = 'dark',
  title = "Generated Spring Component",
  codeSnippet = DEFAULT_CODE,
  explanation = "Here is the verified motion component utilizing cubic-spring damping physics. It compiles cleanly with Tailwind CSS v4 and React 19.",
}: AiResponseStreamProps) {
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [branchIndex, setBranchIndex] = useState(1);
  const totalBranches = 3;

  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    triggerHaptic('medium');
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 800);
  };

  const handleVote = (type: 'up' | 'down') => {
    triggerHaptic('light');
    setVote(prev => prev === type ? null : type);
  };

  const handlePrevBranch = () => {
    triggerHaptic('light');
    setBranchIndex(prev => (prev > 1 ? prev - 1 : totalBranches));
  };

  const handleNextBranch = () => {
    triggerHaptic('light');
    setBranchIndex(prev => (prev < totalBranches ? prev + 1 : 1));
  };

  return (
    <div className="w-full max-w-[800px] mx-auto select-none">
      <div 
        className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md ${
          isDark 
            ? 'bg-[#141417] border-white/[0.08] text-white shadow-black/40' 
            : 'bg-white border-neutral-200 text-black shadow-neutral-200/50'
        }`}
      >
        {/* Explanation text */}
        <div className="p-4 sm:p-5 pb-3">
          <p className={`text-[13.5px] sm:text-[14px] leading-relaxed m-0 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {explanation}
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="px-4 sm:px-5 pb-4">
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'bg-[#0d0d0f] border-white/[0.06]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            {/* Code Header Bar */}
            <div className={`flex items-center justify-between px-3.5 py-2 border-b text-xs ${
              isDark ? 'border-white/[0.06] text-neutral-400 bg-white/[0.02]' : 'border-neutral-200 text-neutral-600 bg-neutral-100/50'
            }`}>
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-mono text-[11px] font-medium">SpringCard.tsx</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer border-0 transition-colors text-xs ${
                  isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Content */}
            <pre className="p-3.5 sm:p-4 text-xs font-mono leading-relaxed overflow-x-auto m-0 text-neutral-300">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Micro-Action Response Footer Bar */}
        <div className={`flex items-center justify-between px-4 sm:px-5 py-2.5 border-t text-xs ${
          isDark ? 'border-white/[0.06] bg-white/[0.01]' : 'border-neutral-100 bg-neutral-50/50'
        }`}>
          
          {/* Left: Branch Version Switcher (< 1 of 3 >) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevBranch}
              className={`p-1 rounded-md cursor-pointer border-0 transition-colors ${
                isDark ? 'hover:bg-white/10 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Previous variation"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-neutral-500">
              {branchIndex} / {totalBranches}
            </span>
            <button
              type="button"
              onClick={handleNextBranch}
              className={`p-1 rounded-md cursor-pointer border-0 transition-colors ${
                isDark ? 'hover:bg-white/10 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Next variation"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Actions (Copy, Regenerate, Upvote, Downvote) */}
          <div className="flex items-center gap-1">
            
            {/* Copy Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Regenerate Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleRegenerate}
              className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Regenerate alternative"
            >
              <motion.div
                animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </motion.div>
            </motion.button>

            {/* Thumbs Up */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => handleVote('up')}
              className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                vote === 'up'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Helpful output"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </motion.button>

            {/* Thumbs Down */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => handleVote('down')}
              className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                vote === 'down'
                  ? 'bg-rose-500/20 text-rose-400'
                  : isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Not what I needed"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

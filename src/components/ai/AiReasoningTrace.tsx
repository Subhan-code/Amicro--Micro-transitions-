import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronDown, CheckCircle2, Clock, Sparkles, Copy, Check } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

export interface AiReasoningTraceProps {
  theme?: 'dark' | 'light';
  durationSeconds?: number;
  steps?: string[];
  isStreaming?: boolean;
}

const DEFAULT_STEPS = [
  "Analyzing micro-interaction physics and component layout...",
  "Evaluating spring stiffness (420) and damping (28) ratios for 60fps responsiveness...",
  "Computing responsive touch targets (minimum 44px) for mobile gestures...",
  "Synthesizing zero-dependency TSX primitives with Framer Motion integration...",
  "Finalizing verified component architecture and copy-paste registry payload.",
];

export function AiReasoningTrace({
  theme = 'dark',
  durationSeconds = 3.2,
  steps = DEFAULT_STEPS,
  isStreaming = false,
}: AiReasoningTraceProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(isStreaming ? 0 : steps.length);
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setActiveStepIdx(prev => {
          if (prev < steps.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 700);
      return () => clearInterval(interval);
    } else {
      setActiveStepIdx(steps.length);
    }
  }, [isStreaming, steps.length]);

  const handleCopyTrace = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(steps.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto select-none">
      <div 
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
          isDark 
            ? 'bg-[#121215] border-purple-500/20 text-neutral-300' 
            : 'bg-purple-50/50 border-purple-200/80 text-neutral-800'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-purple-500/15">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsOpen(prev => !prev);
            }}
            className="flex items-center gap-2.5 cursor-pointer border-0 bg-transparent p-0 text-inherit hover:opacity-90"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/15 text-purple-400">
              <Brain className="w-3.5 h-3.5" />
              {isStreaming && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-purple-400">
                {isStreaming ? "Thinking in progress..." : `Thought for ${durationSeconds}s`}
              </span>
              <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {steps.length} reasoning steps
              </span>
            </div>

            <ChevronDown 
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Right: Copy Trace */}
          <button
            type="button"
            onClick={handleCopyTrace}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer border-0 transition-colors ${
              isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-purple-100 text-neutral-600'
            }`}
            title="Copy thought trace"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px] hidden sm:inline">Copy trace</span>
              </>
            )}
          </button>
        </div>

        {/* Expandable Reasoning Steps */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-3.5 sm:p-4 space-y-2.5 font-sans">
                {steps.map((step, idx) => {
                  const isCompleted = idx < activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed"
                    >
                      <div className="pt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        ) : isCurrent ? (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 rounded-full border border-neutral-600" />
                        )}
                      </div>
                      <p className={`m-0 ${isCompleted ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {step}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

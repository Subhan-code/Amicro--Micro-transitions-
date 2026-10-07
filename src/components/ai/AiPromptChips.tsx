import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

export interface AiPromptChipsProps {
  theme?: 'dark' | 'light';
  onSelectPrompt: (prompt: string) => void;
  chips?: Array<{ id: string; label: string; prompt: string; icon?: string }>;
}

const DEFAULT_CHIPS = [
  { id: '1', label: 'Spring Tilt Card', prompt: 'Create an interactive 3D card spread with spring tilt physics on cursor move', icon: '✨' },
  { id: '2', label: 'Particle Burst Button', prompt: 'Add dynamic multi-color particle burst micro-interaction on CTA button click', icon: '💥' },
  { id: '3', label: 'Reasoning Accordion', prompt: 'Build a collapsible AI reasoning trace block with live elapsed timer and status nodes', icon: '🧠' },
  { id: '4', label: 'Magnetic Pill Dock', prompt: 'Design a macOS inspired floating island dock with spring magnetic pull effect', icon: '🧲' },
];

export function AiPromptChips({
  theme = 'dark',
  onSelectPrompt,
  chips = DEFAULT_CHIPS,
}: AiPromptChipsProps) {
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex items-center justify-center select-none py-1">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[800px]">
        {chips.map((chip, index) => (
          <motion.button
            key={chip.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHaptic('light');
              onSelectPrompt(chip.prompt);
            }}
            className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all duration-200 ${
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] text-neutral-300 hover:text-white'
                : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 hover:text-black shadow-xs'
            }`}
          >
            <span>{chip.icon || '✨'}</span>
            <span>{chip.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

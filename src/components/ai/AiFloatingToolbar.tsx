import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wand2, Terminal, Zap, Check } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

export interface AiFloatingToolbarProps {
  theme?: 'dark' | 'light';
  onAction?: (actionId: string) => void;
}

export function AiFloatingToolbar({
  theme = 'dark',
  onAction,
}: AiFloatingToolbarProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  const actions = [
    { id: 'motion', label: 'Add Spring Motion', icon: Sparkles },
    { id: 'refactor', label: 'Refactor TSX', icon: Wand2 },
    { id: 'haptics', label: 'Add Haptics', icon: Zap },
    { id: 'cli', label: 'Generate CLI', icon: Terminal },
  ];

  const handleSelect = (id: string) => {
    triggerHaptic('medium');
    setActiveAction(id);
    if (onAction) onAction(id);
    setTimeout(() => setActiveAction(null), 1500);
  };

  return (
    <div className="w-full flex items-center justify-center py-2 select-none">
      <div 
        className={`flex items-center gap-1 p-1 rounded-full border shadow-xl backdrop-blur-xl ${
          isDark 
            ? 'bg-[#18181c]/90 border-white/10 text-white' 
            : 'bg-white/90 border-neutral-200 text-black shadow-lg'
        }`}
      >
        {actions.map((act) => {
          const Icon = act.icon;
          const isDone = activeAction === act.id;

          return (
            <motion.button
              key={act.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(act.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 transition-colors ${
                isDone
                  ? 'bg-emerald-500 text-white font-semibold'
                  : isDark
                  ? 'bg-transparent hover:bg-white/10 text-neutral-300 hover:text-white'
                  : 'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-black'
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              <span>{isDone ? 'Applied!' : act.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

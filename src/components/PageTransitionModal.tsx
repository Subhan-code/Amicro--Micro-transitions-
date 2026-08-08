import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Copy, Check, Terminal, Code2, Play, Sparkles } from 'lucide-react';
import { TransitionPreset } from '../data/transitions';
import { PageTransitionOverlay } from './PageTransitionOverlay';
import { useWebHaptics } from '../hooks/useWebHaptics';

interface PageTransitionModalProps {
  preset: TransitionPreset | null;
  theme: 'dark' | 'light';
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const PageTransitionModal: React.FC<PageTransitionModalProps> = ({
  preset,
  theme,
  onClose,
  showToast,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<'A' | 'B'>('A');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [copiedType, setCopiedType] = useState<'code' | 'cli' | null>(null);
  const { trigger: triggerHaptic } = useWebHaptics();

  if (!preset) return null;

  const triggerModalTransition = () => {
    if (isAnimating) return;
    triggerHaptic('medium');
    setIsAnimating(true);

    setTimeout(() => {
      setActivePage((prev) => (prev === 'A' ? 'B' : 'A'));
    }, 380 * speedMultiplier);

    setTimeout(() => {
      setIsAnimating(false);
    }, 850 * speedMultiplier);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(preset.code);
    triggerHaptic('success');
    setCopiedType('code');
    showToast(`Copied ${preset.name} transition code!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(preset.cliCommand);
    triggerHaptic('light');
    setCopiedType('cli');
    showToast(`Copied CLI command: ${preset.cliCommand}`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border overflow-hidden flex flex-col shadow-2xl ${
          isDark ? 'bg-[#121216] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {preset.category}
            </span>
            <h3 className="text-lg font-bold tracking-tight">{preset.name}</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          
          {/* Interactive Preview Canvas */}
          <div className={`relative w-full aspect-[16/9] min-h-[300px] rounded-2xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <AnimatePresence mode="wait">
              {activePage === 'A' ? (
                <div key="modal-page-A" className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#0d0e14] via-[#090a0e] to-[#121019] text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400">AMICRO STUDIO CANVAS (PAGE A)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">60 FPS</span>
                  </div>
                  <div className="my-auto">
                    <h4 className="text-2xl font-bold">{preset.name}</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-md">{preset.description}</p>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500">CLICK TRIGGER BELOW TO TEST MOTION</div>
                </div>
              ) : (
                <div key="modal-page-B" className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#0a120e] via-[#090d0b] to-[#0f1712] text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400">APEX AI TERMINAL (PAGE B)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400">LATENCY &lt; 1ms</span>
                  </div>
                  <div className="my-auto">
                    <h4 className="text-2xl font-bold">{preset.name}</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-md">Seamless component trees swap on route transition.</p>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500">CLICK TRIGGER BELOW TO TEST MOTION</div>
                </div>
              )}
            </AnimatePresence>

            {/* Transition Overlay */}
            <PageTransitionOverlay
              transitionId={preset.id}
              isAnimating={isAnimating}
              theme={theme}
              speedMultiplier={speedMultiplier}
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={triggerModalTransition}
                disabled={isAnimating}
                className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-600/25 border-0"
              >
                <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                <span>Trigger Transition</span>
              </button>

              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono px-2 text-neutral-400">Speed:</span>
                {[
                  { label: '0.6x', val: 0.65 },
                  { label: '1.0x', val: 1 },
                  { label: '1.5x', val: 1.4 },
                ].map((sp) => (
                  <button
                    key={sp.label}
                    onClick={() => setSpeedMultiplier(sp.val)}
                    className={`h-7 px-2.5 rounded-lg text-[11px] font-mono font-semibold cursor-pointer border-0 ${
                      speedMultiplier === sp.val ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border-0"
              >
                {copiedType === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4" />}
                <span>{copiedType === 'code' ? 'Code Copied' : 'Copy TSX Code'}</span>
              </button>

              <button
                onClick={handleCopyCli}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border-0"
              >
                {copiedType === 'cli' ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
                <span>{copiedType === 'cli' ? 'CLI Copied' : 'Copy CLI'}</span>
              </button>
            </div>
          </div>

          {/* TSX Code Viewer */}
          <div className="mt-2 rounded-2xl bg-[#09090c] border border-white/10 p-4 font-mono text-xs overflow-x-auto text-neutral-300">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
              <span className="text-indigo-400 font-bold">{preset.name} Source Code</span>
              <span className="text-[10px] text-neutral-500">{preset.cliCommand}</span>
            </div>
            <pre><code>{preset.code}</code></pre>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

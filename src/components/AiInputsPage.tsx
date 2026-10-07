import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { AiPromptInput } from './ai/AiPromptInput';
import { AiPromptChips } from './ai/AiPromptChips';
import { AiReasoningTrace } from './ai/AiReasoningTrace';
import { AiResponseStream } from './ai/AiResponseStream';
import { AiFloatingToolbar } from './ai/AiFloatingToolbar';
import { formatCliCommand, RegistryMode, getStoredRegistryMode } from '../utils/registryPreference';

interface AiInputsPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  embedded?: boolean;
}

export function AiInputsPage({
  theme,
  onNavigateHome,
  showToast,
  triggerHaptic,
  embedded = false,
}: AiInputsPageProps) {
  const [activePrompt, setActivePrompt] = useState('');
  const [isSimulatingStream, setIsSimulatingStream] = useState(false);
  const [copiedCli, setCopiedCli] = useState<string | null>(null);
  const [registryMode] = useState<RegistryMode>(getStoredRegistryMode());
  const { trigger } = useWebHaptics();
  const isDark = theme === 'dark';

  const handleCopyCmd = (componentSlug: string) => {
    const cmd = formatCliCommand(componentSlug, registryMode);
    navigator.clipboard.writeText(cmd);
    (triggerHaptic || trigger)('success');
    setCopiedCli(componentSlug);
    if (showToast) showToast(`Copied ${cmd}`);
    setTimeout(() => setCopiedCli(null), 2000);
  };

  const handleSendPrompt = (promptText: string) => {
    (triggerHaptic || trigger)('success');
    setIsSimulatingStream(true);
    if (showToast) showToast('Prompt dispatched to AI synthesis model!');
    setTimeout(() => {
      setIsSimulatingStream(false);
    }, 3000);
  };

  return (
    <div className={`w-full min-h-dvh transition-colors duration-300 pb-20 ${
      embedded ? 'bg-transparent text-inherit' : isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#f8f9fa] text-black'
    }`}>
      
      {/* Top Breadcrumb (Only if not embedded in catalog) */}
      {!embedded && (
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
          <button 
            onClick={onNavigateHome}
            className={`flex items-center gap-2 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      )}

      {/* Hero Header */}
      <section className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8 text-center flex flex-col items-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ${
          isDark ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-700'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Micro-Interactions</span>
        </div>

        <h1 className={`text-[28px] sm:text-[44px] font-bold leading-[1.15] tracking-tight max-w-[750px] mb-3 sm:mb-4 ${
          isDark ? 'text-white' : 'text-black'
        }`}>
          AI Inputs &amp; Fluid Reasoning Traces
        </h1>

        <p className={`text-[14px] sm:text-[16px] leading-[22px] sm:leading-[25px] max-w-[580px] mb-6 ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          Production-grade AI prompt inputs, model pickers, voice dictation, thinking accordions, and streaming response toolbars crafted with Motion and Tailwind CSS.
        </p>
      </section>

      {/* Main Interactive Studio Canvas */}
      <div className="w-full max-w-[880px] mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Suggestion Chips */}
        <AiPromptChips
          theme={theme}
          onSelectPrompt={(text) => {
            setActivePrompt(text);
            if (showToast) showToast("Prompt populated!");
          }}
        />

        {/* AI Prompt Input Bar */}
        <div className="w-full">
          <AiPromptInput
            theme={theme}
            initialValue={activePrompt}
            onSend={handleSendPrompt}
          />
        </div>

        {/* Floating Quick Action Pill */}
        <AiFloatingToolbar
          theme={theme}
          onAction={(id) => {
            if (showToast) showToast(`Quick action "${id}" triggered!`);
          }}
        />

        {/* AI Reasoning / Thought Trace */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Live Reasoning Trace Component
            </span>
            <button
              type="button"
              onClick={() => handleCopyCmd('ai-reasoning-trace')}
              className={`flex items-center gap-1 text-[11px] font-mono cursor-pointer border-0 bg-transparent transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {copiedCli === 'ai-reasoning-trace' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>Copy CLI</span>
            </button>
          </div>
          <AiReasoningTrace
            theme={theme}
            isStreaming={isSimulatingStream}
            durationSeconds={3.4}
          />
        </div>

        {/* AI Response Stream with Micro-Action Toolbar */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Response Stream &amp; Action Toolbar
            </span>
            <button
              type="button"
              onClick={() => handleCopyCmd('ai-response-stream')}
              className={`flex items-center gap-1 text-[11px] font-mono cursor-pointer border-0 bg-transparent transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {copiedCli === 'ai-response-stream' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>Copy CLI</span>
            </button>
          </div>
          <AiResponseStream theme={theme} />
        </div>

        {/* Installation Cards Grid */}
        <div className="pt-8">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-4 px-1">
            CLI Installation Commands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Card 1: Ai Prompt Input */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? 'bg-[#141416] border-white/10' : 'bg-white border-neutral-200'
            }`}>
              <div>
                <h3 className="text-sm font-semibold">AI Prompt Studio</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Model switcher, voice dictation, and morphing send button.</p>
              </div>
              <div className={`flex items-center justify-between p-2 pl-3 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-black/60 border-white/5' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <code className="truncate">{formatCliCommand('ai-prompt-input', registryMode)}</code>
                <button
                  type="button"
                  onClick={() => handleCopyCmd('ai-prompt-input')}
                  className="p-1 rounded cursor-pointer border-0 bg-white/10 hover:bg-white/20 transition-colors text-inherit shrink-0"
                >
                  {copiedCli === 'ai-prompt-input' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Card 2: AI Reasoning Trace */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? 'bg-[#141416] border-white/10' : 'bg-white border-neutral-200'
            }`}>
              <div>
                <h3 className="text-sm font-semibold">AI Reasoning Trace</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Collapsible thought trace with stopwatch and status nodes.</p>
              </div>
              <div className={`flex items-center justify-between p-2 pl-3 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-black/60 border-white/5' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <code className="truncate">{formatCliCommand('ai-reasoning-trace', registryMode)}</code>
                <button
                  type="button"
                  onClick={() => handleCopyCmd('ai-reasoning-trace')}
                  className="p-1 rounded cursor-pointer border-0 bg-white/10 hover:bg-white/20 transition-colors text-inherit shrink-0"
                >
                  {copiedCli === 'ai-reasoning-trace' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Card 3: AI Response Stream */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? 'bg-[#141416] border-white/10' : 'bg-white border-neutral-200'
            }`}>
              <div>
                <h3 className="text-sm font-semibold">AI Response Stream</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Syntax-highlighted code with branch switcher and feedback thumbs.</p>
              </div>
              <div className={`flex items-center justify-between p-2 pl-3 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-black/60 border-white/5' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <code className="truncate">{formatCliCommand('ai-response-stream', registryMode)}</code>
                <button
                  type="button"
                  onClick={() => handleCopyCmd('ai-response-stream')}
                  className="p-1 rounded cursor-pointer border-0 bg-white/10 hover:bg-white/20 transition-colors text-inherit shrink-0"
                >
                  {copiedCli === 'ai-response-stream' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Card 4: AI Floating Toolbar */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? 'bg-[#141416] border-white/10' : 'bg-white border-neutral-200'
            }`}>
              <div>
                <h3 className="text-sm font-semibold">AI Floating Quick Toolbar</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Glassmorphic island dock for instant AI prompts.</p>
              </div>
              <div className={`flex items-center justify-between p-2 pl-3 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-black/60 border-white/5' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <code className="truncate">{formatCliCommand('ai-floating-toolbar', registryMode)}</code>
                <button
                  type="button"
                  onClick={() => handleCopyCmd('ai-floating-toolbar')}
                  className="p-1 rounded cursor-pointer border-0 bg-white/10 hover:bg-white/20 transition-colors text-inherit shrink-0"
                >
                  {copiedCli === 'ai-floating-toolbar' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

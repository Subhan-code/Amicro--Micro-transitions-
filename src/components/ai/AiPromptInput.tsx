import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUp, 
  Square, 
  Mic, 
  Paperclip, 
  Globe, 
  Brain, 
  Sparkles, 
  ChevronDown, 
  Check, 
  X,
  Volume2
} from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

export interface AiPromptInputProps {
  theme?: 'dark' | 'light';
  onSend?: (prompt: string, model: string, options: { search: boolean; deepThink: boolean }) => void;
  className?: string;
  initialValue?: string;
}

const AI_MODELS = [
  { id: 'claude-3-7', name: 'Claude 3.7 Sonnet', badge: 'Fast Reasoning', icon: '🧠' },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Omni Multimodal', icon: '⚡' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', badge: 'Open Math/Code', icon: '🔷' },
  { id: 'gemini-2-5', name: 'Gemini 2.5 Flash', badge: 'Ultra Low Latency', icon: '✨' },
];

const SUGGESTIONS = [
  "Create a spring physics card with subtle 3D tilt",
  "Add particle burst micro-interaction on button click",
  "Design a fluid floating dock with magnetic icon pull",
  "Generate an AI streaming text input with haptic feedback",
];

export function AiPromptInput({
  theme = 'dark',
  onSend,
  className = '',
  initialValue = '',
}: AiPromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [isDeepThinkActive, setIsDeepThinkActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  // Sync external initialValue if changed
  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
    }
  }, [initialValue]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  const handleToggleSearch = () => {
    triggerHaptic('light');
    setIsWebSearchActive(prev => !prev);
  };

  const handleToggleDeepThink = () => {
    triggerHaptic('light');
    setIsDeepThinkActive(prev => !prev);
  };

  const handleToggleRecord = () => {
    triggerHaptic('medium');
    setIsRecording(prev => !prev);
    if (!isRecording) {
      // simulate speech-to-text
      setTimeout(() => {
        setPrompt(prev => prev + (prev ? " " : "") + "Add haptic spring physics to card carousel");
        setIsRecording(false);
        triggerHaptic('success');
      }, 2500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      triggerHaptic('light');
      const names = Array.from(files).map((f: File) => f.name);
      setAttachedFiles(prev => [...prev, ...names]);
    }
  };

  const removeFile = (index: number) => {
    triggerHaptic('light');
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isGenerating) {
      // Stop generating
      triggerHaptic('medium');
      setIsGenerating(false);
      return;
    }

    if (!prompt.trim() && attachedFiles.length === 0) return;

    triggerHaptic('success');
    setIsGenerating(true);

    if (onSend) {
      onSend(prompt, selectedModel.id, {
        search: isWebSearchActive,
        deepThink: isDeepThinkActive,
      });
    }

    // Simulate completion
    setTimeout(() => {
      setIsGenerating(false);
    }, 3500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const tokenEstimate = Math.ceil((prompt.length || 0) / 3.8);

  return (
    <div className={`relative w-full max-w-[800px] mx-auto select-none ${className}`}>
      
      {/* Subtle border highlight on focus */}
      <div 
        aria-hidden="true" 
        className={`absolute -inset-0.5 rounded-[26px] border border-white/20 transition-opacity duration-200 pointer-events-none ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main Container Card */}
      <div 
        className={`relative w-full rounded-[24px] border p-3 sm:p-4 transition-all duration-200 flex flex-col gap-2.5 shadow-lg ${
          isDark 
            ? 'bg-[#141417]/95 border-white/[0.1] text-white shadow-black/50' 
            : 'bg-white/95 border-neutral-200/90 text-black shadow-neutral-200/60'
        }`}
      >
        {/* Attached Files List */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 px-1 pt-1"
            >
              {attachedFiles.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                    isDark ? 'bg-white/[0.06] border-white/10 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <Paperclip className="w-3 h-3 text-neutral-400" />
                  <span className="truncate max-w-[120px] font-mono">{file}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-0.5 rounded-full hover:bg-white/10 cursor-pointer border-0 bg-transparent text-neutral-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea Input Row */}
        <div className="relative w-full min-h-[44px] flex items-start">
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isRecording ? "Listening to audio..." : "Ask Amicro to generate spring micro-interactions or components..."}
            className={`w-full bg-transparent border-0 outline-none resize-none text-[14px] sm:text-[15px] leading-[22px] sm:leading-[24px] tracking-[-0.01em] placeholder:text-neutral-500 font-sans p-1 focus:ring-0 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          />
        </div>

        {/* Audio Recording Active Waveform */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-2 py-1 text-xs text-rose-500 font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Recording Voice Dictation...</span>
              <div className="flex items-center gap-0.5 h-3 ml-2">
                {[40, 80, 50, 100, 60, 90, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', `${h}%`, '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
                    className="w-1 bg-rose-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
          
          {/* Left Action Buttons: Model Selector & Capabilities */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            {/* Model Selector Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setModelDropdownOpen(prev => !prev);
                }}
                className={`flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                  isDark 
                    ? 'bg-white/[0.06] border-white/[0.08] hover:bg-white/[0.12] text-neutral-300' 
                    : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <span>{selectedModel.icon}</span>
                <span className="font-semibold">{selectedModel.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute bottom-full left-0 mb-2 w-56 rounded-2xl border p-1.5 shadow-xl z-50 flex flex-col gap-1 ${
                      isDark 
                        ? 'bg-[#18181c] border-white/10 text-white' 
                        : 'bg-white border-neutral-200 text-black shadow-lg'
                    }`}
                  >
                    <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Select LLM
                    </div>
                    {AI_MODELS.map(m => {
                      const isSel = selectedModel.id === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedModel(m);
                            setModelDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs text-left cursor-pointer transition-colors border-0 ${
                            isSel 
                              ? isDark ? 'bg-white/10 font-semibold' : 'bg-neutral-100 font-semibold'
                              : 'hover:bg-white/[0.06] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{m.icon}</span>
                            <div className="flex flex-col">
                              <span>{m.name}</span>
                              <span className="text-[10px] text-neutral-500">{m.badge}</span>
                            </div>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Deep Think / Reasoning Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleDeepThink}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                isDeepThinkActive
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-400 font-semibold'
                  : isDark
                  ? 'bg-transparent border-white/[0.08] hover:bg-white/[0.06] text-neutral-400'
                  : 'bg-transparent border-neutral-200 hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Deep Thinking & Reasoning traces"
            >
              <Brain className={`w-3.5 h-3.5 ${isDeepThinkActive ? 'text-purple-400' : ''}`} />
              <span className="hidden sm:inline">Reason</span>
            </motion.button>

            {/* Web Search Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleSearch}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                isWebSearchActive
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 font-semibold'
                  : isDark
                  ? 'bg-transparent border-white/[0.08] hover:bg-white/[0.06] text-neutral-400'
                  : 'bg-transparent border-neutral-200 hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Live Web Search synthesis"
            >
              <Globe className={`w-3.5 h-3.5 ${isWebSearchActive ? 'text-blue-400' : ''}`} />
              <span className="hidden sm:inline">Search</span>
            </motion.button>

            {/* Attach File Button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                triggerHaptic('light');
                fileInputRef.current?.click();
              }}
              className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border transition-colors ${
                isDark 
                  ? 'border-white/[0.08] hover:bg-white/[0.08] text-neutral-400 hover:text-white' 
                  : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Attach code snippet or image"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </motion.button>

            {/* Voice Dictation Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleRecord}
              className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border transition-colors ${
                isRecording 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                  : isDark
                  ? 'border-white/[0.08] hover:bg-white/[0.08] text-neutral-400 hover:text-white'
                  : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Voice dictation"
            >
              <Mic className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Right Action Buttons: Token Counter & Send/Stop Morph */}
          <div className="flex items-center gap-2 ml-auto">
            {prompt.length > 0 && (
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                ~{tokenEstimate} toks
              </span>
            )}

            {/* Submit / Stop Morphing Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSubmit}
              disabled={!prompt.trim() && attachedFiles.length === 0 && !isGenerating}
              className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 border-0 ${
                isGenerating
                  ? 'bg-rose-600 text-white shadow-md'
                  : prompt.trim() || attachedFiles.length > 0
                  ? isDark
                    ? 'bg-white text-black hover:bg-neutral-200 shadow-md'
                    : 'bg-black text-white hover:bg-neutral-800 shadow-md'
                  : isDark
                  ? 'bg-white/10 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
              title={isGenerating ? "Stop generating" : "Submit prompt"}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="stop-icon"
                    initial={{ rotate: -90, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="send-icon"
                    initial={{ rotate: -90, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

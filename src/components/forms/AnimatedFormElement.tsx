import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormElementConfig } from '../../data/formElements';
import { Eye, EyeOff, Search, Check, Upload, ChevronDown, X, Loader2 } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

interface AnimatedFormElementProps {
  config: FormElementConfig;
  theme: 'dark' | 'light';
}

export const AnimatedFormElement: React.FC<AnimatedFormElementProps> = ({ config, theme }) => {
  const [val, setVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [radioSelected, setRadioSelected] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('React');
  const [chips, setChips] = useState(['Next.js', 'Tailwind', 'Motion']);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sliderVal, setSliderVal] = useState(65);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const { trigger: triggerHaptic } = useWebHaptics();

  const isDark = theme === 'dark';

  const triggerErrorShake = () => {
    triggerHaptic('error');
    setHasError(true);
    setShakeKey(prev => prev + 1);
    setTimeout(() => setHasError(false), 800);
  };

  const handleFormSubmit = () => {
    triggerHaptic('medium');
    setSubmitState('loading');
    setTimeout(() => {
      setSubmitState('success');
      triggerHaptic('success');
      setTimeout(() => setSubmitState('idle'), 2000);
    }, 1200);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden select-none">
      {(() => {
        switch (config.interactionType) {
          case 'floating-label-input':
            return (
              <div className="relative w-full max-w-[240px]">
                <motion.label
                  animate={{
                    y: isFocused || val ? -24 : 0,
                    scale: isFocused || val ? 0.85 : 1,
                    color: isFocused ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#9ca3af' : '#6b7280'),
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute left-3 top-2.5 origin-left pointer-events-none text-sm font-medium"
                >
                  Email Address
                </motion.label>
                <input
                  type="text"
                  value={val}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setVal(e.target.value)}
                  className={`w-full px-3 py-2 pt-3 rounded-xl border text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500' 
                      : 'bg-white border-neutral-300 text-black focus:border-blue-600'
                  }`}
                />
              </div>
            );

          case 'input-focus-glow':
            return (
              <div className="relative w-full max-w-[240px]">
                <input
                  type="text"
                  placeholder="Focus for glow..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-300 ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-700 text-white focus:border-indigo-500'
                      : 'bg-white border-neutral-300 text-black focus:border-indigo-500'
                  } ${isFocused ? 'ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/20' : ''}`}
                />
              </div>
            );

          case 'password-toggle':
            return (
              <div className="relative w-full max-w-[240px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="secretpass123"
                  className={`w-full pl-3 pr-10 py-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-200 cursor-pointer border-0 bg-transparent"
                >
                  <motion.div animate={{ scale: showPassword ? 1.1 : 1, rotate: showPassword ? 0 : -10 }}>
                    {showPassword ? <Eye className="w-4 h-4 text-indigo-400" /> : <EyeOff className="w-4 h-4" />}
                  </motion.div>
                </button>
              </div>
            );

          case 'search-expand':
            return (
              <motion.div
                animate={{ width: isFocused ? 240 : 160 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={`relative flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
                }`}
              >
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search components..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full text-xs bg-transparent border-0 outline-none"
                />
              </motion.div>
            );

          case 'checkbox-draw':
            return (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsChecked(!isChecked);
                }}
                className="flex items-center gap-3 cursor-pointer border-0 bg-transparent"
              >
                <motion.div
                  animate={{ scale: isChecked ? [1, 1.15, 1] : 1 }}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isDark ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isChecked && (
                    <motion.svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.svg>
                  )}
                </motion.div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>Accept terms</span>
              </button>
            );

          case 'radio-scale':
            return (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setRadioSelected(!radioSelected);
                }}
                className="flex items-center gap-3 cursor-pointer border-0 bg-transparent"
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  radioSelected
                    ? 'border-indigo-500'
                    : isDark ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-300 bg-white'
                }`}>
                  {radioSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="w-3.5 h-3.5 rounded-full bg-indigo-500"
                    />
                  )}
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>Option selected</span>
              </button>
            );

          case 'error-shake':
            return (
              <div className="flex flex-col items-center gap-2 w-full max-w-[220px]">
                <motion.input
                  key={shakeKey}
                  animate={hasError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  type="text"
                  placeholder="Click button to test error"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    hasError
                      ? 'border-red-500 text-red-500 bg-red-500/10'
                      : isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={triggerErrorShake}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer border-0"
                >
                  Trigger Error Shake
                </button>
              </div>
            );

          case 'success-check':
            return (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('success');
                  setIsSuccess(!isSuccess);
                }}
                className={`relative px-4 py-2.5 rounded-2xl border flex items-center gap-2 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : isDark ? 'bg-neutral-800 text-neutral-300 border-white/10' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}
              >
                <span>{isSuccess ? 'Verified' : 'Click to Verify'}</span>
                <AnimatePresence>
                  {isSuccess && (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-4 h-4 text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
            );

          case 'select-dropdown':
            return (
              <div className="relative w-full max-w-[200px]">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectOpen(!selectOpen);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer ${
                    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
                  }`}
                >
                  <span>{selectedOption}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {selectOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 4 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      className={`absolute left-0 right-0 z-30 p-1 rounded-xl border shadow-xl flex flex-col gap-0.5 ${
                        isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-black'
                      }`}
                    >
                      {['React', 'Vue', 'Svelte', 'Solid'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedOption(opt);
                            setSelectOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0 ${
                            selectedOption === opt
                              ? (isDark ? 'bg-white/10 text-white' : 'bg-neutral-100 text-black')
                              : (isDark ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-neutral-50 text-neutral-600')
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );

          case 'multi-select-chips':
            return (
              <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                <AnimatePresence>
                  {chips.map((chip) => (
                    <motion.span
                      key={chip}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {chip}
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setChips(chips.filter(c => c !== chip));
                        }}
                        className="hover:opacity-75 cursor-pointer border-0 bg-transparent p-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            );

          case 'textarea-auto-grow':
            return (
              <div className="w-full max-w-[240px]">
                <textarea
                  rows={2}
                  placeholder="Type to test auto-grow..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none transition-all ${
                    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
                  }`}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>
            );

          case 'otp-input':
            return (
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <motion.input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otp[idx]}
                    whileFocus={{ scale: 1.1 }}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && idx < 3) {
                        const next = document.getElementById(`otp-${idx + 1}`);
                        next?.focus();
                      }
                    }}
                    className={`w-10 h-12 text-center text-lg font-bold rounded-xl border outline-none ${
                      isDark ? 'bg-neutral-900 border-neutral-700 text-white focus:border-indigo-500' : 'bg-white border-neutral-300 text-black focus:border-indigo-500'
                    }`}
                  />
                ))}
              </div>
            );

          case 'file-upload-dropzone':
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`w-full max-w-[240px] p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  isDark ? 'border-neutral-700 hover:border-indigo-500 bg-neutral-900/50' : 'border-neutral-300 hover:border-indigo-500 bg-neutral-50'
                }`}
              >
                <Upload className="w-6 h-6 text-indigo-500 animate-bounce" />
                <span className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Drop files here</span>
                <span className="text-[10px] text-neutral-400">SVG, PNG, JPG (max 5MB)</span>
              </motion.div>
            );

          case 'range-slider':
            return (
              <div className="relative w-full max-w-[220px] flex flex-col items-center">
                <div className="absolute -top-7 px-2 py-0.5 rounded-lg bg-indigo-500 text-white text-[11px] font-bold shadow-md">
                  {sliderVal}%
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            );

          case 'form-submit-button':
            return (
              <button
                type="button"
                onClick={handleFormSubmit}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg ${
                  submitState === 'success'
                    ? 'bg-emerald-500 text-white'
                    : submitState === 'loading'
                    ? 'bg-neutral-700 text-neutral-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {submitState === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : submitState === 'success' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Submitted!</span>
                  </>
                ) : (
                  <span>Submit Form</span>
                )}
              </button>
            );

          default:
            return null;
        }
      })()}
    </div>
  );
};

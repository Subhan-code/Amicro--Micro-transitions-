import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ChevronDown, ArrowLeft } from 'lucide-react';

interface CliPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
}

export function CliPage({ theme, onNavigateHome }: CliPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      q: "Does Amicro require complex configuration?",
      a: "No! Amicro is designed to be plug-and-play. It works seamlessly with Vite, Next.js, and standard React configurations. The CLI sets up paths automatically so components compile cleanly."
    },
    {
      q: "How does this benefit my bundle size?",
      a: "Amicro CLI downloads the raw TSX component code directly into your project. If you only use one component, your build bundle size only includes that single component's code—zero library wrapper overhead."
    },
    {
      q: "Can I customize the animations after CLI installation?",
      a: "Yes! Since the raw source code of the component is written straight into your workspace, you have full ownership. You can easily adjust framer-motion settings, colors, and tailwind classes."
    },
    {
      q: "Does it support React Server Components (RSC)?",
      a: "Yes. The CLI adds the \"use client\" directive at the top of motion components where interactivity is required, making them fully compatible with server-rendered React frameworks."
    }
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`w-full min-h-dvh transition-colors duration-300 pb-20 ${isDark ? 'bg-[#121212] text-white' : 'bg-[#f8f9fa] text-black'}`}>
      
      {/* Mini Breadcrumb Navbar */}
      <div className="w-full max-w-[1240px] mx-auto px-6 pt-6">
        <button 
          onClick={onNavigateHome}
          className={`flex items-center gap-2 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Components
        </button>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-[1240px] mx-auto px-6 pt-12 pb-16 text-center flex flex-col items-center">
        <h1 className={`text-[36px] sm:text-[54px] font-bold leading-[1.1] tracking-tight max-w-[850px] mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          Amicro CLI
        </h1>

        <p className={`text-[16px] sm:text-[18px] leading-[26px] max-w-[620px] mb-10 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Add beautiful micro-interactions and seamless transitions to your React website with a single CLI command. Open source and zero runtime configuration needed.
        </p>

        {/* Hero Code Snippet */}
        <div className={`relative flex items-center justify-between gap-4 p-4 pl-5 rounded-2xl border w-full max-w-[480px] shadow-sm mb-8 ${
          isDark 
            ? 'bg-[#181818] border-neutral-800 text-white' 
            : 'bg-white border-neutral-200 text-black'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>$</span>
            <code className="text-[14px] font-mono select-all truncate font-medium">npx @subhanhq/amicro@latest add</code>
          </div>
          <button 
            onClick={() => copyToClipboard('npx @subhanhq/amicro@latest add', 'hero-cli')}
            className={`p-2 rounded-lg cursor-pointer shrink-0 transition-colors border-0 ${
              isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
            aria-label="Copy installation command"
          >
            {copiedText === 'hero-cli' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="w-full max-w-[700px] mx-auto px-6 py-12">
        <h2 className="text-[24px] font-bold tracking-tight mb-8">Installation</h2>
        
        <div className="flex flex-col gap-8">
          {/* Step 1 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold">1. Initialize Amicro Configuration</h3>
            <p className={`text-[14px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Run the initialization command to detect your workspace setup and install peer dependencies (`motion/react` and `lucide-react`).
            </p>
            <div className={`relative flex items-center justify-between gap-4 p-4 pl-5 rounded-xl border font-mono ${
              isDark ? 'bg-[#181818] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-black'
            }`}>
              <code className="text-[13.5px] font-mono">npx @subhanhq/amicro@latest init</code>
              <button 
                onClick={() => copyToClipboard('npx @subhanhq/amicro@latest init', 'init-cli')}
                className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                  isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-350' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-650'
                }`}
              >
                {copiedText === 'init-cli' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold">2. Add Component</h3>
            <p className={`text-[14px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Install any button component directly into your local codebase. The TSX code is written directly to your configuration folder (default `src/components/ui/`).
            </p>
            <div className={`relative flex items-center justify-between gap-4 p-4 pl-5 rounded-xl border font-mono ${
              isDark ? 'bg-[#181818] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-black'
            }`}>
              <code className="text-[13.5px] font-mono">npx @subhanhq/amicro@latest add download-button</code>
              <button 
                onClick={() => copyToClipboard('npx @subhanhq/amicro@latest add download-button', 'add-cli')}
                className={`p-1.5 rounded-lg cursor-pointer border-0 transition-colors ${
                  isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-350' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-650'
                }`}
              >
                {copiedText === 'add-cli' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-[700px] mx-auto px-6 py-12">
        <h2 className="text-[24px] font-bold tracking-tight mb-8">FAQ</h2>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`rounded-xl border overflow-hidden transition-colors ${
                isDark ? 'border-neutral-800 bg-[#181818]' : 'border-neutral-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className={`w-full flex items-center justify-between p-5 font-semibold text-left cursor-pointer transition-colors border-0 bg-transparent ${
                  isDark ? 'hover:bg-neutral-800/40 text-white' : 'hover:bg-neutral-50 text-black'
                }`}
                aria-expanded={faqOpen[idx] || false}
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
                  faqOpen[idx] ? 'rotate-180' : ''
                }`} />
              </button>

              <AnimatePresence initial={false}>
                {faqOpen[idx] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className={`p-5 pt-0 text-[13.5px] leading-[22px] border-t ${
                      isDark ? 'border-neutral-800/60 text-neutral-400' : 'border-neutral-100 text-neutral-600'
                    }`}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="w-full max-w-[700px] mx-auto px-6 py-8">
        <div className={`relative rounded-3xl p-8 text-center flex flex-col items-center border ${
          isDark 
            ? 'bg-[#181818] border-neutral-800' 
            : 'bg-white border-neutral-200'
        }`}>
          <h2 className="text-[20px] font-bold tracking-tight mb-2">Ready to explore transitions?</h2>
          <p className={`text-[14px] mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Explore our collection of production-ready components.
          </p>

          <button
            onClick={onNavigateHome}
            className={`inline-flex items-center justify-center h-[40px] px-6 rounded-full text-[13px] font-semibold cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] border-0 ${
              isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            Explore Components
          </button>
        </div>
      </section>

    </div>
  );
}

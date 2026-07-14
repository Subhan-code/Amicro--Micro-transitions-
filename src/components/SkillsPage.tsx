import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ArrowLeft, Terminal, Cpu, Code, ShieldCheck } from 'lucide-react';

interface SkillsPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
}

export function SkillsPage({ theme, onNavigateHome }: SkillsPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'install' | 'commands'>('install');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  const isDark = theme === 'dark';

  const installCards = [
    {
      id: 'main-skill',
      title: 'Main Skill Installation',
      command: 'npx skills add Jakubantalik/transitions.dev',
      description: 'Installs the transitions.dev library context (21+ transitions) for Claude Code, Cursor, Copilot, and Gemini CLI.',
      badge: 'Main Setup'
    },
    {
      id: 'polish-skill',
      title: 'Polish Skill Add-on',
      command: 'npx skills add Jakubantalik/transitions.dev -s transitions-polish',
      description: 'Aligns motion you already have to the transitions.dev token scale. Works alongside the main skill.',
      badge: 'Add-on'
    },
    {
      id: 'prompt-dropdown',
      title: 'Dropdowns Prompt',
      command: 'Update dropdowns transition based on transitions-dev skill',
      description: 'Ask your agent to apply custom transitions.dev styles to all dropdown components.',
      badge: 'AI Prompt'
    },
    {
      id: 'prompt-icon',
      title: 'Icon Swaps Prompt',
      command: 'Update all icon swap transitions based on transitions-dev skill',
      description: 'Ask your agent to apply custom transitions.dev styles to all icon swaps.',
      badge: 'AI Prompt'
    },
    {
      id: 'prompt-modal',
      title: 'Modals Prompt',
      command: 'Update all modals transitions based on transitions-dev skill',
      description: 'Ask your agent to apply custom transitions.dev styles to all modal wrappers.',
      badge: 'AI Prompt'
    }
  ];

  const commandCards = [
    {
      id: 'cmd-reveal',
      title: 'transitions reveal',
      command: 'transitions reveal',
      description: 'List every transition in the skill as a numbered text list. Triggers on "list all transitions".',
      badge: 'Read catalog'
    },
    {
      id: 'cmd-review',
      title: 'transitions review',
      command: 'transitions review',
      description: 'Scan project for custom keyframes and report where transitions would slot. Read-only.',
      badge: 'Animation Audit'
    },
    {
      id: 'cmd-apply',
      title: 'transitions apply',
      command: 'transitions apply',
      description: 'Auto-detect best transition for cursor context and install after confirmation.',
      badge: 'Auto install'
    },
    {
      id: 'cmd-refine',
      title: 'transitions refine',
      command: 'transitions refine',
      description: 'Audit project and propose matching motion tokens instead of raw numbers. Read-only.',
      badge: 'Token check'
    },
    {
      id: 'cmd-polish',
      title: 'transitions polish',
      command: 'transitions polish',
      description: 'Align stagger, delay, distances, open/close states to tokens. Read-only.',
      badge: 'Fine tune'
    }
  ];

  return (
    <div className={`relative w-full min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${isDark ? 'bg-[#121212] text-[#ffffff] selection:bg-neutral-850' : 'bg-[#f8f9fa] text-black selection:bg-neutral-200'}`}>
      
      {/* Breadcrumb Navbar */}
      <div className="w-full max-w-[1240px] mx-auto px-6 pt-6">
        <button 
          onClick={onNavigateHome}
          className={`flex items-center gap-2 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Components
        </button>
      </div>

      <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center">
        
        {/* Centered Hero matching Home */}
        <div className="mt-12 mb-12 text-center w-full flex flex-col items-center">
          
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium mb-6 border ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'
          }`}>
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span>Transitions.dev Skill</span>
          </div>

          <h1 className={`text-[42px] sm:text-[62px] font-bold leading-[1.1] tracking-tight mb-4 font-sans transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
            Skills
          </h1>
          
          <p className={`text-[16px] sm:text-[18px] leading-[26px] max-w-[550px] transition-colors duration-300 ${isDark ? 'text-[#a3a3a3]' : 'text-neutral-600'}`}>
            Transitions skill teaches your AI about product motion and includes all the transitions from the main page and useful commands for your agent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full max-w-[340px] sm:max-w-none">
            <button 
              onClick={() => {
                const element = document.getElementById('skills-grid-anchor');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`inline-flex items-center justify-center h-[44px] w-full sm:w-auto px-[26px] rounded-full text-[13.5px] font-semibold cursor-pointer border-0 ${isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
            >
              Get started
            </button>
            <a 
              href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center h-[44px] w-full sm:w-auto px-[26px] rounded-full text-[13.5px] font-semibold border cursor-pointer no-underline transition-colors ${isDark ? 'bg-[#181818] border-neutral-800 text-white hover:bg-neutral-850' : 'bg-white border-neutral-200 text-black hover:bg-neutral-50 shadow-sm'}`}
            >
              View on GitHub
            </a>
          </div>

          {/* Pill Switch Controls matching Home Layout Pill */}
          <div id="skills-grid-anchor" className="flex items-center gap-3 mt-14 scroll-mt-24">
            <div className={`flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${isDark ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
              <button
                onClick={() => setActiveTab('install')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 ${
                  activeTab === 'install' 
                    ? (isDark ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                    : `${isDark ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                }`}
              >
                Installation & Prompts
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 ${
                  activeTab === 'commands' 
                    ? (isDark ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                    : `${isDark ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                }`}
              >
                Command Catalog
              </button>
            </div>
          </div>

        </div>

        {/* Display Grid matching Components Grid layout */}
        <div className="w-full flex justify-center gap-[24px] mb-20 flex-wrap">
          <AnimatePresence mode="wait">
            {(activeTab === 'install' ? installCards : commandCards).map((card) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className={`relative w-full max-w-[320px] sm:w-[320px] h-[268px] rounded-[24px] transition-all duration-300 group ${isDark ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}
              >
                {/* Visual code box area */}
                <div className={`absolute left-[12px] top-[12px] right-[12px] h-[188px] rounded-[14px] overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
                  <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${isDark ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'}`} />
                  <code className={`text-[12px] font-mono select-all leading-[1.6] text-center break-words max-w-full ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                    {card.command}
                  </code>
                </div>

                {/* Card labels */}
                <div className="absolute left-[20px] bottom-[14px] w-[calc(100%-80px)] flex flex-col gap-[2px]">
                  <div className={`text-[13px] font-semibold leading-[18px] transition-colors truncate ${isDark ? 'text-[#ededed]' : 'text-black'}`}>
                    {card.title}
                  </div>
                  <div className={`text-[11px] font-normal leading-[13px] transition-colors line-clamp-1 ${isDark ? 'text-[#767676]' : 'text-black opacity-70'}`}>
                    {card.description}
                  </div>
                </div>

                {/* Copy action button at bottom-right */}
                <button 
                  onClick={() => copyToClipboard(card.command, card.id)}
                  type="button" 
                  className={`absolute right-[20px] bottom-[12px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 ${isDark ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]' : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'}`} 
                  aria-label="Copy code block"
                >
                  {copiedText === card.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                  )}
                </button>

                {/* Top floating indicator badge */}
                <span className={`absolute top-4 right-4 z-20 text-[10px] font-mono px-2 py-0.5 rounded-full ${isDark ? 'bg-[#181818] text-neutral-400 border border-white/5' : 'bg-white text-neutral-600 border border-neutral-200'}`}>
                  {card.badge}
                </span>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      <footer className="relative z-10 w-full text-center pb-[24px] text-[13px] leading-[14px]">
        <span className={isDark ? 'text-[#8f8f8f]' : 'text-black opacity-60'}>Created by</span>
        <a className={`no-underline ml-[4px] font-medium transition-colors ${isDark ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://x.com/SubhanHQ" target="_blank" rel="noopener noreferrer">Syed Subhan</a>
        <span className={`mx-1 ${isDark ? 'text-[#8f8f8f]' : 'text-black opacity-60'}`}>·</span>
        <a className={`no-underline transition-colors ${isDark ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://github.com/Subhan-code/Amicro--Micro-transitions-#readme">Terms & License</a>
      </footer>

    </div>
  );
}

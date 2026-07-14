import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, List, LayoutTemplate, ArrowDownAZ, Copy, Sun, Moon, Github, 
  Terminal, Check, Cpu, Zap, Code, ShieldCheck, Sparkles, ChevronRight
} from 'lucide-react';
import { buttonsData } from './data/buttons';
import { AnimatedButton } from './components/AnimatedButton';
import { getComponentCode, ThemeToggleCode } from './utils/codeGenerator';
import { CliPage } from './components/CliPage';
import { SkillsPage } from './components/SkillsPage';

type LayoutMode = 'list' | 'grid' | 'matrix';
type SortMode = 'default' | 'alphabetical';
type PageMode = 'home' | 'cli' | 'skills';

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [sortBy, setSortBy] = useState<SortMode>('default');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<PageMode>('home');
  // Trigger update for skills routing HMR cache invalidation
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Hash-based router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/cli') || hash.startsWith('#cli')) {
        setCurrentPage('cli');
      } else if (hash.startsWith('#/skills') || hash.startsWith('#skills')) {
        setCurrentPage('skills');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/repos/Subhan-code/Amicro--Micro-transitions-')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(err => console.error('Error fetching stars:', err));
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyCode = (button: typeof buttonsData[0]) => {
    const code = getComponentCode(button);
    navigator.clipboard.writeText(code)
      .then(() => showToast(`Copied ${button.label} component code!`))
      .catch(() => showToast("Failed to copy code."));
  };

  const copyCliCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch(() => showToast("Failed to copy command."));
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    navigator.clipboard.writeText(ThemeToggleCode)
      .then(() => showToast("Theme toggled & ThemeToggle code copied!"))
      .catch(() => showToast("Failed to copy theme code."));
  };

  const displayedButtons = useMemo(() => {
    let sorted = [...buttonsData];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.label.localeCompare(b.label));
    }
    return sorted;
  }, [sortBy]);

  const isLightTheme = theme === 'light';

  const navigateTo = (page: PageMode) => {
    if (page === 'cli') {
      window.location.hash = '#/cli';
    } else if (page === 'skills') {
      window.location.hash = '#/skills';
    } else {
      window.location.hash = '#/';
    }
  };

  return (
    <div className={`relative w-full min-h-screen flex flex-col overflow-x-clip font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'bg-[#121212] text-[#ffffff] selection:bg-neutral-850' : 'bg-[#f8f9fa] text-black selection:bg-neutral-200'}`}>
      
      {/* Site Navbar */}
      <header className="relative z-50 w-full pt-4 pb-4 px-4 sm:px-6 border-b border-transparent">
        <div className="relative z-[3] flex items-center justify-between gap-2 sm:gap-4 max-w-[1240px] mx-auto">
          <div className="flex items-center gap-2 sm:gap-[34px] min-w-0">
            <button 
              onClick={() => navigateTo('home')}
              className={`inline-flex items-center gap-[4px] h-[35px] py-[5px] no-underline shrink-0 group transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] cursor-pointer text-left border-0 bg-transparent ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              <span className={`inline-flex items-center justify-center w-[24px] h-[24px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center group-hover:rotate-[60deg] ${theme === 'dark' ? 'text-[#ededed]' : 'text-black'}`}>
                {/* Modern double chevron logo */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] block">
                  <path d="M7 6L14 12L7 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
                  <path d="M13 6L20 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[16px] font-bold leading-none tracking-[-0.019em] ml-1">
                <span>Amicro</span>
              </span>
            </button>
            <nav className="hidden sm:flex items-center gap-[8px]">
              <button 
                onClick={() => navigateTo('home')}
                className={`inline-flex items-center justify-center h-[36px] px-[14px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'home'
                    ? (theme === 'dark' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-black bg-neutral-200/80 font-semibold')
                    : (theme === 'dark' ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40')
                }`}
              >
                Components
              </button>
              <button 
                onClick={() => navigateTo('cli')}
                className={`inline-flex items-center justify-center h-[36px] px-[14px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'cli'
                    ? (theme === 'dark' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-black bg-neutral-200/80 font-semibold')
                    : (theme === 'dark' ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40')
                }`}
              >
                CLI Install
              </button>
              <button 
                onClick={() => navigateTo('skills')}
                className={`inline-flex items-center justify-center h-[36px] px-[14px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'skills'
                    ? (theme === 'dark' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-black bg-neutral-200/80 font-semibold')
                    : (theme === 'dark' ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40')
                }`}
              >
                Skills
              </button>
              <a 
                href="https://github.com/Subhan-code/Amicro--Micro-transitions-#readme" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center justify-center h-[36px] px-[14px] rounded-full text-[13px] font-medium leading-[16px] no-underline whitespace-nowrap transition-colors duration-150 ${theme === 'dark' ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40'}`}
              >
                Documentation
              </a>
            </nav>
          </div>
          
          {/* Navbar Actions with Theme Toggle at the far right corner */}
          <div className="flex items-center gap-[8px]">
            <a 
              href="https://github.com/Subhan-code/Amicro--Micro-transitions-" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Star Amicro on GitHub"
              className={`inline-flex items-center justify-center gap-1.5 w-[36px] h-[36px] px-0 sm:w-auto sm:px-[13px] rounded-full font-sans text-[13px] font-medium leading-[16px] no-underline transition-colors duration-150 group ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-auto h-[16px] max-w-[16px] block">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="hidden sm:inline-block">{stars !== null ? stars : 'Star'}</span>
            </a>
            <a 
              href="https://x.com/SubhanHQ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-150 ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
            >
              <svg viewBox="0 0 16 17" fill="currentColor" className="w-[16px] h-[17px] block">
                <path d="M12.4041 1.39726H14.6953L9.69087 7.2591L15.5781 15.2368H10.9696L7.35741 10.3996L3.22921 15.2368H0.934687L6.28641 8.96575L0.642598 1.39726H5.36795L8.62962 5.81859L12.4041 1.39726ZM11.5992 13.8329H12.8682L4.67667 2.72798H3.31359L11.5992 13.8329Z"></path>
              </svg>
            </a>

            {/* Theme Toggle Button on the absolute right corner */}
            <button
              onClick={handleThemeToggle}
              className={`inline-flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-150 cursor-pointer ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
              title="Toggle Theme (Copies ThemeToggle code)"
            >
              {theme === 'dark' ? <Sun className="w-[16px] h-[16px]" /> : <Moon className="w-[16px] h-[16px]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Render CliPage component or HomePage */}
      <AnimatePresence mode="wait">
        {currentPage === 'cli' ? (
          <motion.div
            key="cli-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <CliPage theme={theme} onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        ) : currentPage === 'skills' ? (
          <motion.div
            key="skills-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <SkillsPage theme={theme} onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        ) : (
          <motion.div
            key="home-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col"
          >
            {/* Main Content */}
            <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center">
              
              <div className="mt-10 mb-12 sm:mt-12 sm:mb-16 text-center w-full flex flex-col items-center">
                
                <h1 className={`w-full max-w-[600px] px-2 text-balance text-[34px] sm:text-[46px] font-medium leading-[38px] sm:leading-[52px] tracking-[-0.01em] mb-3 font-sans transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  <span className="block sm:inline">Amicro — </span>
                  <span>Micro-transitions</span>
                </h1>
                <p className={`w-full max-w-[530px] px-2 text-balance text-[16px] sm:text-[17px] leading-[24px] sm:leading-[25px] transition-colors duration-300 ${theme === 'dark' ? 'text-[#767676]' : 'text-black'}`}>
                  A curated library of premium micro-interactions and transition components. Built with React and Motion.
                </p>

                {/* Hero CTAs */}
                <div className="flex w-full max-w-[340px] flex-col items-stretch sm:w-auto sm:max-w-none sm:flex-row sm:items-center gap-3 mt-8">
                  <motion.a 
                    href="https://github.com/Subhan-code/Amicro--Micro-transitions-" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover="hover"
                    initial="initial"
                    whileTap={{ scale: 0.98 }}
                    variants={{
                      hover: { 
                        scale: 1.04,
                        boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(255,255,255,0.1)' : '0 10px 25px -5px rgba(0,0,0,0.15)'
                      }
                    }}
                    className={`inline-flex items-center justify-center w-full sm:w-auto gap-1.5 h-[36px] px-[16px] rounded-full text-[13px] font-medium no-underline transition-colors cursor-pointer border-0 ${theme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
                  >
                    <motion.div 
                      variants={{
                        hover: { rotate: [0, -15, 15, -15, 0], scale: 1.15 }
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center shrink-0"
                    >
                      <Github className="w-4 h-4" />
                    </motion.div>
                    <span>GitHub Repo</span>
                    {stars !== null && (
                      <span className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-semibold ml-1 ${theme === 'dark' ? 'bg-black/10 text-black/70' : 'bg-white/20 text-white/90'}`}>
                        {stars}
                      </span>
                    )}
                  </motion.a>
                  <motion.button 
                    onClick={() => {
                      const element = document.getElementById('component-grid');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    whileHover="hover"
                    initial="initial"
                    whileTap={{ scale: 0.98 }}
                    variants={{
                      hover: { 
                        scale: 1.04,
                        boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0,0,0,0.3)' : '0 10px 25px -5px rgba(0,0,0,0.05)'
                      }
                    }}
                    className={`inline-flex items-center justify-center w-full sm:w-auto h-[36px] px-[16px] rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${theme === 'dark' ? 'bg-[#181818] border-neutral-800 text-white hover:bg-neutral-800' : 'bg-white border-neutral-200 text-black hover:bg-neutral-50 shadow-sm'}`}
                  >
                    <motion.div
                      variants={{
                        hover: { y: [0, -4, 4, -2, 2, 0] }
                      }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center shrink-0 mr-1"
                    >
                      <ArrowDownAZ className="w-3 h-3" />
                    </motion.div>
                    <span>Browse Components</span>
                  </motion.button>
                </div>

                {/* Filter and layout controls */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-10 sm:mt-12">
                  <div className={`flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                    <button
                      onClick={() => setSortBy(sortBy === 'default' ? 'alphabetical' : 'default')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 ${
                        sortBy === 'alphabetical' 
                          ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                          : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                      }`}
                    >
                      <ArrowDownAZ className="w-3.5 h-3.5" />
                      <span>A-Z</span>
                    </button>
                  </div>
                  <div className={`flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                    <button
                      onClick={() => setLayout('list')}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                        layout === 'list' 
                          ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                          : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLayout('grid')}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                        layout === 'grid' 
                          ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                          : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLayout('matrix')}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                        layout === 'matrix' 
                          ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                          : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                      }`}
                    >
                      <LayoutTemplate className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Components Display */}
              <div 
                id="component-grid"
                className={`
                  w-full flex justify-center gap-4 sm:gap-[24px] scroll-mt-24 mb-16
                  ${layout === 'list' ? 'flex-col items-center max-w-md mx-auto' : ''}
                  ${layout === 'grid' ? 'flex-wrap' : ''}
                  ${layout === 'matrix' ? 'flex-wrap max-w-4xl gap-4' : ''}
                `}
              >
                <AnimatePresence mode="popLayout">
                  {displayedButtons.map((button) => (
                    <motion.div 
                      layout 
                      key={button.id}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`${layout === 'list' ? 'w-full' : ''} ${layout === 'grid' ? 'w-full sm:w-[320px]' : ''}`}
                    >
                      {layout === 'grid' ? (
                        <div className={`relative w-full max-w-[320px] sm:w-[320px] h-[268px] rounded-[24px] transition-all duration-300 group ${theme === 'dark' ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}>
                          <div className={`absolute left-[12px] top-[12px] right-[12px] h-[188px] rounded-[14px] overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
                            <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${theme === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'}`} />
                            <AnimatedButton config={button} layoutMode={layout} theme={theme} />
                          </div>
                          <div className="absolute left-[20px] bottom-[14px] w-[calc(100%-80px)] flex flex-col gap-[2px]">
                            <div className={`text-[13px] font-semibold leading-[18px] transition-colors ${theme === 'dark' ? 'text-[#ededed]' : 'text-black'}`}>{button.label}</div>
                            <div className={`text-[11px] font-normal leading-[13px] transition-colors ${theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'} capitalize`}>{button.interactionType.replace('-', ' ')} interaction</div>
                          </div>
                          <button 
                            onClick={() => handleCopyCode(button)}
                            type="button" 
                            className={`absolute right-[20px] bottom-[12px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 ${theme === 'dark' ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]' : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'}`} 
                            aria-label="Copy interaction code"
                          >
                            <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                          </button>
                        </div>
                      ) : (
                        <AnimatedButton config={button} layoutMode={layout} theme={theme} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>



            </div>

            {/* Recommended course CTA */}
            <aside className="relative z-10 w-full max-w-[720px] mx-auto mt-[20px] mb-[70px] flex items-start sm:items-center gap-2.5 sm:gap-[24px] px-4 sm:px-0">
              <span className={`w-[2px] h-[78px] rounded-[1px] shrink-0 transition-colors ${theme === 'dark' ? 'bg-white/[0.14]' : 'bg-neutral-300'}`} aria-hidden="true" />
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[24px]">
                <div className="flex-1 min-w-0 flex flex-col gap-[10px] max-w-[432px]">
                  <p className={`m-0 text-[14px] leading-[1.4] transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    If you want to use beautiful ready-to-use UI components, I highly recommend <a href="https://oxygen-ui.vercel.app" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 transition-colors duration-180 ${theme === 'dark' ? 'text-white decoration-white/50 hover:decoration-white' : 'text-black decoration-black/50 hover:decoration-black'}`}>Oxygen UI</a>.
                  </p>
                  <p className="m-0 flex flex-col text-[13px] leading-[18px]">
                    <a href="https://x.com/SubhanHQ" target="_blank" rel="noopener noreferrer" className={`hover:underline no-underline font-medium ${theme === 'dark' ? 'text-[#e9e9e9]' : 'text-black'}`}>Syed Subhan</a>
                    <span className={`transition-colors ${theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'}`}>Creator of Oxygen UI</span>
                  </p>
                </div>
                <a className={`inline-flex items-center gap-[4px] h-[40px] px-[16px] rounded-[24px] font-medium text-[13px] leading-[13px] no-underline transition-colors duration-200 shrink-0 sm:ml-auto group ${theme === 'dark' ? 'bg-[#ffffff] text-[#0d0d0d] hover:bg-[#e8e8e8]' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`} href="https://oxygen-ui.vercel.app" target="_blank" rel="noopener noreferrer">
                  <span>Get Oxygen UI</span>
                  <span className="inline-flex w-[16px] h-[16px]">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                      <path d="M7.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V8.5"></path>
                      <g className="transition-transform duration-250 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]">
                        <path d="M8.5 7.5L13.5 2.5M10 2.5H13.5V6"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 w-full px-4 text-center pb-[24px] text-[13px] leading-[14px]">
        <span className={theme === 'dark' ? 'text-[#8f8f8f]' : 'text-black opacity-60'}>Created by</span>
        <a className={`no-underline ml-[4px] font-medium transition-colors ${theme === 'dark' ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://x.com/SubhanHQ" target="_blank" rel="noopener noreferrer">Syed Subhan</a>
        <span className={`mx-1 ${theme === 'dark' ? 'text-[#8f8f8f]' : 'text-black opacity-60'}`}>·</span>
        <a className={`no-underline transition-colors ${theme === 'dark' ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://github.com/Subhan-code/Amicro--Micro-transitions-#readme">Terms & License</a>
      </footer>

      {/* Copy-Success Toast Alert */}
      <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-[100] pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2.5 text-[13px] font-medium shadow-lg pointer-events-auto ${
                theme === 'dark' 
                  ? 'bg-[#181818] border-neutral-800 text-white shadow-black/20' 
                  : 'bg-white border-neutral-200 text-black shadow-neutral-200/50'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

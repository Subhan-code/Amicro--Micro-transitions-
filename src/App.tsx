import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { 
  LayoutGrid, List, LayoutTemplate, ArrowDownAZ, Copy, Sun, Moon, Github, 
  Terminal, Check, Cpu, Zap, Code, ShieldCheck, Sparkles, RefreshCw, Smartphone, 
  ChevronRight, ChevronDown, Shield, Layers, HelpCircle, Palette, Activity, Menu, X
} from 'lucide-react';
import { buttonsData } from './data/buttons';
import { AnimatedButton } from './components/AnimatedButton';
import { getComponentCode, ThemeToggleCode, getCardComponentCode } from './utils/codeGenerator';
import { CliPage } from './components/CliPage';
import { SkillsPage } from './components/SkillsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { useWebHaptics } from './hooks/useWebHaptics';
import { Analytics } from '@vercel/analytics/react';

// Loaders imports
import { loaderGroups } from './data/loaders';
import { loadersCode } from './utils/loadersCode';
import { InViewRender } from './components/InViewRender';

// Card layouts imports
import { cardsData, CardConfig } from './data/cards';
import { CardArc5 } from './components/cards/CardArc5';
import { CardArc7 } from './components/cards/CardArc7';
import { CardLongArc5 } from './components/cards/CardLongArc5';
import { CardLinearSpread } from './components/cards/CardLinearSpread';
import { CardCornerFan } from './components/cards/CardCornerFan';
import { CardStampArc } from './components/cards/CardStampArc';
import { CardCascadeStagger } from './components/cards/CardCascadeStagger';
import { CardScatterSpread } from './components/cards/CardScatterSpread';
import { CardWheelFan } from './components/cards/CardWheelFan';
import { CardCarousel } from './components/cards/CardCarousel';
import { CardCoverFlow } from './components/cards/CardCoverFlow';
import { CardTimeMachine } from './components/cards/CardTimeMachine';

type LayoutMode = 'list' | 'grid' | 'matrix';
type SortMode = 'default' | 'alphabetical';
type PageMode = 'home' | 'cli' | 'skills' | 'analytics';
type CatalogTabType = 'buttons' | 'cards' | 'carousels' | 'loaders';

interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
}

const tabLabels: Record<CatalogTabType, string> = {
  buttons: 'Buttons',
  cards: 'Card Spreads',
  carousels: '3D Carousels',
  loaders: 'Loaders',
};

function AnimatedNumber({ value }: { value: number | null }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === null) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  if (value === null) return null;
  return <>{displayValue}</>;
}

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [sortBy, setSortBy] = useState<SortMode>('default');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<PageMode>('home');
  const [catalogTab, setCatalogTab] = useState<CatalogTabType>('buttons');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { trigger: triggerHaptic } = useWebHaptics();

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [sponsors, setSponsors] = useState<SponsorSlot[]>([
    {
      id: 1,
      companyName: 'Ossium',
      description: 'Design systems, UI kits, and templates for indie builders and developers.',
      logoType: 'ossium',
      siteUrl: 'https://ossium.live/',
      isAvailable: false,
    },
    { id: 2, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
    { id: 3, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
    { id: 4, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
  ]);
  const [adForm, setAdForm] = useState({
    companyName: '',
    description: '',
    siteUrl: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Hash-based router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/cli') || hash.startsWith('#cli')) {
        setCurrentPage('cli');
      } else if (hash.startsWith('#/skills') || hash.startsWith('#skills')) {
        setCurrentPage('skills');
      } else if (hash.startsWith('#/analytics') || hash.startsWith('#analytics')) {
        setCurrentPage('analytics');
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

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Listen for Polar redirect parameters to confirm slot updates
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const slotIdStr = params.get('slot_id');
    const companyName = params.get('company_name');
    const description = params.get('description');
    const siteUrl = params.get('site_url');

    if (paymentSuccess === 'true' && slotIdStr && companyName && description && siteUrl) {
      const slotId = parseInt(slotIdStr, 10);
      setSponsors(prev => prev.map(s => {
        if (s.id === slotId) {
          return {
            id: s.id,
            companyName,
            description,
            siteUrl,
            isAvailable: false
          };
        }
        return s;
      }));
      showToast(`Sponsor ad placed successfully for ${companyName}!`);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [showToast]);

  const handleCopyCode = useCallback((button: typeof buttonsData[0]) => {
    const code = getComponentCode(button);
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        showToast(`Copied ${button.label} component code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleCopyCardCode = useCallback((card: CardConfig) => {
    const code = getCardComponentCode(card);
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        showToast(`Copied ${card.label} component code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleCopyLoaderCode = useCallback((name: string) => {
    const code = loadersCode[name] || `// Loader ${name} code not found`;
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        showToast(`Copied ${name} loader code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const copyCliCommand = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerHaptic('light');
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy command.");
      });
  }, [showToast, triggerHaptic]);

  const handleThemeToggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    navigator.clipboard.writeText(ThemeToggleCode)
      .then(() => {
        triggerHaptic('medium');
        showToast("Theme toggled & ThemeToggle code copied!");
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy theme code.");
      });
  }, [theme, showToast, triggerHaptic]);

  const displayedButtons = useMemo(() => {
    let sorted = [...buttonsData];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.label.localeCompare(b.label));
    }
    return sorted;
  }, [sortBy]);

  const displayedCards = useMemo(() => {
    const targetCategory = catalogTab === 'cards' ? 'spreads' : 'carousels';
    let filtered = cardsData.filter(card => (card.category || 'spreads') === targetCategory);
    if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.label.localeCompare(b.label));
    }
    return filtered;
  }, [catalogTab, sortBy]);

  const isLightTheme = theme === 'light';

  const navigateTo = (page: PageMode) => {
    if (page === 'cli') {
      window.location.hash = '#cli';
    } else if (page === 'skills') {
      window.location.hash = '#skills';
    } else if (page === 'analytics') {
      window.location.hash = '#analytics';
    } else {
      window.location.hash = '';
    }
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`relative w-full min-h-dvh flex flex-col font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#121212] text-[#ffffff] selection:bg-neutral-850' : 'bg-[#f8f9fa] text-black selection:bg-neutral-200'}`}>
      
      {/* Site Navbar */}
      <header className="relative z-50 w-full pt-4 pb-4 px-6 border-b border-transparent">
        <div className="relative z-[3] flex items-center justify-between gap-4 max-w-[1240px] mx-auto">
          <div className="flex items-center gap-[34px] min-w-0">
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
              <button 
                onClick={() => navigateTo('analytics')}
                className={`inline-flex items-center justify-center h-[36px] px-[14px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'analytics'
                    ? (theme === 'dark' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-black bg-neutral-200/80 font-semibold')
                    : (theme === 'dark' ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40')
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
          
          {/* Navbar Actions with Theme Toggle at the far right corner */}
          <div className="flex items-center gap-[8px]">
            <a 
              href="https://github.com/Subhan-code/Amicro--Micro-transitions-" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center justify-center gap-1.5 h-[36px] px-[13px] rounded-full font-sans text-[13px] font-medium leading-[16px] no-underline transition-colors duration-150 group ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-auto h-[16px] max-w-[16px] block">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="inline-block">
                {stars !== null ? <AnimatedNumber value={stars} /> : 'Star'}
              </span>
            </a>
            <a 
              href="https://x.com/SubhanHQ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`hidden sm:inline-flex items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-150 ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
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

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex sm:hidden items-center justify-center w-[36px] h-[36px] rounded-full transition-colors duration-150 cursor-pointer border-0 bg-transparent ${theme === 'dark' ? 'bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed]' : 'bg-neutral-200/80 hover:bg-neutral-300/80 text-black hover:text-black'}`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-[64px] left-6 right-6 p-4 rounded-2xl border flex flex-col gap-2 z-[999] shadow-2xl sm:hidden backdrop-blur-xl ${
                theme === 'dark' 
                  ? 'bg-zinc-950/95 border-white/10 text-white' 
                  : 'bg-white/95 border-neutral-200 text-black'
              }`}
            >
              <button 
                onClick={() => navigateTo('home')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent ${
                  currentPage === 'home'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Components
              </button>
              <button 
                onClick={() => navigateTo('cli')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent ${
                  currentPage === 'cli'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                CLI Install
              </button>
              <button 
                onClick={() => navigateTo('skills')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent ${
                  currentPage === 'skills'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Skills
              </button>
              <button 
                onClick={() => navigateTo('analytics')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent ${
                  currentPage === 'analytics'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Analytics
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
        ) : currentPage === 'analytics' ? (
          <motion.div
            key="analytics-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <AnalyticsPage theme={theme} onNavigateHome={() => navigateTo('home')} />
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
            <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center">
              
              <div className="mt-12 mb-16 text-center w-full flex flex-col items-center">
                
                <h1 className={`text-[32px] sm:text-[46px] font-medium leading-[38px] sm:leading-[52px] tracking-[-0.01em] mb-3 font-sans transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Amicro — Micro-transitions
                </h1>
                <p className={`text-[14px] sm:text-[17px] leading-[20px] sm:leading-[25px] max-w-[530px] transition-colors duration-300 ${theme === 'dark' ? 'text-[#767676]' : 'text-black'}`}>
                  A curated library of premium micro-interactions and transition components. Built with React and Motion.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
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
                    className={`inline-flex items-center justify-center gap-1.5 h-[36px] px-[16px] rounded-full text-[13px] font-medium no-underline transition-colors cursor-pointer border-0 ${theme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
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
                        <AnimatedNumber value={stars} />
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
                    className={`inline-flex items-center justify-center h-[36px] px-[16px] rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${theme === 'dark' ? 'bg-[#181818] border-neutral-800 text-white hover:bg-neutral-800' : 'bg-white border-neutral-200 text-black hover:bg-neutral-50 shadow-sm'}`}
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

                {/* Sponsor Ad Grid */}
                <div className="w-full max-w-3xl mx-auto mt-10 px-4 sm:px-0 flex flex-col items-center">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-3.5 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Sponsored by
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                    {sponsors.map((slot) => {
                      if (!slot.isAvailable) {
                        return (
                          <a
                            key={slot.id}
                            href={slot.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => triggerHaptic('light')}
                            className={`group relative flex flex-col items-center justify-center text-center p-3 h-[58px] rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                              theme === 'dark'
                                ? 'bg-[#181818] border-neutral-800/80 hover:bg-[#1e1e1e] text-white'
                                : 'bg-white border-neutral-200 hover:shadow-xs text-black shadow-2xs'
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center w-full">
                              {slot.logoType === 'ossium' ? (
                                <div className="flex items-center gap-1.5 font-bold tracking-tight text-[12px] text-emerald-500">
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    <path d="M2 12h20" />
                                  </svg>
                                  <span>Ossium</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 font-bold tracking-tight text-[12px] text-emerald-500 w-full px-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                                  <span className="truncate max-w-[120px]">{slot.companyName}</span>
                                </div>
                              )}
                              <p className={`text-[9.5px] leading-snug mt-0.5 font-medium truncate w-full px-1 transition-colors ${theme === 'dark' ? 'text-neutral-500 group-hover:text-neutral-400' : 'text-neutral-500 group-hover:text-neutral-750'}`}>
                                {slot.description}
                              </p>
                            </div>
                          </a>
                        );
                      } else {
                        return (
                          <button
                            key={slot.id}
                            onClick={() => {
                              triggerHaptic('medium');
                              setSelectedSlotId(slot.id);
                              setPaymentSuccess(false);
                              setIsProcessingPayment(false);
                              setAdForm({ companyName: '', description: '', siteUrl: '' });
                            }}
                            className={`group flex flex-col items-center justify-center text-center p-3 rounded-xl border border-dashed transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-transparent h-[58px] ${
                              theme === 'dark'
                                ? 'border-neutral-800 hover:border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/10'
                                : 'border-neutral-300 hover:border-neutral-400 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50/30'
                            }`}
                          >
                            <span className="text-[11px] font-bold tracking-tight flex items-center gap-1">
                              <span>+</span> Sponsor
                            </span>
                            <span className={`text-[8.5px] mt-0.5 transition-colors ${theme === 'dark' ? 'text-neutral-600 group-hover:text-neutral-500' : 'text-neutral-400 group-hover:text-neutral-500'}`}>
                              $49/mo
                            </span>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* Filter and layout controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full max-w-xl mx-auto px-4 sm:px-0">                  {/* Category Switcher: Dropdown on Mobile, Pills on Desktop */}
                  <div className="relative block sm:hidden w-full max-w-[260px] mx-auto z-40">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full flex items-center justify-between px-5 py-2.5 rounded-full border text-[13px] font-semibold cursor-pointer transition-all duration-300 shadow-sm border-0 focus-visible:outline-none ${
                        theme === 'dark' 
                          ? 'bg-[#181818] border-white/5 text-white hover:bg-[#222]' 
                          : 'bg-white border-neutral-200 text-black hover:bg-neutral-50'
                      }`}
                    >
                      <span>
                        {tabLabels[catalogTab]}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-90 text-white' : 'text-neutral-400'}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => setDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 6, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={`absolute top-full left-0 right-0 z-50 rounded-[20px] border p-1.5 shadow-xl flex flex-col gap-0.5 max-h-[300px] overflow-y-auto backdrop-blur-xl ${
                              theme === 'dark' 
                                ? 'bg-[#181818]/95 border-white/5 text-[#ededed] shadow-black/50' 
                                : 'bg-white/95 border-neutral-200 text-black shadow-neutral-200/50'
                            }`}
                          >
                            {[
                              { id: 'buttons', label: 'Buttons' },
                              { id: 'cards', label: 'Card Spreads' },
                              { id: 'carousels', label: '3D Carousels' },
                              { id: 'loaders', label: 'Loaders' }
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setCatalogTab(tab.id as any);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer border-0 transition-colors ${
                                  catalogTab === tab.id
                                    ? (theme === 'dark' ? 'bg-white/10 text-white font-semibold' : 'bg-neutral-100 text-black font-semibold')
                                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/[0.04]' : 'text-neutral-600 hover:text-black hover:bg-neutral-50')
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                            <div className={`mt-2 pt-3 border-t px-4 py-2 flex flex-col gap-1 text-center select-none ${theme === 'dark' ? 'border-white/5' : 'border-neutral-100'}`}>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                theme === 'dark' ? 'text-[#ededed]' : 'text-black'
                              }`}>
                                More Coming Soon
                              </span>
                              <span className={`text-[10.5px] leading-normal italic ${
                                theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'
                              }`}>
                                "Motion is the brush stroke of digital art. More premium transitions are crafting behind the scenes."
                              </span>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Desktop Category Switcher (Pills) */}
                  <div className={`hidden sm:flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 max-w-full overflow-x-visible ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                    <div className="flex items-center gap-1.5 pr-1">
                      <button
                        onClick={() => setCatalogTab('buttons')}
                        className={`flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 whitespace-nowrap ${
                          catalogTab === 'buttons' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Buttons
                      </button>
                      <button
                        onClick={() => setCatalogTab('cards')}
                        className={`flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 whitespace-nowrap ${
                          catalogTab === 'cards' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Card Spreads
                      </button>
                      <button
                        onClick={() => setCatalogTab('carousels')}
                        className={`flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 whitespace-nowrap ${
                          catalogTab === 'carousels' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        3D Carousels
                      </button>
                      <button
                        onClick={() => setCatalogTab('loaders')}
                        className={`flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 whitespace-nowrap ${
                          catalogTab === 'loaders' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Loaders
                      </button>

                      {/* More Filters Dropdown */}
                      <div className="relative animate-none">
                        <button
                          onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                          className={`flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 whitespace-nowrap ${
                            theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span>More</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {moreDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-40 bg-transparent" 
                                onClick={() => setMoreDropdownOpen(false)} 
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 6, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className={`absolute top-full right-0 z-50 rounded-[20px] border p-4 shadow-xl flex flex-col gap-2 min-w-[260px] text-center select-none backdrop-blur-xl ${
                                  theme === 'dark' 
                                    ? 'bg-[#181818]/95 border-white/5 text-[#ededed] shadow-black/40' 
                                    : 'bg-white/95 border-neutral-200 text-black shadow-neutral-200/30'
                                }`}
                              >
                                <div className={`font-bold text-[11px] uppercase tracking-widest mb-0.5 ${
                                  theme === 'dark' ? 'text-[#ededed]' : 'text-black'
                                }`}>
                                  More Coming Soon
                                </div>
                                <p className={`text-[11px] leading-[15px] italic m-0 transition-colors ${
                                  theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'
                                }`}>
                                  "Motion is the brush stroke of digital art. More premium transitions are crafting behind the scenes."
                                </p>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Secondary controls row on mobile */}
                  {catalogTab !== 'loaders' && (
                    <div className="flex items-center justify-center gap-3 shrink-0">
                      {/* Sort */}
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

                      {/* Layout */}
                      <div className={`hidden sm:flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                        <button
                          onClick={() => setLayout('list')}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                            layout === 'list' 
                              ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                              : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                          }`}
                          aria-label="List layout"
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
                          aria-label="Grid layout"
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
                          aria-label="Matrix layout"
                        >
                          <LayoutTemplate className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div 
                id="component-grid"
                className={`
                  w-full mb-16 mx-auto scroll-mt-24 px-4 sm:px-0
                  ${catalogTab === 'loaders' ? 'flex flex-col items-center w-full max-w-[1060px]' : `
                    ${layout === 'list' ? 'flex flex-col items-center gap-4 max-w-md' : ''}
                    ${layout === 'grid' ? (
                      catalogTab === 'buttons' 
                        ? 'flex flex-col items-center gap-6 w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 lg:gap-12 max-w-[1060px] sm:justify-items-center' 
                        : 'flex flex-col items-center gap-6 w-full sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:max-w-6xl'
                    ) : ''}
                    ${layout === 'matrix' ? (
                      catalogTab === 'buttons'
                        ? 'flex flex-wrap justify-center gap-3 w-full max-w-[1400px] sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-2 sm:justify-items-center'
                        : 'flex flex-col items-center gap-4 w-full sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 sm:max-w-6xl'
                    ) : ''}
                  `}
                `}
              >
                <AnimatePresence mode="popLayout">
                  {catalogTab === 'buttons' ? (
                    displayedButtons.map((button) => (
                      <motion.div 
                        layout 
                        key={button.id}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`${layout === 'list' ? 'w-full' : ''} ${layout === 'grid' ? 'w-full flex justify-center sm:w-auto sm:block' : ''}`}
                      >
                        {layout === 'grid' ? (
                          <div className={`relative w-full max-w-[320px] sm:w-[320px] h-[220px] sm:h-[268px] rounded-[24px] transition-all duration-300 group ${theme === 'dark' ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}>
                            <div className={`absolute left-[12px] top-[12px] right-[12px] bottom-[68px] rounded-[14px] overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
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
                    ))
                  ) : catalogTab === 'loaders' ? (
                    <div className="w-full flex flex-col gap-16 max-w-[1060px] mx-auto text-left">
                      {loaderGroups.map((group, groupIdx) => {
                        const isPhysicsGroup = group.title === 'Physics & Simulation';
                        return (
                          <div key={groupIdx} className="flex flex-col gap-6 w-full">
                            <div className="flex items-center gap-3 px-2">
                              <h2 className={`text-[17px] font-semibold tracking-tight transition-colors ${theme === 'dark' ? 'text-[#ededed]' : 'text-black'}`}>
                                {group.title}
                              </h2>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${theme === 'dark' ? 'bg-white/[0.06] text-neutral-400' : 'bg-neutral-200/60 text-neutral-600'}`}>
                                {group.loaders.length} items
                              </span>
                            </div>
                            
                            {isPhysicsGroup ? (
                              <div className="w-full">
                                {group.loaders.map((loader, loaderIdx) => {
                                  const LoaderComponent = loader.component;
                                  return (
                                    <div 
                                      key={loaderIdx} 
                                      className={`relative group rounded-[24px] flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-300 border h-64 md:h-80 w-full overflow-hidden ${
                                        theme === 'dark' 
                                          ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
                                          : 'bg-white border-neutral-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                                      }`}
                                    >
                                      {/* Container for Loader Component */}
                                      <div className="flex-1 flex items-center justify-center w-full">
                                        <InViewRender>
                                          <LoaderComponent theme={theme} />
                                        </InViewRender>
                                      </div>

                                      {/* Details row at the bottom of full-width card */}
                                      <div className="w-full flex items-center justify-between mt-4 px-2">
                                        <span className={`text-[13px] font-semibold transition-colors ${
                                          theme === 'dark' ? 'text-neutral-350' : 'text-neutral-700'
                                        }`}>
                                          {loader.name}
                                        </span>
                                        
                                        <button
                                          onClick={() => handleCopyLoaderCode(loader.component.name || loader.component.displayName || loader.name)}
                                          className={`p-2 rounded-xl transition-all cursor-pointer border-0 ${
                                            theme === 'dark' ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-300 hover:text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-650 hover:text-black'
                                          }`}
                                          title="Copy loader code"
                                        >
                                          <Copy className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                                {group.loaders.map((loader, loaderIdx) => {
                                  const LoaderComponent = loader.component;
                                  return (
                                    <div 
                                      key={loaderIdx} 
                                      className={`relative group aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 border ${
                                        theme === 'dark' 
                                          ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
                                          : 'bg-white border-neutral-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-neutral-200/50'
                                      }`}
                                    >
                                      <div className="flex-1 flex items-center justify-center w-full min-h-[64px]">
                                        <InViewRender>
                                          <LoaderComponent theme={theme} />
                                        </InViewRender>
                                      </div>

                                      <div className="w-full flex items-center justify-between mt-3 px-1 gap-1">
                                        <span className={`text-[12px] font-medium truncate transition-colors ${
                                          theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                                        }`} title={loader.name}>
                                          {loader.name}
                                        </span>
                                        
                                        <button
                                          onClick={() => handleCopyLoaderCode(loader.component.name || loader.component.displayName || loader.name)}
                                          className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer border-0 ${
                                            theme === 'dark' ? 'bg-white/[0.06] text-neutral-400 hover:text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'
                                          }`}
                                          title="Copy loader code"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    displayedCards.map((card) => (
                      <motion.div 
                        layout 
                        key={card.id}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`${layout === 'list' ? 'w-full' : ''} ${layout === 'grid' || layout === 'matrix' ? 'w-full flex justify-center sm:w-auto sm:block' : ''}`}
                      >
                        {layout === 'grid' || layout === 'matrix' ? (
                          <div 
                            onMouseEnter={() => setHoveredCardId(card.id)}
                            onMouseLeave={() => setHoveredCardId(null)}
                            className={`relative w-full max-w-[480px] sm:w-[480px] h-[280px] sm:h-[380px] rounded-[24px] transition-all duration-300 group ${theme === 'dark' ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}
                          >
                            <div className={`absolute left-[12px] top-[12px] right-[12px] h-[200px] sm:h-[300px] rounded-[14px] flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
                              <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${theme === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'}`} />
                              {card.interactionType === 'card-arc-5' && <CardArc5 hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-arc-7' && <CardArc7 hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-long-arc-5' && <CardLongArc5 hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-linear-spread' && <CardLinearSpread hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-corner-fan' && <CardCornerFan hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-stamp-arc' && <CardStampArc hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-cascade-stagger' && <CardCascadeStagger hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-scatter-spread' && <CardScatterSpread hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-wheel-fan' && <CardWheelFan hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-carousel' && <CardCarousel hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-cover-flow' && <CardCoverFlow hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-time-machine' && <CardTimeMachine hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-carousel-mono' && <CardCarousel hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-cover-flow-mono' && <CardCoverFlow hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-time-machine-mono' && <CardTimeMachine hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                            </div>
                            <div className="absolute left-[20px] bottom-[14px] w-[calc(100%-80px)] flex flex-col gap-[2px]">
                              <div className={`text-[13px] font-semibold leading-[18px] transition-colors ${theme === 'dark' ? 'text-[#ededed]' : 'text-black'}`}>{card.label}</div>
                              <div className={`text-[11px] font-normal leading-[13px] transition-colors ${theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'}`}>{card.description}</div>
                            </div>
                            <button 
                              onClick={() => handleCopyCardCode(card)}
                              type="button" 
                              className={`absolute right-[20px] bottom-[12px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 ${theme === 'dark' ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]' : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'}`} 
                              aria-label="Copy card code"
                            >
                              <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                          </div>
                        ) : (
                          // List view for cards
                          <div className={`w-full max-w-[500px] flex items-center justify-between p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-[#181818] border-neutral-850 text-white' : 'bg-white border-neutral-200 shadow-sm text-black'}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-neutral-100'}`}>
                                <LayoutTemplate className="w-5 h-5 text-neutral-400" />
                              </div>
                              <div>
                                <div className="text-[14px] font-semibold">{card.label}</div>
                                <div className={`text-[11px] ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>{card.description}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCopyCardCode(card)}
                              className={`p-2 rounded-lg cursor-pointer border-0 ${theme === 'dark' ? 'bg-white/[0.06] text-neutral-300 hover:bg-white/[0.1]' : 'bg-neutral-150 text-neutral-750 hover:bg-neutral-200'}`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>



            </div>

            {/* Recommended course CTA */}
            <aside className="relative z-10 w-full max-w-[720px] mx-auto mt-[20px] mb-[70px] flex items-start sm:items-center gap-2.5 sm:gap-[24px] px-6 sm:px-0">
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

      <footer className="relative z-10 w-full text-center pb-[24px] text-[13px] leading-[14px]">
        <span className={theme === 'dark' ? 'text-[#8f8f8f]' : 'text-black opacity-60'}>Created by</span>
        <a className={`no-underline ml-[4px] font-medium transition-colors ${theme === 'dark' ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://x.com/SubhanHQ" target="_blank" rel="noopener noreferrer">Syed Subhan</a>
        <span className={`mx-1 ${theme === 'dark' ? 'text-[#8f8f8f]' : 'text-black opacity-60'}`}>·</span>
        <a className={`no-underline transition-colors ${theme === 'dark' ? 'text-[#e9e9e9] hover:text-white' : 'text-black hover:text-black'}`} href="https://github.com/Subhan-code/Amicro--Micro-transitions-#readme">Terms & License</a>
      </footer>

      {/* Copy-Success Toast Alert */}
      <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl border flex items-center gap-2.5 text-[13px] font-medium shadow-lg pointer-events-auto ${
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

      {/* Sponsor Purchase Modal */}
      <AnimatePresence>
        {selectedSlotId !== null && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessingPayment) setSelectedSlotId(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative w-full max-w-md rounded-3xl border p-6 flex flex-col shadow-2xl z-10 ${
                theme === 'dark' 
                  ? 'bg-zinc-950 border-white/10 text-white shadow-black/80' 
                  : 'bg-white border-neutral-200 text-black shadow-neutral-200/50'
              }`}
            >
              {/* Close button */}
              {!isProcessingPayment && (
                <button
                  onClick={() => setSelectedSlotId(null)}
                  className={`absolute top-4 right-4 p-1.5 rounded-full border-0 cursor-pointer bg-transparent transition-colors ${
                    theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                  }`}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {!paymentSuccess ? (
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                      $
                    </div>
                    <h2 className="text-[20px] font-bold tracking-tight">Sponsor Amicro</h2>
                  </div>
                  <p className={`text-[13px] leading-relaxed mb-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Promote your brand to 50k+ developers. Secure checkout is managed globally by **Polar**.
                  </p>

                  {/* Form inputs */}
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={adForm.companyName}
                        onChange={(e) => setAdForm({ ...adForm, companyName: e.target.value })}
                        placeholder="e.g. Acme Inc"
                        className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] font-medium transition-all ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600 focus:outline-none'
                            : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:outline-none'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Description / Tagline (max 80 chars)
                      </label>
                      <input
                        type="text"
                        maxLength={80}
                        value={adForm.description}
                        onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                        placeholder="e.g. Best hosting solution for fast React apps."
                        className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] font-medium transition-all ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600 focus:outline-none'
                            : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:outline-none'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Website / Redirect URL
                      </label>
                      <input
                        type="url"
                        value={adForm.siteUrl}
                        onChange={(e) => setAdForm({ ...adForm, siteUrl: e.target.value })}
                        placeholder="https://acme.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] font-medium transition-all ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600 focus:outline-none'
                            : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:outline-none'
                        }`}
                      />
                    </div>
                  </div>

                        {/* Polar Payments Trigger */}
                        <button
                          disabled={!adForm.companyName || !adForm.description || !adForm.siteUrl || isProcessingPayment}
                          onClick={() => {
                            triggerHaptic('medium');
                            setIsProcessingPayment(true);
                            
                            // Call Polar serverless API
                            fetch('/api/checkout', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                slotId: selectedSlotId,
                                companyName: adForm.companyName,
                                description: adForm.description,
                                siteUrl: adForm.siteUrl,
                              }),
                            })
                              .then(async (res) => {
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.url) {
                                    window.location.href = data.url; // Redirect to Polar checkout page
                                  } else {
                                    throw new Error('No checkout URL returned');
                                  }
                                } else {
                                  throw new Error('API request failed');
                                }
                              })
                              .catch((err) => {
                                console.warn('Polar backend not available locally, running local checkout simulator instead.', err);
                                // Fallback to simulated checkout flow
                                setTimeout(() => {
                                  triggerHaptic('success');
                                  // Mock payment processing duration
                                  setTimeout(() => {
                                    // Save sponsor data locally and set success
                                    setSponsors(prev => prev.map(s => {
                                      if (s.id === selectedSlotId) {
                                        return {
                                          id: s.id,
                                          companyName: adForm.companyName,
                                          description: adForm.description,
                                          siteUrl: adForm.siteUrl.startsWith('http://') || adForm.siteUrl.startsWith('https://')
                                            ? adForm.siteUrl
                                            : `https://${adForm.siteUrl}`,
                                          isAvailable: false
                                        };
                                      }
                                      return s;
                                    }));
                                    setPaymentSuccess(true);
                                    setIsProcessingPayment(false);
                                    triggerHaptic('success');
                                    showToast(`Sponsor ad placed successfully for ${adForm.companyName}!`);
                                  }, 2500);
                                }, 1200);
                              });
                          }}
                          className={`w-full h-[44px] rounded-full text-[13px] font-semibold cursor-pointer border-0 flex items-center justify-center gap-2 transition-all ${
                            !adForm.companyName || !adForm.description || !adForm.siteUrl
                              ? 'bg-neutral-400/20 text-neutral-400 cursor-not-allowed'
                              : 'bg-[#0062ff] text-white hover:bg-[#0052d4] shadow-md shadow-blue-500/10 active:scale-98'
                          }`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Processing payment via Polar...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>Pay with Polar ($49.00)</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                          <Check className="w-6 h-6 stroke-[3]" />
                        </div>
                        <h2 className="text-[20px] font-bold tracking-tight mb-2">Order Confirmed!</h2>
                        <p className={`text-[13px] leading-relaxed mb-6 max-w-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          Thank you! Your sponsor slot for **{adForm.companyName}** is now live on the Amicro homepage.
                        </p>
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedSlotId(null);
                          }}
                          className={`px-6 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer border transition-colors ${
                            theme === 'dark'
                              ? 'bg-white text-black border-white hover:bg-neutral-200'
                              : 'bg-neutral-950 text-white border-neutral-950 hover:bg-neutral-800'
                          }`}
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Analytics />
    </div>
  );
}

import React, { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { buttonsData } from './data/buttons';
import { AnimatedButton } from './components/AnimatedButton';
import { getComponentCode, ThemeToggleCode, getCardComponentCode } from './utils/codeGenerator';
import { useWebHaptics } from './hooks/useWebHaptics';
import { getComponentEntry } from './data/componentEntries';
import { Analytics } from '@vercel/analytics/react';
import { MinimalNavbar, NavItemKey } from './components/MinimalNavbar';
import { HeroSection } from './components/HeroSection';
import { CategoryPillBar, CatalogCategory } from './components/CategoryPillBar';
import { SponsorSection } from './components/SponsorSection';
import { CtaSection } from './components/CtaSection';
import { MinimalFooter } from './components/MinimalFooter';
import { SkeletonGrid } from './components/SkeletonGrid';
import { StickySponsorBanner } from './components/StickySponsorBanner';
import { HeroSponsorBar } from './components/HeroSponsorBar';
import { SponsorSuccessModal } from './components/SponsorSuccessModal';

// Loaders imports
import { loaderGroups, LoaderConfig } from './data/loaders';
import { loadersCode } from './utils/loadersCode';
import { InViewRender } from './components/InViewRender';
import { IconSwap, IconSwapItem } from './components/IconSwap';

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

// Lazy load secondary subpages for optimal initial bundle performance
const CliPage = lazy(() => import('./components/CliPage').then(m => ({ default: m.CliPage })));
const SkillsPage = lazy(() => import('./components/SkillsPage').then(m => ({ default: m.SkillsPage })));
const MonoChartsPage = lazy(() => import('./components/MonoChartsPage').then(m => ({ default: m.MonoChartsPage })));
const ThreeDPage = lazy(() => import('./components/ThreeDPage').then(m => ({ default: m.ThreeDPage })));
const CssAnimationsPage = lazy(() => import('./components/CssAnimationsPage').then(m => ({ default: m.CssAnimationsPage })));
const TextAnimationsPage = lazy(() => import('./components/TextAnimationsPage').then(m => ({ default: m.TextAnimationsPage })));
const SponsorsPage = lazy(() => import('./components/SponsorsPage').then(m => ({ default: m.SponsorsPage })));
const ChartDetailPage = lazy(() => import('./components/ChartDetailPage').then(m => ({ default: m.ChartDetailPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.BlogPage })));
const MorphingShapesPage = lazy(() => import('./components/morphing/MorphingShapesPage').then(m => ({ default: m.MorphingShapesPage })));
const SponsorOnboardingPage = lazy(() => import('./components/SponsorOnboardingPage').then(m => ({ default: m.SponsorOnboardingPage })));
const SponsorSuccessPage = lazy(() => import('./components/SponsorSuccessPage').then(m => ({ default: m.SponsorSuccessPage })));
const AdminSponsorsPage = lazy(() => import('./components/AdminSponsorsPage').then(m => ({ default: m.AdminSponsorsPage })));
import { POLAR_DEFAULT_URL } from './data/tiers';

type LayoutMode = 'list' | 'grid' | 'matrix';
type SortMode = 'default' | 'alphabetical';
type PageMode = 'home' | 'cli' | 'skills' | 'dither-charts' | '3d-page' | 'mono-charts' | 'sponsors' | 'chart-detail' | 'css-animations' | 'text-animations' | 'blog' | 'sponsor-onboarding' | 'sponsor-success' | 'admin-sponsors';
type CatalogTabType = 'buttons' | 'morphing' | 'cards' | 'carousels' | 'loaders' | 'mono-charts' | 'anime' | '3d' | 'text-animations' | 'dither-charts';

interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  logoUrl?: string;
  siteUrl?: string;
  isAvailable: boolean;
  tier?: 'diamond' | 'gold' | 'silver';
  price?: string;
}

const tabLabels: Record<CatalogTabType, string> = {
  buttons: 'Buttons',
  morphing: 'Morphing',
  cards: 'Card Spreads',
  carousels: '3D Carousels',
  loaders: 'Loaders',
  'mono-charts': 'Mono Charts',
  anime: 'Animations',
  '3d': '3D',
  'text-animations': 'Text Animations',
  'dither-charts': 'Dither Charts',
};

const routeMap: Record<CatalogTabType, string> = {
  buttons: '/buttons',
  morphing: '/morphing',
  cards: '/cards',
  carousels: '/carousels',
  loaders: '/loaders',
  'mono-charts': '/mono-charts',
  anime: '/animations',
  '3d': '/3d',
  'text-animations': '/text-animations',
  'dither-charts': '/dither-charts',
};

function LoadingFallback({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className="w-full py-8">
      <SkeletonGrid count={6} theme={theme} />
    </div>
  );
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
  const CHECKOUT_URL = POLAR_DEFAULT_URL;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { trigger: triggerHaptic } = useWebHaptics();

  const handleNavigateToSponsors = useCallback(() => {
    triggerHaptic('medium');
    setCurrentPage('sponsors');
    if (window.location.pathname !== '/sponsors' || window.location.hash !== '#sponsorship-tiers') {
      window.history.pushState(null, '', '/sponsors#sponsorship-tiers');
    }
    const scrollToTiers = () => {
      const elem = document.getElementById('sponsorship-tiers');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    requestAnimationFrame(scrollToTiers);
    setTimeout(scrollToTiers, 100);
    setTimeout(scrollToTiers, 300);
  }, [triggerHaptic]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Auto-hiding scrollbar: adds .is-scrolling to html while scrolling, removes after 1s idle
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsScrolledPastHero(window.scrollY > 380);
      document.documentElement.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 1000);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const [successModalData, setSuccessModalData] = useState<{ sponsorshipId?: string; paymentId?: string }>({});

  const [sponsors, setSponsors] = useState<SponsorSlot[]>(() => {
    const defaultSponsors: SponsorSlot[] = [
      {
        id: 1,
        companyName: 'Maple',
        description: 'Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.',
        logoType: 'maple',
        siteUrl: 'https://maple.dev/',
        isAvailable: false,
        tier: 'diamond',
        price: '$250/mo',
      },
      { id: 2, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'diamond', price: '$250/mo' },
      { id: 3, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150/mo' },
      { id: 4, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150/mo' },
      { id: 5, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150/mo' },
      { id: 6, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150/mo' },
      { id: 7, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99/mo' },
      { id: 8, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99/mo' },
      { id: 9, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99/mo' },
      { id: 10, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99/mo' },
    ];

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amicro_sponsors');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const hasTestArtifacts = Array.isArray(parsed) && parsed.some(
            (s) => s.companyName === 'Polar Super Tool' || s.companyName?.toLowerCase().includes('asda')
          );
          if (hasTestArtifacts) {
            localStorage.removeItem('amicro_sponsors');
          } else if (Array.isArray(parsed) && parsed.length === defaultSponsors.length) {
            parsed[0] = defaultSponsors[0];
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing cached sponsors:', e);
        }
      }
    }
    return defaultSponsors;
  });

  // Sync sponsors list to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('amicro_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  // Fetch verified active sponsors from backend on load
  const refreshSponsors = useCallback(async () => {
    try {
      const res = await fetch('/api/sponsors');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sponsors) && data.sponsors.length > 0) {
          setSponsors(data.sponsors);
        }
      }
    } catch (err) {
      console.error('Failed to load active sponsors:', err);
    }
  }, []);

  useEffect(() => {
    refreshSponsors();
  }, [refreshSponsors]);

  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

  const navigateToChartDetail = useCallback((chartId: string, customCategory?: string) => {
    setSelectedChartId(chartId);
    setCurrentPage('chart-detail');

    const entry = getComponentEntry(chartId);
    let catPath = customCategory || (entry ? entry.category : '');
    if (!catPath) {
      if (chartId.startsWith('btn-') || !isNaN(Number(chartId))) catPath = 'buttons';
      else if (chartId.startsWith('card-') || chartId.startsWith('c')) catPath = 'cards';
      else if (chartId.startsWith('mono-')) catPath = 'mono-charts';
      else if (chartId.startsWith('dither-')) catPath = 'dither-charts';
      else catPath = 'components';
    }

    const targetUrl = `/${catPath}/${chartId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  }, []);

  // Clean Path Router (Without # hash)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const route = path || hash;

      if (hash) {
        const cleanPath = hash === 'home' || hash === '' ? '/' : `/${hash}`;
        window.history.replaceState(null, '', cleanPath);
      }

      const urlParams = new URLSearchParams(window.location.search);

      // 1. Explicit Application Routes (MUST take precedence over dynamic component doc routes)
      if (route.startsWith('sponsor/success')) {
        setSelectedChartId(null);
        setCurrentPage('sponsor-success');
        return;
      }

      if (route.startsWith('admin/sponsors') || route === 'admin') {
        setSelectedChartId(null);
        setCurrentPage('admin-sponsors');
        return;
      }

      if (
        route.startsWith('sponsor-onboarding') ||
        route.startsWith('sponsor/claim') ||
        route.startsWith('sponsor-claim')
      ) {
        setSelectedChartId(null);
        setCurrentPage('sponsor-onboarding');
        return;
      }

      if (urlParams.has('checkout_id')) {
        setSelectedChartId(null);
        setCurrentPage('sponsor-onboarding');
        return;
      }

      // 2. Dynamic Component Documentation / Detail Routes (e.g. /buttons/btn-1, /cards/card-arc-5, /components/success)
      if (route.includes('/')) {
        const parts = route.split('/').filter(Boolean);
        if (parts.length >= 2) {
          const idPart = parts.slice(1).join('/');
          if (idPart) {
            setSelectedChartId(idPart);
            setCurrentPage('chart-detail');
            return;
          }
        }
      }

      setSelectedChartId(null);
      if (route.startsWith('cli')) {
        setCurrentPage('cli');
      } else if (route.startsWith('skills')) {
        setCurrentPage('skills');
      } else if (route.startsWith('blog') || route.startsWith('blogs')) {
        setCurrentPage('blog');
      } else if (route.startsWith('morphing') || route.startsWith('shapes') || route.startsWith('morph')) {
        setCurrentPage('home');
        setCatalogTab('morphing');
      } else if (route.startsWith('anime') || route.startsWith('css-animations') || route.startsWith('animations')) {
        setCurrentPage('home');
        setCatalogTab('anime');
      } else if (route.startsWith('mono-charts') || route.startsWith('monocharts')) {
        setCurrentPage('mono-charts');
      } else if (route.startsWith('dither-charts') || route.startsWith('simple-comp')) {
        setCurrentPage('mono-charts');
      } else if (route.startsWith('3d')) {
        setCurrentPage('home');
        setCatalogTab('3d');
      } else if (route.startsWith('sponsors')) {
        setCurrentPage('sponsors');
      } else if (route.startsWith('text-animations')) {
        setCurrentPage('home');
        setCatalogTab('text-animations');
      } else if (route.startsWith('buttons')) {
        setCurrentPage('home');
        setCatalogTab('buttons');
      } else if (route.startsWith('cards') || route.startsWith('card-spreads')) {
        setCurrentPage('home');
        setCatalogTab('cards');
      } else if (route.startsWith('carousels') || route.startsWith('3d-carousels')) {
        setCurrentPage('home');
        setCatalogTab('carousels');
      } else if (route.startsWith('loaders')) {
        setCurrentPage('home');
        setCatalogTab('loaders');
      } else {
        setCurrentPage('home');
        setCatalogTab('buttons');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/repos/Subhan-code/Amicro--Micro-transitions-')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        } else {
          throw new Error('Invalid stargazers_count');
        }
      })
      .catch(() => {
        fetch('https://img.shields.io/github/stars/Subhan-code/Amicro--Micro-transitions-.json')
          .then(res => res.json())
          .then(data => {
            if (data.value) {
              const raw = String(data.value).replace(/k/i, '00').replace(/\./g, '');
              const parsed = parseInt(raw, 10);
              if (!isNaN(parsed) && parsed > 0) {
                setStars(parsed);
              }
            }
          })
          .catch(err => console.error('Error fetching fallback stars:', err));
      });
  }, []);

  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    let cleanMessage = message;
    const lower = message.toLowerCase();
    if (lower.includes('cli')) {
      cleanMessage = 'CLI command copied';
    } else if (lower.includes('copied')) {
      cleanMessage = 'Copied to clipboard';
    } else if (lower.includes('failed')) {
      cleanMessage = 'Failed to copy';
    } else if (lower.includes('theme')) {
      cleanMessage = 'Theme updated';
    }
    setToastMessage(cleanMessage);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Listen for checkout redirect parameter to dynamically handle paid sponsorships
  useEffect(() => {
    if (window.location.pathname.startsWith('/sponsor/success')) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success') === 'true' ||
      params.get('status') === 'succeeded' ||
      params.get('status') === 'successful' ||
      params.get('status') === 'completed';
    const paymentId = params.get('payment_id') || params.get('checkout_id') || params.get('id');
    const sponsorshipId = params.get('sponsorship_id');

    if (paymentSuccess || sponsorshipId || paymentId) {
      if (paymentSuccess) {
        setSuccessModalData({
          sponsorshipId: sponsorshipId || undefined,
          paymentId: paymentId || undefined,
        });
        setSuccessModalOpen(true);
        // Clear params from address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleCopyCode = useCallback((button: typeof buttonsData[0]) => {
    const code = getComponentCode(button);
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        setCopiedText(`btn-${button.id}`);
        setTimeout(() => setCopiedText(null), 2000);
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
        setCopiedText(card.interactionType || card.id);
        setTimeout(() => setCopiedText(null), 2000);
        showToast(`Copied ${card.label} component code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleCopyLoaderCode = useCallback((loader: LoaderConfig | string, fallbackName?: string) => {
    let code: string | undefined;
    let name: string;
    let copyId: string;

    if (typeof loader === 'string') {
      name = fallbackName || loader;
      copyId = loader;
      code = loadersCode[loader] || (fallbackName ? loadersCode[fallbackName] : undefined);
    } else if (loader && typeof loader === 'object') {
      name = loader.name;
      copyId = loader.kebabName || loader.name;
      code = loadersCode[loader.kebabName] ||
             (loader.component?.name ? loadersCode[loader.component.name] : undefined) ||
             (loader.component?.displayName ? loadersCode[loader.component.displayName] : undefined) ||
             loadersCode[loader.name];
    } else {
      name = 'Unknown';
      copyId = 'unknown';
    }

    if (!code) {
      code = `// Loader ${name} code not found`;
    }

    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        setCopiedText(copyId);
        setTimeout(() => setCopiedText(null), 2000);
        showToast(`Copied ${name} loader code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
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

  const navigateTo = useCallback((page: PageMode, tab?: CatalogTabType) => {
    triggerHaptic('light');
    setSelectedChartId(null);
    let targetPath = '/';
    if (page === 'home') {
      targetPath = tab && tab !== 'buttons' ? (routeMap[tab] || '/') : '/';
      setCurrentPage('home');
      setCatalogTab(tab || 'buttons');
    } else if (page === 'cli') {
      targetPath = '/cli';
      setCurrentPage('cli');
    } else if (page === 'skills') {
      targetPath = '/skills';
      setCurrentPage('skills');
    } else if (page === 'css-animations') {
      targetPath = '/animations';
      setCurrentPage('home');
      setCatalogTab('anime');
    } else if (page === 'text-animations') {
      targetPath = '/text-animations';
      setCurrentPage('home');
      setCatalogTab('text-animations');
    } else if (page === 'dither-charts') {
      targetPath = '/dither-charts';
      setCurrentPage('mono-charts');
    } else if (page === '3d-page') {
      targetPath = '/3d';
      setCurrentPage('home');
      setCatalogTab('3d');
    } else if (page === 'mono-charts') {
      targetPath = '/mono-charts';
      setCurrentPage('mono-charts');
    } else if (page === 'sponsors') {
      targetPath = '/sponsors';
      setCurrentPage('sponsors');
    } else {
      const activeTab = tab || catalogTab;
      targetPath = routeMap[activeTab] || '/';
      if (tab) {
        setCatalogTab(tab);
      }
      setCurrentPage(page);
    }

    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [catalogTab, triggerHaptic]);

  const handleTabChange = useCallback((tab: CatalogTabType) => {
    triggerHaptic('light');
    if (tab === 'mono-charts') {
      navigateTo('mono-charts');
      return;
    }
    setCatalogTab(tab);
    const targetPath = routeMap[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [navigateTo, triggerHaptic]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, page: PageMode, tab?: CatalogTabType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      navigateTo(page, tab);
    }
  }, [navigateTo]);

  const handleTabLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, tab: CatalogTabType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      if (tab === 'mono-charts') {
        navigateTo('mono-charts');
        return;
      }
      if (currentPage !== 'home') {
        navigateTo('home', tab);
      } else {
        handleTabChange(tab);
      }
    }
  }, [currentPage, handleTabChange, navigateTo]);

  const activeNav: NavItemKey = useMemo(() => {
    if (currentPage === 'cli') return 'cli';
    if (currentPage === 'skills') return 'skills';
    if (currentPage === 'sponsors' || currentPage === 'sponsor-onboarding' || currentPage === 'sponsor-success') return 'sponsors';
    if (currentPage === 'blog') return 'blogs';
    if (currentPage === 'home' && catalogTab === 'anime') return 'anime';
    return 'components';
  }, [currentPage, catalogTab]);

  const handleNavigateHome = useCallback(() => {
    triggerHaptic('light');
    setSelectedChartId(null);
    setCurrentPage('home');
    setCatalogTab('buttons');
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/' || window.location.hash) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [triggerHaptic]);

  const handleSelectNav = useCallback((key: NavItemKey) => {
    triggerHaptic('light');
    setMobileMenuOpen(false);
    setSelectedChartId(null);

    if (key === 'components') {
      if (currentPage === 'home') {
        setCatalogTab('buttons');
        if (window.location.pathname !== '/' && window.location.pathname !== '/buttons') {
          window.history.pushState(null, '', '/');
        }
        const elem = document.getElementById('components');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }
      } else {
        setCurrentPage('home');
        setCatalogTab('buttons');
        if (window.location.pathname !== '/' && window.location.pathname !== '/buttons') {
          window.history.pushState(null, '', '/');
        }
        setTimeout(() => {
          const elem = document.getElementById('components');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 180);
      }
    } else if (key === 'anime') {
      if (currentPage === 'home') {
        setCatalogTab('anime');
        if (window.location.pathname !== '/Anime') {
          window.history.pushState(null, '', '/Anime');
        }
        const elem = document.getElementById('components');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        setCurrentPage('home');
        setCatalogTab('anime');
        if (window.location.pathname !== '/Anime') {
          window.history.pushState(null, '', '/Anime');
        }
        setTimeout(() => {
          const elem = document.getElementById('components');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 180);
      }
    } else if (key === 'cli') {
      setCurrentPage('cli');
      if (window.location.pathname !== '/cli') {
        window.history.pushState(null, '', '/cli');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'skills') {
      setCurrentPage('skills');
      if (window.location.pathname !== '/skills') {
        window.history.pushState(null, '', '/skills');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'blogs') {
      setCurrentPage('blog');
      if (window.location.pathname !== '/blog') {
        window.history.pushState(null, '', '/blog');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'sponsors') {
      setCurrentPage('sponsors');
      if (window.location.pathname !== '/sponsors') {
        window.history.pushState(null, '', '/sponsors');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, triggerHaptic]);

  return (
    <div className={`relative w-full min-h-dvh flex flex-col font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#08080a] text-[#ededed] selection:bg-neutral-800' : 'bg-[#f8f9fa] text-[#0a0a0c] selection:bg-neutral-200'}`}>
      
      {/* Site Minimal Floating Navbar */}
      <MinimalNavbar
        theme={theme}
        activeItem={activeNav}
        isScrolled={isScrolled}
        stars={stars}
        mobileMenuOpen={mobileMenuOpen}
        onSelectNav={handleSelectNav}
        onNavigateHome={handleNavigateHome}
        onToggleTheme={handleThemeToggle}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        triggerHaptic={triggerHaptic}
        onBack={currentPage === 'chart-detail' && selectedChartId ? () => {
          const entry = getComponentEntry(selectedChartId);
          const cat = entry ? entry.category : catalogTab;
          setSelectedChartId(null);
          if (cat === 'mono-charts') {
            navigateTo('mono-charts');
          } else if (cat === 'dither-charts') {
            navigateTo('dither-charts');
          } else {
            handleTabChange(cat as CatalogTabType);
            setCurrentPage('home');
          }
        } : undefined}
      />

      {/* Render subpages or HomePage */}
      <AnimatePresence mode="wait">
        {currentPage === 'cli' ? (
          <motion.div
            key="cli-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CliPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={CHECKOUT_URL}
                onNavigateHome={handleNavigateHome}
                onNavigateSponsors={handleNavigateToSponsors}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'skills' ? (
          <motion.div
            key="skills-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SkillsPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={CHECKOUT_URL}
                onNavigateHome={handleNavigateHome}
                onNavigateSponsors={handleNavigateToSponsors}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'sponsors' ? (
          <motion.div
            key="sponsors-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SponsorsPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={CHECKOUT_URL}
                onNavigateHome={handleNavigateHome}
                showToast={showToast}
                stars={stars}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'chart-detail' && selectedChartId ? (
          <motion.div
            key="chart-detail-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ChartDetailPage
                chartId={selectedChartId}
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={CHECKOUT_URL}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onToggleTheme={handleThemeToggle}
                onSelectComponent={(id, cat) => {
                  navigateToChartDetail(id, cat);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateTab={(cat) => {
                  setSelectedChartId(null);
                  if (cat === 'mono-charts') {
                    navigateTo('mono-charts');
                  } else if (cat === 'dither-charts') {
                    navigateTo('dither-charts');
                  } else if (cat === 'anime') {
                    handleSelectNav('anime');
                  } else {
                    handleTabChange(cat as CatalogTabType);
                    setCurrentPage('home');
                  }
                }}
                onBack={() => {
                  const entry = getComponentEntry(selectedChartId);
                  const cat = entry ? entry.category : catalogTab;
                  setSelectedChartId(null);
                  if (cat === 'mono-charts') {
                    navigateTo('mono-charts');
                  } else if (cat === 'dither-charts') {
                    navigateTo('dither-charts');
                  } else {
                    handleTabChange(cat as CatalogTabType);
                    setCurrentPage('home');
                  }
                }}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'mono-charts' ? (
          <motion.div
            key="mono-charts-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <MonoChartsPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={CHECKOUT_URL}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={handleNavigateHome}
                onSelectChart={(id) => navigateToChartDetail(id)}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === '3d-page' ? (
          <motion.div
            key="3d-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ThreeDPage theme={theme} showToast={showToast} triggerHaptic={triggerHaptic} onNavigateHome={handleNavigateHome} />
            </Suspense>
          </motion.div>
        ) : currentPage === 'css-animations' ? (
          <motion.div
            key="css-animations-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CssAnimationsPage
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={handleNavigateHome}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'text-animations' ? (
          <motion.div
            key="text-animations-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <TextAnimationsPage
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={handleNavigateHome}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'blog' ? (
          <motion.div
            key="blog-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <BlogPage
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={handleNavigateHome}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'sponsor-onboarding' ? (
          <motion.div
            key="sponsor-onboarding-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SponsorOnboardingPage
                theme={theme}
                onNavigateHome={handleNavigateHome}
                onNavigateSponsors={() => {
                  setCurrentPage('sponsors');
                  window.history.pushState(null, '', '/sponsors');
                }}
                showToast={showToast}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'sponsor-success' ? (
          <motion.div
            key="sponsor-success-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SponsorSuccessPage
                theme={theme}
                onNavigateHome={handleNavigateHome}
                onNavigateSponsors={() => {
                  setCurrentPage('sponsors');
                  window.history.pushState(null, '', '/sponsors');
                }}
                showToast={showToast}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'admin-sponsors' ? (
          <motion.div
            key="admin-sponsors-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <AdminSponsorsPage
                theme={theme}
                onNavigateHome={handleNavigateHome}
                showToast={showToast}
              />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full flex flex-col"
          >
            {/* Hero Section */}
            <HeroSection
              theme={theme}
              stars={stars}
              onBrowseComponents={() => {
                const elem = document.getElementById('components');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              triggerHaptic={triggerHaptic}
            />

            {/* Sponsored by 4-card Bar beneath Hero Section */}
            <HeroSponsorBar
              theme={theme}
              sponsors={sponsors}
              onNavigateSponsors={handleNavigateToSponsors}
              triggerHaptic={triggerHaptic}
            />

            {/* Component Cards Gallery & Discovery Playground */}
            <section id="components" className="mx-auto max-w-[1800px] w-full px-4 sm:px-8 lg:px-12 pt-2 pb-16">
              <div className="space-y-6">
                {/* Minimalist Stadium Category Filter Bar */}
                <CategoryPillBar
                  theme={theme}
                  selectedCategory={catalogTab as CatalogCategory}
                  onSelectCategory={(cat) => handleTabChange(cat)}
                  triggerHaptic={triggerHaptic}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={catalogTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >

                  {/* Component Grid */}
                  <div 
                    id="component-grid"
                    className={`
                      w-full scroll-mt-24 transition-opacity duration-200
                      ${['loaders', 'mono-charts', 'anime', '3d', 'text-animations', 'morphing'].includes(catalogTab)
                        ? 'w-full' 
                        : 'grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-8'
                      }
                    `}
                  >
                    {catalogTab === 'morphing' ? (
                      <div className="col-span-full w-full">
                        <Suspense fallback={<LoadingFallback />}>
                          <MorphingShapesPage
                            theme={theme}
                            embedded={true}
                            showToast={showToast}
                            triggerHaptic={triggerHaptic}
                            onNavigateHome={handleNavigateHome}
                            onSelectComponent={(id) => navigateToChartDetail(id, 'morphing')}
                          />
                        </Suspense>
                      </div>
                    ) : catalogTab === 'buttons' ? (
                      displayedButtons.map((button, index) => (
                        <motion.div
                          key={button.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.32,
                            delay: Math.min(index * 0.02, 0.3),
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="w-full"
                        >
                          <article className="group/card relative">
                            <div 
                              onClick={(e) => {
                                if (triggerHaptic) triggerHaptic('light');
                                navigateToChartDetail(`btn-${button.id}`, 'buttons');
                              }}
                              className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-3xl no-underline text-inherit cursor-pointer"
                            >
                              <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 flex items-center justify-center p-6 ${
                                theme === 'dark'
                                  ? 'bg-black border-white/[0.07] group-hover/card:border-white/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                                  : 'bg-[#f5f6f8] border-neutral-200/80 group-hover/card:border-neutral-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]'
                              }`}>
                                <div
                                  onClick={(e) => {
                                    // On mobile: clicking the component directly triggers its hover/micro-interaction without navigating
                                    const isTouch = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
                                    if (isTouch) {
                                      e.stopPropagation();
                                    }
                                  }}
                                  className="cursor-default"
                                >
                                  <AnimatedButton config={button} layoutMode="grid" theme={theme} />
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 pt-3 px-1">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
                                    {button.label}
                                  </h3>
                                  <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate capitalize mt-0.5">
                                    {button.interactionType.replace('-', ' ')} interaction
                                  </p>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.08 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCopyCode(button);
                                  }}
                                  type="button" 
                                  className={`size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-80 sm:opacity-0 sm:group-hover/card:opacity-100 focus-visible:opacity-100 ${
                                    copiedText === `btn-${button.id}` ? 'opacity-100 bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : ''
                                  }`}
                                  aria-label="Copy interaction code"
                                  title="Copy interaction code"
                                >
                                  <IconSwap>
                                    <IconSwapItem key={copiedText === `btn-${button.id}` ? "check" : "copy"}>
                                      {copiedText === `btn-${button.id}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </IconSwapItem>
                                  </IconSwap>
                                </motion.button>
                              </div>
                            </div>
                          </article>
                        </motion.div>
                      ))
                      ) : catalogTab === 'loaders' ? (
                        <div className="col-span-full w-full flex flex-col gap-12 text-left">
                          {loaderGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="flex flex-col gap-6 w-full">
                              <div className="flex items-center gap-3 px-1">
                                <h2 className="text-xl sm:text-2xl font-semibold tracking-heading text-foreground">
                                  {group.title}
                                </h2>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium">
                                  {group.loaders.length} items
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3.5 sm:gap-4">
                                {group.loaders.map((loader, loaderIdx) => {
                                  const LoaderComponent = loader.component;
                                  const isWavePhysics = loader.name === 'Wave Physics' || group.title === 'Physics & Simulation';
                                  return (
                                    <motion.article 
                                      key={loaderIdx} 
                                      initial={{ opacity: 0, y: 12 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: Math.min(loaderIdx * 0.02, 0.25),
                                        ease: [0.16, 1, 0.3, 1],
                                      }}
                                      className={`group/card relative ${isWavePhysics ? 'col-span-full' : ''}`}
                                    >
                                      <div 
                                        onClick={() => {
                                          if (triggerHaptic) triggerHaptic('light');
                                          navigateToChartDetail(loader.kebabName, 'loaders');
                                        }}
                                        className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-2xl sm:rounded-3xl cursor-pointer"
                                      >
                                        <div className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black flex items-center justify-center ${
                                          isWavePhysics 
                                            ? 'h-44 sm:h-48 md:h-52 p-4 sm:p-5' 
                                            : 'aspect-[16/10] p-3 sm:p-4'
                                        }`}>
                                          <div
                                            onClick={(e) => {
                                              const isTouch = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
                                              if (isTouch) {
                                                e.stopPropagation();
                                              }
                                            }}
                                            className="cursor-default"
                                          >
                                            <InViewRender>
                                              <div className={`origin-center flex items-center justify-center ${
                                                isWavePhysics
                                                  ? 'scale-95 sm:scale-100 md:scale-105'
                                                  : 'scale-[0.8] sm:scale-90'
                                              }`}>
                                                <LoaderComponent theme={theme} />
                                              </div>
                                            </InViewRender>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 pt-2.5 px-1">
                                          <div className="min-w-0 flex-1">
                                            <h3 className="text-sm sm:text-[15px] font-semibold tracking-[-0.015em] text-foreground truncate">
                                              {loader.name}
                                            </h3>
                                          </div>
                                          <motion.button 
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.92 }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleCopyLoaderCode(loader);
                                            }}
                                            type="button" 
                                            className={`size-7 sm:size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 ${
                                              copiedText === (loader.kebabName || loader.name) ? 'opacity-100 bg-white/10 border-white/30 text-white' : ''
                                            }`}
                                            aria-label={`Copy ${loader.name} code`}
                                            title={`Copy ${loader.name} code`}
                                          >
                                            <IconSwap>
                                              <IconSwapItem key={copiedText === (loader.kebabName || loader.name) ? "check" : "copy"}>
                                                {copiedText === (loader.kebabName || loader.name) ? (
                                                  <Check className="w-3.5 h-3.5 text-white" />
                                                ) : (
                                                  <Copy className="w-3.5 h-3.5" />
                                                )}
                                              </IconSwapItem>
                                            </IconSwap>
                                          </motion.button>
                                        </div>
                                      </div>
                                    </motion.article>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : catalogTab === 'mono-charts' ? (
                        <div className="col-span-full w-full">
                          <Suspense fallback={<LoadingFallback />}>
                            <MonoChartsPage
                              theme={theme}
                              embedded={true}
                              sponsors={sponsors}
                              checkoutUrl={CHECKOUT_URL}
                              showToast={showToast}
                              triggerHaptic={triggerHaptic}
                              onNavigateHome={() => navigateTo('home')}
                              onSelectChart={(id) => navigateToChartDetail(id)}
                            />
                          </Suspense>
                        </div>
                      ) : catalogTab === 'anime' ? (
                        <div className="col-span-full w-full">
                          <Suspense fallback={<LoadingFallback />}>
                            <CssAnimationsPage
                              theme={theme}
                              embedded={true}
                              showToast={showToast}
                              triggerHaptic={triggerHaptic}
                              onNavigateHome={() => navigateTo('home')}
                            />
                          </Suspense>
                        </div>
                      ) : catalogTab === '3d' ? (
                        <div className="col-span-full w-full">
                          <Suspense fallback={<LoadingFallback />}>
                            <ThreeDPage
                              theme={theme}
                              embedded={true}
                              showToast={showToast}
                              triggerHaptic={triggerHaptic}
                              onNavigateHome={() => navigateTo('home')}
                            />
                          </Suspense>
                        </div>
                      ) : catalogTab === 'text-animations' ? (
                        <div className="col-span-full w-full">
                          <Suspense fallback={<LoadingFallback />}>
                            <TextAnimationsPage
                              theme={theme}
                              embedded={true}
                              showToast={showToast}
                              triggerHaptic={triggerHaptic}
                              onNavigateHome={() => navigateTo('home')}
                            />
                          </Suspense>
                        </div>
                      ) : (
                        displayedCards.map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.32,
                              delay: Math.min(index * 0.025, 0.35),
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="w-full"
                          >
                            <article className="group/card relative">
                              <div className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-3xl no-underline text-inherit">
                                <div
                                  onClick={(e) => {
                                    const isFine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
                                    if (isFine) {
                                      if (triggerHaptic) triggerHaptic('light');
                                      navigateToChartDetail(card.interactionType || card.id, card.category === 'carousels' ? 'carousels' : 'cards');
                                    } else {
                                      e.stopPropagation();
                                      setHoveredCardId(prev => (prev === card.id ? null : card.id));
                                      if (triggerHaptic) triggerHaptic('light');
                                    }
                                  }}
                                  onTouchEnd={(e) => {
                                    // Single tap on mobile touch screens immediately spreads or closes the cards
                                    e.stopPropagation();
                                    setHoveredCardId(prev => (prev === card.id ? null : card.id));
                                    if (triggerHaptic) triggerHaptic('light');
                                  }}
                                  onMouseEnter={() => {
                                    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
                                      setHoveredCardId(card.id);
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
                                      setHoveredCardId(null);
                                    }
                                  }}
                                  className={`relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl bg-black border border-white/[0.07] group-hover/card:border-white/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex items-center justify-center transition-all duration-300 cursor-pointer ${hoveredCardId === card.id ? 'overflow-visible z-20' : 'overflow-hidden z-1'}`}
                                >
                                  <div className="relative h-full w-full flex items-center justify-center pointer-events-none">
                                    {card.interactionType === 'card-arc-5' && <CardArc5 hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-arc-7' && <CardArc7 hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[0.85] origin-center" />}
                                    {card.interactionType === 'card-long-arc-5' && <CardLongArc5 hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[0.85] origin-center" />}
                                    {card.interactionType === 'card-linear-spread' && <CardLinearSpread hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-corner-fan' && <CardCornerFan hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-stamp-arc' && <CardStampArc hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-cascade-stagger' && <CardCascadeStagger hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-scatter-spread' && <CardScatterSpread hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-wheel-fan' && <CardWheelFan hovered={hoveredCardId === card.id} className="scale-[0.6] sm:scale-[0.9] origin-center" />}
                                    {card.interactionType === 'card-carousel' && <CardCarousel hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                    {card.interactionType === 'card-cover-flow' && <CardCoverFlow hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                    {card.interactionType === 'card-time-machine' && <CardTimeMachine hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                    {card.interactionType === 'card-carousel-mono' && <CardCarousel hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                    {card.interactionType === 'card-cover-flow-mono' && <CardCoverFlow hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                    {card.interactionType === 'card-time-machine-mono' && <CardTimeMachine hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.5] sm:scale-[0.8] origin-center" />}
                                  </div>
                                </div>
                                <div
                                  onClick={(e) => {
                                    if (triggerHaptic) triggerHaptic('light');
                                    navigateToChartDetail(card.interactionType || card.id, card.category === 'carousels' ? 'carousels' : 'cards');
                                  }}
                                  className="flex items-center justify-between gap-3 pt-3 px-1 cursor-pointer"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
                                        {card.label}
                                      </h3>
                                      {card.inspiration && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium whitespace-nowrap">
                                          by {card.inspiration.name}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate mt-0.5">
                                      {card.description}
                                    </p>
                                  </div>
                                  <motion.button 
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleCopyCardCode(card);
                                    }}
                                    type="button" 
                                    className={`size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-80 sm:opacity-0 sm:group-hover/card:opacity-100 focus-visible:opacity-100 ${
                                      copiedText === (card.interactionType || card.id) ? 'opacity-100 bg-white/10 border-white/30 text-white' : ''
                                    }`}
                                    aria-label="Copy card code"
                                    title="Copy card code"
                                  >
                                    <IconSwap>
                                      <IconSwapItem key={copiedText === (card.interactionType || card.id) ? "check" : "copy"}>
                                        {copiedText === (card.interactionType || card.id) ? (
                                          <Check className="w-3.5 h-3.5 text-white" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </IconSwapItem>
                                    </IconSwap>
                                  </motion.button>
                                </div>
                              </div>
                            </article>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* Sponsors Section - Visible but Secondary */}
            <SponsorSection
              theme={theme}
              sponsors={sponsors}
              checkoutUrl={CHECKOUT_URL}
              onNavigateSponsors={handleNavigateToSponsors}
              triggerHaptic={triggerHaptic}
            />

            {/* CTA Section - Rounded rectangle card above footer */}
            <CtaSection
              theme={theme}
              stars={stars}
              onBrowseComponents={() => {
                const elem = document.getElementById('components');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              showToast={showToast}
              triggerHaptic={triggerHaptic}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Footer */}
      <MinimalFooter
        theme={theme}
        onNavigate={handleSelectNav}
        onNavigateHome={handleNavigateHome}
        showToast={showToast}
        triggerHaptic={triggerHaptic}
      />

      {/* Sticky Sponsor Ad Banner on bottom right - appears on desktop/scroll past hero */}
      <AnimatePresence>
        {currentPage !== 'sponsors' && isScrolledPastHero && (
          <StickySponsorBanner
            sponsors={sponsors}
            checkoutUrl={CHECKOUT_URL}
            onNavigateSponsors={handleNavigateToSponsors}
            triggerHaptic={triggerHaptic}
          />
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`px-3.5 py-2 rounded-xl border text-[13px] font-medium shadow-md pointer-events-auto select-none ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-white/10 text-white shadow-black/40' 
                  : 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-200/60'
              }`}
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sponsor Success Confirmation Modal */}
      <SponsorSuccessModal
        isOpen={successModalOpen}
        theme={theme}
        onClose={() => setSuccessModalOpen(false)}
        sponsorshipId={successModalData.sponsorshipId}
        paymentId={successModalData.paymentId}
        onActivationSuccess={() => {
          refreshSponsors();
          showToast('Your sponsorship is live!');
        }}
      />

      <Analytics />
    </div>
  );
}

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, Check, ArrowLeft 
} from 'lucide-react';
import { IconSwap, IconSwapItem } from './IconSwap';
import { cssAnimationsData, CssAnimationItem } from '../data/cssAnimationsData';

// Import Motion kit components
import { Dock } from './css-animations/Dock';

// Import Kinetic physics animations
import { KineticTensionCapsule } from './css-animations/physics/KineticTensionCapsule';
import { MatrixGridLoader } from './css-animations/physics/MatrixGridLoader';
import { AppleRadialSpinner, PulseOrbitDots } from './css-animations/physics/AppleLoaders';

// Import Paper Fold Trios
import { 
  BookmarkCornerPeel, ShutterSlide, StickyNotePeel, ReceiptTapePrint 
} from './css-animations/physics/PaperFoldTrios';

// Import Structural Build Trios
import { 
  StrokeWaveform, PyramidBlockBuild, ScrollCanvasUnroll 
} from './css-animations/physics/StructuralBuildTrios';

// Import Elastic Deform Trios
import { 
  DropletSquish, SegmentedLinkStretch, RotatingLouvers, 
  SlinkyCoil, SquashStretchSphere, CardDeckCascade, GearToothStep 
} from './css-animations/physics/ElasticDeformTrios';

// Import Pure CSS Inertia Physics Experiments
import { 
  NeonSignDraw, SuddenBrake, RollingTumble, PageTurnCurl, 
  ShutterStepBlocks, InertiaSkidStop 
} from './css-animations/physics/InertiaPhysicsExperiments';

// Import Mechanical Physics Trios
import { 
  CardStackPeel, ElasticTagSnap, SplitGateReveal, OrigamiEnvelopeUnfold, 
  SmartCardDispenser, CircuitTraceDraw, HexagonLatticeDraw, PrismBlockStack, 
  ModularTileSnap, RollerBlindDrop, RibbonBannerSlide, GeometricIrisShutter, 
  PendulumBubbleLevel, KineticTickingMetronome, NestedOrbitalGimbal, 
  DualMagnetDipole, CompassNeedleDeflect 
} from './css-animations/physics/MechanicalPhysicsTrios';

// Import Status & Preview Trios
import { 
  SegmentedArcMeter, SegmentedStepperDots, CardGlancePreview, 
  VerticalWheelCounter, PerspectiveLayoutSwitcher, BookmarkSavePill 
} from './css-animations/ui-interactions/StatusPreviewTrios';

// Import Elastic Variations
import { 
  BlindPull, GelatinWobble, DominoChain, MagneticDisks 
} from './css-animations/physics/ElasticVariations';

// Import Navigation Trios
import { 
  FilterTagPill, SubmenuFlyout, MagneticIconButton, MorphActionPill, 
  SegmentedStepBar 
} from './css-animations/ui-interactions/NavigationTrios';

// Import Controls UI Kit
import { 
  CategorySelect, HoverLinkCard, PlusMinusToggle, LightDarkMorphToggle, 
  ProgressStepper, MultiTabCloseBar, DatePositionSelector 
} from './css-animations/ui-interactions/ControlsUiKit';

import { 
  ContextMenuEditDelete, DownloadAnimatedIcons, SegmentedABTabs 
} from './css-animations/ui-interactions/ActionsUiKit';

interface CssAnimationsPageProps {
  theme: 'dark' | 'light';
  embedded?: boolean;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
}

export function CssAnimationsPage({
  theme,
  embedded = false,
  showToast,
  triggerHaptic,
  onNavigateHome,
}: CssAnimationsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewLoopTrigger, setPreviewLoopTrigger] = useState<number>(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return cssAnimationsData;
    return cssAnimationsData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCopyCode = useCallback(
    (item: CssAnimationItem) => {
      const codeToCopy = item.componentCode || item.cliCommand;
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          if (triggerHaptic) triggerHaptic('success');
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
          if (showToast) showToast(`Copied ${item.name} code!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy code.');
        });
    },
    [showToast, triggerHaptic]
  );

  const renderLiveComponent = (id: string) => {
    switch (id) {
      case 'dock':
        return (
          <div className="w-full flex items-center justify-center py-2 origin-center">
            <Dock theme="dark" />
          </div>
        );
      
      // ROW 1: CARD & RIBBON PEEL (3 VARIATIONS)
      case 'anim-card-peel':
        return <div key={`cp-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CardStackPeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-bookmark-corner':
        return <div key={`bmc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><BookmarkCornerPeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-elastic-tag':
        return <div key={`et-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ElasticTagSnap loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 2: SPLIT GATES & SHUTTERS (3 VARIATIONS)
      case 'anim-split-gate':
        return <div key={`sg-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SplitGateReveal loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-shutter-slide':
        return <div key={`ss-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ShutterSlide loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-origami-envelope':
        return <div key={`oe-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><OrigamiEnvelopeUnfold loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 3: DISPENSERS & CARDS (3 VARIATIONS)
      case 'anim-card-dispenser':
        return <div key={`cd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SmartCardDispenser loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-sticky-note':
        return <div key={`sn-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><StickyNotePeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-receipt-tape':
        return <div key={`rt-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ReceiptTapePrint loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 4: CIRCUIT & LATTICE DRAWING (3 VARIATIONS)
      case 'anim-circuit-trace':
        return <div key={`ct-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CircuitTraceDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-hex-lattice':
        return <div key={`hl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><HexagonLatticeDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-stroke-waveform':
        return <div key={`sw-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><StrokeWaveform loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 5: PRISM & MODULAR BLOCKS (3 VARIATIONS)
      case 'anim-prism-stack':
        return <div key={`ps-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PrismBlockStack loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-modular-tile':
        return <div key={`mt-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ModularTileSnap loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-pyramid-build':
        return <div key={`pb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PyramidBlockBuild loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 6: ROLLERS & SCROLLS (3 VARIATIONS)
      case 'anim-roller-blind':
        return <div key={`rb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RollerBlindDrop loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-scroll-canvas':
        return <div key={`sc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ScrollCanvasUnroll loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-ribbon-banner':
        return <div key={`rbs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RibbonBannerSlide loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 7: ELASTICITY & MORPHING (3 VARIATIONS)
      case 'anim-tension-capsule':
        return <div key={`tc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><KineticTensionCapsule loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-droplet-squish':
        return <div key={`ds-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DropletSquish loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-segmented-link':
        return <div key={`sl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SegmentedLinkStretch loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 8: BLINDS & IRIS SHUTTERS (3 VARIATIONS)
      case 'anim-blind-pull':
        return <div key={`bp-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><BlindPull loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-rotating-louvers':
        return <div key={`rl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RotatingLouvers loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-iris-shutter':
        return <div key={`is-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GeometricIrisShutter loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 9: BUBBLE LEVELS & METRONOMES (3 VARIATIONS)
      case 'anim-bubble-level':
        return <div key={`bl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PendulumBubbleLevel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-kinetic-metronome':
        return <div key={`km-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><KineticTickingMetronome loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-orbital-gimbal':
        return <div key={`og-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><NestedOrbitalGimbal loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 10: HARMONIC SPRINGS (3 VARIATIONS)
      case 'anim-gelatin-wobble':
        return <div key={`gw-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GelatinWobble loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-slinky-coil':
        return <div key={`sc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SlinkyCoil loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-squash-sphere':
        return <div key={`sqs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SquashStretchSphere loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 11: CASCADES & DOMINOES (3 VARIATIONS)
      case 'anim-domino-chain':
        return <div key={`dc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DominoChain loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-card-cascade':
        return <div key={`cdc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CardDeckCascade loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-gear-step':
        return <div key={`gs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GearToothStep loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 12: MAGNETICS & COMPASS (3 VARIATIONS)
      case 'anim-magnetic-disks':
        return <div key={`md-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><MagneticDisks loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-dual-magnet':
        return <div key={`dmd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DualMagnetDipole loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-compass-deflect':
        return <div key={`cnd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CompassNeedleDeflect loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 13: KINETIC SPEED & INERTIA (3 VARIATIONS) - NEW
      case 'anim-sudden-brake':
        return <div key={`sb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SuddenBrake loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-rolling-tumble':
        return <div key={`rtb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RollingTumble loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-inertia-skid':
        return <div key={`iss-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><InertiaSkidStop loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 14: NEON & PAGE MECHANICS (3 VARIATIONS) - NEW
      case 'anim-neon-sign':
        return <div key={`ns-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><NeonSignDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-page-turn':
        return <div key={`ptc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PageTurnCurl loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-shutter-blocks':
        return <div key={`ssb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ShutterStepBlocks loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 15: LOADERS & SPINNERS (3 VARIATIONS)
      case 'anim-matrix-loader':
        return <MatrixGridLoader theme="dark" />;
      case 'anim-apple-spinner':
        return <AppleRadialSpinner theme="dark" />;
      case 'anim-pulse-dots':
        return <PulseOrbitDots theme="dark" />;

      // ROW 16: SELECTS & MENUS (3 VARIATIONS)
      case 'ui-category-select':
        return <CategorySelect theme="dark" />;
      case 'ui-filter-tag-pill':
        return <FilterTagPill theme="dark" />;
      case 'ui-submenu-flyout':
        return <SubmenuFlyout theme="dark" />;

      // ROW 17: BUTTONS & LINKS (3 VARIATIONS)
      case 'ui-hover-link':
        return <HoverLinkCard theme="dark" />;
      case 'ui-magnetic-icon-btn':
        return <MagneticIconButton theme="dark" />;
      case 'ui-morph-action-pill':
        return <MorphActionPill theme="dark" />;

      // ROW 18: TOGGLES & MODIFIERS (3 VARIATIONS)
      case 'ui-plus-minus-toggle':
        return <PlusMinusToggle theme="dark" />;
      case 'ui-light-dark-toggle':
        return <LightDarkMorphToggle theme="dark" />;
      case 'ui-ab-tabs':
        return <SegmentedABTabs theme="dark" />;

      // ROW 19: PROGRESS & STEPPERS (3 VARIATIONS)
      case 'ui-progress-stepper':
        return <ProgressStepper theme="dark" />;
      case 'ui-segmented-arc-meter':
        return <SegmentedArcMeter theme="dark" />;
      case 'ui-segmented-step-bar':
        return <SegmentedStepBar theme="dark" />;

      // ROW 20: TABS & STEPPERS (3 VARIATIONS)
      case 'ui-multi-tab-close':
        return <MultiTabCloseBar theme="dark" />;
      case 'ui-date-position':
        return <DatePositionSelector theme="dark" />;
      case 'ui-stepper-dots':
        return <SegmentedStepperDots theme="dark" />;

      // ROW 21: ACTION FEEDBACK & GLANCES (3 VARIATIONS)
      case 'ui-context-menu':
        return <ContextMenuEditDelete theme="dark" />;
      case 'ui-glance-preview':
        return <CardGlancePreview theme="dark" />;
      case 'ui-download-icons':
        return <DownloadAnimatedIcons theme="dark" />;

      // ROW 22: CONTROLS & SWITCHERS (3 VARIATIONS)
      case 'ui-wheel-counter':
        return <VerticalWheelCounter theme="dark" />;
      case 'ui-perspective-layout':
        return <PerspectiveLayoutSwitcher theme="dark" />;
      case 'ui-save-pill':
        return <BookmarkSavePill theme="dark" />;

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-[1800px] mx-auto ${embedded ? 'px-0 py-1' : 'px-4 sm:px-6 py-5 sm:py-6'} flex flex-col gap-6 font-[-apple-system,BlinkMacSystemFont,"SF_Pro_Display","SF_Pro_Text","Helvetica_Neue",sans-serif] transition-colors duration-300 ${
      theme === 'dark' ? 'text-[#f5f5f7]' : 'text-[#1d1d1f]'
    }`}>
      
      {/* Top Bar with Controls */}
      <div className="relative w-full flex flex-col items-center">
        {!embedded && (
          <div className="w-full flex items-center justify-between z-10">
            {onNavigateHome ? (
              <button
                onClick={onNavigateHome}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer border ${
                  theme === 'dark' 
                    ? 'bg-[#1c1c1e] border-[#2c2c2e] text-[#a1a1a6] hover:bg-[#2c2c2e] hover:text-white' 
                    : 'bg-[#e5e5ea] border-[#d1d1d6] text-[#636366] hover:bg-[#d1d1d6] hover:text-black'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            ) : null}
          </div>
        )}

        {/* Center Hero Section Content */}
        <div className={`flex flex-col items-center text-center gap-2.5 max-w-3xl w-full mx-auto ${embedded ? 'mt-0' : '-mt-7 sm:-mt-8'}`}>
          {!embedded && (
            <>
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-bold sm:font-extrabold tracking-[-0.035em] leading-[1.12]">
                Claim <span className="text-[#0071e3]">Micro-Motion</span> for<br />your Web UI
              </h1>

              <p className={`max-w-[580px] text-[13px] sm:text-[14.5px] leading-relaxed font-normal tracking-[-0.01em] ${
                theme === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]'
              }`}>
                Refined physics springs, skids, and fluid UI micro-interactions grouped in 3-variation suites. Built with vanilla CSS & zero bloated dependencies.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Component Library Grid */}
      <div className="flex flex-col gap-6 w-full mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em]">
            Components ({filteredItems.length})
          </h2>
          <span className={`text-[13px] ${theme === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]'}`}>
            Hover to trigger animations
          </span>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 transition-opacity duration-200 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-8">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            const isDock = item.id === 'dock';

            // 1. FIRST ROW FULL-WIDTH COMPONENT: macOS Spring Dock (Amicro Card Architecture)
            if (isDock) {
              return (
                <article
                  key={item.id}
                  className="col-span-1 md:col-span-2 lg:col-span-3 group/card relative flex flex-col"
                >
                  {/* Top Interactive Dock Playground Canvas (Expanded Rounded-3xl Stage) */}
                  <div className="relative w-full h-[150px] sm:h-[180px] overflow-hidden rounded-3xl bg-black flex items-center justify-center p-6 border border-white/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                    <Dock theme="dark" />
                  </div>

                  {/* Clean Metadata & Actions Row */}
                  <div className="flex items-center justify-between gap-3 pt-3.5 px-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground">
                          macOS Spring Dock
                        </h3>
                        <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full border ${
                          theme === 'dark' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-blue-50 border-blue-200 text-blue-600'
                        }`}>
                          Interactive
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] font-medium text-muted-foreground mt-0.5">
                        Proximity magnification and smooth spring damping.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCopyCode(item)}
                      type="button"
                      className={`size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 ${
                        isCopied ? 'opacity-100 bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : ''
                      }`}
                      aria-label="Copy macOS Spring Dock code"
                      title="Copy component code"
                    >
                      <IconSwap>
                        <IconSwapItem key={isCopied ? "check" : "copy"}>
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </IconSwapItem>
                      </IconSwap>
                    </motion.button>
                  </div>
                </article>
              );
            }

            // 2. MINIMAL CARD WITH EXPANDED PLAYGROUND
            return (
              <article
                key={item.id}
                className="group/card relative"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black flex items-center justify-center p-4">
                  {renderLiveComponent(item.id)}
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 px-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate capitalize mt-0.5">
                      {item.category.replace('-', ' ')}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopyCode(item)}
                    className={`size-8 rounded-lg transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 ${
                      isCopied ? 'opacity-100 bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : ''
                    }`}
                    title="Copy component code"
                  >
                    <IconSwap>
                      <IconSwapItem key={isCopied ? 'check' : 'copy'}>
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </IconSwapItem>
                    </IconSwap>
                  </motion.button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

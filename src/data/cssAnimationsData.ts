export interface CssAnimationItem {
  id: string;
  name: string;
  category: 'all' | 'physics' | 'ui-kit' | 'loaders';
  description: string;
  cliCommand: string;
  componentCode: string;
}


export const cssAnimationsData: CssAnimationItem[] = [
  // Full-Width Showcase: macOS Spring Dock
  {
    id: 'dock',
    name: 'macOS Spring Dock',
    category: 'all',
    description: 'Proximity magnification and smooth spring damping.',
    cliCommand: 'npx @subhanhq/amicro@latest add physics-dock',
    componentCode: `// Spring dock with useMotionValue, useSpring distance scaling, and reorderable elements.`
  },

  // ROW 1: CARD & RIBBON PEEL (3 VARIATIONS)
  {
    id: 'anim-card-peel',
    name: 'Card Stack Peel',
    category: 'physics',
    description: 'Layered card index tab that peels down in 3D perspective to reveal underlay.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-stack-peel',
    componentCode: `// 3D perspective card peel fold with spring easing.`
  },
  {
    id: 'anim-bookmark-corner',
    name: 'Corner Dog-Ear Peel',
    category: 'physics',
    description: 'Folded paper corner peeling back to reveal underlying accent content.',
    cliCommand: 'npx @subhanhq/amicro@latest add bookmark-corner-peel',
    componentCode: `// Diagonal corner page peel fold with clip-path keyframe physics.`
  },
  {
    id: 'anim-elastic-tag',
    name: 'Elastic Tag Snap',
    category: 'physics',
    description: 'Minimalist luggage tag with bungee spring snap and vertical recoil.',
    cliCommand: 'npx @subhanhq/amicro@latest add elastic-tag-snap',
    componentCode: `// Bungee elastic tag snap with harmonic vertical damping.`
  },

  // ROW 2: SPLIT GATES & SHUTTERS (3 VARIATIONS)
  {
    id: 'anim-split-gate',
    name: 'Split Gate Reveal',
    category: 'physics',
    description: 'Precision vertical center-split security gate sliding apart.',
    cliCommand: 'npx @subhanhq/amicro@latest add split-gate-reveal',
    componentCode: `// Dual vertical sliding split gate panels.`
  },
  {
    id: 'anim-shutter-slide',
    name: 'Horizontal Shutter Slide',
    category: 'physics',
    description: 'Dual horizontal panels sliding apart to reveal underlying action badge.',
    cliCommand: 'npx @subhanhq/amicro@latest add shutter-slide',
    componentCode: `// Dual horizontal sliding shutter panels with smooth ease.`
  },
  {
    id: 'anim-origami-envelope',
    name: 'Origami Envelope Unfold',
    category: 'physics',
    description: 'Geometric triangular envelope flap opening with 3D perspective flip.',
    cliCommand: 'npx @subhanhq/amicro@latest add origami-envelope-unfold',
    componentCode: `// 3D perspective rotateX envelope flap unfold.`
  },

  // ROW 3: DISPENSERS & CARDS (3 VARIATIONS)
  {
    id: 'anim-card-dispenser',
    name: 'Smart Card Dispenser',
    category: 'physics',
    description: 'Credit card dispensing slot ejecting smart pass upwards on trigger.',
    cliCommand: 'npx @subhanhq/amicro@latest add smart-card-dispenser',
    componentCode: `// Ejection slot pushing smart card with spring overshoot.`
  },
  {
    id: 'anim-sticky-note',
    name: 'Sticky Note Peel',
    category: 'physics',
    description: 'Post-it memo note peeling upwards in 3D perspective from pad.',
    cliCommand: 'npx @subhanhq/amicro@latest add sticky-note-peel',
    componentCode: `// 3D perspective rotateX sheet peel with opacity transition.`
  },
  {
    id: 'anim-receipt-tape',
    name: 'Receipt Ticker Print',
    category: 'physics',
    description: 'Stepped ticker tape printing smoothly out of top dispenser slot.',
    cliCommand: 'npx @subhanhq/amicro@latest add receipt-tape-print',
    componentCode: `// Stepped height expand ticker paper dispenser animation.`
  },

  // ROW 4: CIRCUIT & LATTICE DRAWING (3 VARIATIONS)
  {
    id: 'anim-circuit-trace',
    name: 'Circuit Trace Draw',
    category: 'physics',
    description: 'PCB electrical circuit trace self-drawing with terminal node pulse.',
    cliCommand: 'npx @subhanhq/amicro@latest add circuit-trace-draw',
    componentCode: `// SVG electrical circuit trace drawing with stroke-dashoffset.`
  },
  {
    id: 'anim-hex-lattice',
    name: 'Hexagon Lattice Draw',
    category: 'physics',
    description: 'Self-assembling geometric hexagon wireframe stroke with loop wipe.',
    cliCommand: 'npx @subhanhq/amicro@latest add hex-lattice-draw',
    componentCode: `// Hexagon polygon drawing keyframe loop.`
  },
  {
    id: 'anim-stroke-waveform',
    name: 'Waveform Pulse Line',
    category: 'physics',
    description: 'Kinetic audio/cardiac pulse line self-drawing across horizontal axis.',
    cliCommand: 'npx @subhanhq/amicro@latest add stroke-waveform',
    componentCode: `// SVG cardiac pulse polyline drawing sequence.`
  },

  // ROW 5: PRISM & MODULAR BLOCKS (3 VARIATIONS)
  {
    id: 'anim-prism-stack',
    name: 'Prism Block Stack',
    category: 'physics',
    description: 'Geometric prism blocks dropping and stacking with weighted damping.',
    cliCommand: 'npx @subhanhq/amicro@latest add prism-block-stack',
    componentCode: `// Staggered falling prism blocks with spring settle.`
  },
  {
    id: 'anim-modular-tile',
    name: 'Modular Tile Snap',
    category: 'physics',
    description: 'Interlocking geometric square & pill modules snapping into place.',
    cliCommand: 'npx @subhanhq/amicro@latest add modular-tile-snap',
    componentCode: `// Modular tile scale and rotational snap keyframes.`
  },
  {
    id: 'anim-pyramid-build',
    name: 'Pyramid Block Build',
    category: 'physics',
    description: 'Triangular pyramid stacking base-to-peak with staggered spring pops.',
    cliCommand: 'npx @subhanhq/amicro@latest add pyramid-block-build',
    componentCode: `// Triangular staggered block scale-pop animation sequence.`
  },

  // ROW 6: ROLLERS & SCROLLS (3 VARIATIONS)
  {
    id: 'anim-roller-blind',
    name: 'Roller Blind Drop',
    category: 'physics',
    description: 'Minimalist architectural roller shade dropping smoothly from header.',
    cliCommand: 'npx @subhanhq/amicro@latest add roller-blind-drop',
    componentCode: `// Architectural roller blind expand keyframes.`
  },
  {
    id: 'anim-scroll-canvas',
    name: 'Scroll Canvas Unroll',
    category: 'physics',
    description: 'Dual-sided wooden scroll unrolling outward to display center message.',
    cliCommand: 'npx @subhanhq/amicro@latest add scroll-canvas-unroll',
    componentCode: `// Dual roller canvas expand keyframe animation.`
  },
  {
    id: 'anim-ribbon-banner',
    name: 'Ribbon Banner Slide',
    category: 'physics',
    description: 'Horizontal chevron badge sliding and unfolding from center.',
    cliCommand: 'npx @subhanhq/amicro@latest add ribbon-banner-slide',
    componentCode: `// Horizontal banner auto-width expansion keyframes.`
  },

  // ROW 7: ELASTICITY & MORPHING (3 VARIATIONS)
  {
    id: 'anim-tension-capsule',
    name: 'Kinetic Tension Capsule',
    category: 'physics',
    description: 'Dynamic rubber-band capsule stretching under high horizontal tension with nodal recoil.',
    cliCommand: 'npx @subhanhq/amicro@latest add kinetic-tension-capsule',
    componentCode: `// Horizontal tension stretch and rubber-band recoil keyframes with inner node separation.`
  },
  {
    id: 'anim-droplet-squish',
    name: 'Liquid Droplet Squish',
    category: 'physics',
    description: 'Vertical liquid capsule squishing on impact with spring recovery.',
    cliCommand: 'npx @subhanhq/amicro@latest add droplet-squish',
    componentCode: `// Vertical scale compression and harmonic droplet bounce.`
  },
  {
    id: 'anim-segmented-link',
    name: 'Segmented Link Stretch',
    category: 'physics',
    description: 'Multi-joint segmented pill chain expanding and snapping together.',
    cliCommand: 'npx @subhanhq/amicro@latest add segmented-link-stretch',
    componentCode: `// Gap stretch and recoil spring physics for segmented pills.`
  },

  // ROW 8: BLINDS & IRIS SHUTTERS (3 VARIATIONS)
  {
    id: 'anim-blind-pull',
    name: 'Accordion Blind Pull',
    category: 'physics',
    description: 'Horizontal slated blinds expanding downwards with tension cord pulling.',
    cliCommand: 'npx @subhanhq/amicro@latest add accordion-blind',
    componentCode: `// Accordion slat keyframes with variable translateY offsets.`
  },
  {
    id: 'anim-rotating-louvers',
    name: 'Rotating Louver Slats',
    category: 'physics',
    description: 'Horizontal architectural louvers tilting 0° to 75° in smooth sequence.',
    cliCommand: 'npx @subhanhq/amicro@latest add rotating-louvers',
    componentCode: `// 3D rotateX slat rotation with staggered offsets.`
  },
  {
    id: 'anim-iris-shutter',
    name: 'Geometric Iris Shutter',
    category: 'physics',
    description: 'Hexagonal camera shutter blades rotating and opening center aperture.',
    cliCommand: 'npx @subhanhq/amicro@latest add geometric-iris-shutter',
    componentCode: `// Interlocking iris blade rotation and expansion.`
  },

  // ROW 9: BUBBLE LEVELS & METRONOMES (3 VARIATIONS)
  {
    id: 'anim-bubble-level',
    name: 'Pendulum Bubble Level',
    category: 'physics',
    description: 'Precision spirit/bubble level balancing horizontally with fluid damping.',
    cliCommand: 'npx @subhanhq/amicro@latest add pendulum-bubble-level',
    componentCode: `// Fluid bubble oscillation and level settling.`
  },
  {
    id: 'anim-kinetic-metronome',
    name: 'Kinetic Metronome Tick',
    category: 'physics',
    description: 'Minimalist metronome pendulum ticking in harmonic angular rhythm.',
    cliCommand: 'npx @subhanhq/amicro@latest add kinetic-metronome-tick',
    componentCode: `// Inverted pendulum harmonic oscillation.`
  },
  {
    id: 'anim-orbital-gimbal',
    name: 'Nested Orbital Gimbal',
    category: 'physics',
    description: 'Dual square & circular concentric gimbal rings spinning in counter-phase.',
    cliCommand: 'npx @subhanhq/amicro@latest add nested-orbital-gimbal',
    componentCode: `// Counter-rotating concentric gimbal rings.`
  },

  // ROW 10: HARMONIC SPRINGS (3 VARIATIONS)
  {
    id: 'anim-gelatin-wobble',
    name: 'Gelatin Cube Wobble',
    category: 'physics',
    description: 'Squishy gelatin cube landing with vertical compression and harmonic bounce.',
    cliCommand: 'npx @subhanhq/amicro@latest add gelatin-wobble',
    componentCode: `// Multi-stage scale(1.4, 0.6) vertical compression and bouncing.`
  },
  {
    id: 'anim-slinky-coil',
    name: 'Slinky Coil Spring',
    category: 'physics',
    description: 'Layered horizontal coil spring extending and compressing with spring tension.',
    cliCommand: 'npx @subhanhq/amicro@latest add slinky-coil',
    componentCode: `// Vertical scale compression and extension spring stack.`
  },
  {
    id: 'anim-squash-sphere',
    name: 'Squash & Stretch Sphere',
    category: 'physics',
    description: 'Classic Disney 12-principles bouncy rubber ball with squash on impact.',
    cliCommand: 'npx @subhanhq/amicro@latest add squash-sphere',
    componentCode: `// Squash-and-stretch vertical bounce keyframe physics.`
  },

  // ROW 11: CASCADES & DOMINOES (3 VARIATIONS)
  {
    id: 'anim-domino-chain',
    name: 'Domino Cascade Fall',
    category: 'physics',
    description: 'Staggered 5 domino tiles tipping over sequentially with rotational inertia.',
    cliCommand: 'npx @subhanhq/amicro@latest add domino-cascade',
    componentCode: `// Staggered domino tilt keyframe chain.`
  },
  {
    id: 'anim-card-cascade',
    name: 'Card Deck Fan Cascade',
    category: 'physics',
    description: 'Fanning deck of 3 cards spreading out in radial hand formation.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-deck-cascade',
    componentCode: `// Radial card fan rotation and translation keyframes.`
  },
  {
    id: 'anim-gear-step',
    name: 'Interlocking Gear Step',
    category: 'physics',
    description: 'Dual interlocking mechanical gears rotating in synchronized counter-phase.',
    cliCommand: 'npx @subhanhq/amicro@latest add gear-tooth-step',
    componentCode: `// Synchronized CW and CCW mechanical gear rotations.`
  },

  // ROW 12: MAGNETICS & COMPASS (3 VARIATIONS)
  {
    id: 'anim-magnetic-disks',
    name: 'Magnetic Snap Disks',
    category: 'physics',
    description: 'Dual circular pills stretching toward each other before snapping together.',
    cliCommand: 'npx @subhanhq/amicro@latest add magnetic-disks',
    componentCode: `// Dual circular pill displacement and squishy scale collision.`
  },
  {
    id: 'anim-dual-magnet',
    name: 'Dual Magnet Dipole',
    category: 'physics',
    description: 'North/South magnetic dipole blocks attracting and snapping with tension.',
    cliCommand: 'npx @subhanhq/amicro@latest add dual-magnet-dipole',
    componentCode: `// Magnetic N/S dipole attraction gap animation.`
  },
  {
    id: 'anim-compass-deflect',
    name: 'Compass Needle Deflect',
    category: 'physics',
    description: 'Magnetic compass needle swinging and deflecting with magnetic damping.',
    cliCommand: 'npx @subhanhq/amicro@latest add compass-needle-deflect',
    componentCode: `// Angular compass needle deflection and settling.`
  },

  // ROW 13: KINETIC SPEED & INERTIA (3 VARIATIONS) - NEW
  {
    id: 'anim-sudden-brake',
    name: 'Sudden Brake Skid',
    category: 'physics',
    description: 'High-speed incoming deceleration with severe backward skid tilt and bumper settle.',
    cliCommand: 'npx @subhanhq/amicro@latest add sudden-brake',
    componentCode: `// Sudden deceleration keyframes with rotational skidding physics.`
  },
  {
    id: 'anim-rolling-tumble',
    name: 'Rolling Tumble Physics',
    category: 'physics',
    description: 'Step-by-step rolling cube tumbling end over end with momentum rotation.',
    cliCommand: 'npx @subhanhq/amicro@latest add rolling-tumble',
    componentCode: `// Stepped 90-degree rolling cube translation and rotational physics.`
  },
  {
    id: 'anim-inertia-skid',
    name: 'Inertia Skid Stop',
    category: 'physics',
    description: 'Skewing inertia block sliding in with heavy friction deceleration.',
    cliCommand: 'npx @subhanhq/amicro@latest add inertia-skid-stop',
    componentCode: `// Horizontal skew and slide deceleration keyframes.`
  },

  // ROW 14: NEON & PAGE MECHANICS (3 VARIATIONS) - NEW
  {
    id: 'anim-neon-sign',
    name: 'Neon Sign Draw & Clear',
    category: 'physics',
    description: 'Self-drawing neon polyline stroke with progressive erase and clean reset.',
    cliCommand: 'npx @subhanhq/amicro@latest add neon-sign-draw',
    componentCode: `// SVG stroke-dasharray neon draw and clear keyframe animation.`
  },
  {
    id: 'anim-page-turn',
    name: 'Page Turn Curl',
    category: 'physics',
    description: 'Rising paper sheet with dynamic corner curling border-radius transition.',
    cliCommand: 'npx @subhanhq/amicro@latest add page-turn-curl',
    componentCode: `// 3D perspective rising paper sheet with curling border-radius.`
  },
  {
    id: 'anim-shutter-blocks',
    name: 'Shutter Step Slices',
    category: 'physics',
    description: 'Multi-tiered horizontal shutter blocks expanding in rapid staggered sequence.',
    cliCommand: 'npx @subhanhq/amicro@latest add shutter-step-slices',
    componentCode: `// Staggered horizontal scaleX shutter block slices.`
  },

  // ROW 15: LOADERS & SPINNERS (3 VARIATIONS)
  {
    id: 'anim-matrix-loader',
    name: 'Matrix Grid Loader',
    category: 'loaders',
    description: 'Straight 4-square grid with progressive solid blue glowing pulse animation.',
    cliCommand: 'npx @subhanhq/amicro@latest add matrix-grid-loader',
    componentCode: `// Pure CSS 4-square grid loader with keyframe blue pulse.`
  },
  {
    id: 'anim-apple-spinner',
    name: 'Radial System Spinner',
    category: 'loaders',
    description: 'Apple macOS 8-bar radial activity indicator with stepped opacity decay.',
    cliCommand: 'npx @subhanhq/amicro@latest add radial-spinner',
    componentCode: `// 8-spoke rotating activity indicator with staggered opacity keyframes.`
  },
  {
    id: 'anim-pulse-dots',
    name: 'Pulse Orbit Dots',
    category: 'loaders',
    description: 'Three solid blue circular dots pulsing with progressive phase shifts.',
    cliCommand: 'npx @subhanhq/amicro@latest add pulse-dots',
    componentCode: `// 3-dot harmonic scaling loader with staggered delay sequences.`
  },

  // ROW 16: SELECTS & MENUS (3 VARIATIONS)
  {
    id: 'ui-category-select',
    name: 'Category Dropdown',
    category: 'ui-kit',
    description: 'Soft rounded dropdown menu with gentle downward slide and rotating arrow.',
    cliCommand: 'npx @subhanhq/amicro@latest add category-select',
    componentCode: `// Rounded dropdown menu with AnimatePresence downward slide.`
  },
  {
    id: 'ui-filter-tag-pill',
    name: 'Floating Filter Tag Pill',
    category: 'ui-kit',
    description: 'Segmented filter tag pill selector with smooth sliding backdrop.',
    cliCommand: 'npx @subhanhq/amicro@latest add filter-tag-pill',
    componentCode: `// Segmented filter tag selector with layoutId spring sliding.`
  },
  {
    id: 'ui-submenu-flyout',
    name: 'Submenu Flyout Panel',
    category: 'ui-kit',
    description: 'Flyout context panel expanding outward with horizontal spring slide.',
    cliCommand: 'npx @subhanhq/amicro@latest add submenu-flyout',
    componentCode: `// Horizontal flyout submenu panel with AnimatePresence.`
  },

  // ROW 17: BUTTONS & LINKS (3 VARIATIONS)
  {
    id: 'ui-hover-link',
    name: 'Hover Link Card',
    category: 'ui-kit',
    description: 'Rounded pill button labeled "Portfolio" with hover scale-up and floating URL.',
    cliCommand: 'npx @subhanhq/amicro@latest add hover-link-card',
    componentCode: `// Pill button with hover scale-up (1.05x) and floating tooltip.`
  },
  {
    id: 'ui-magnetic-icon-btn',
    name: 'Magnetic Slide Button',
    category: 'ui-kit',
    description: 'Arrow button that slides horizontally on hover with subtle tactile lift.',
    cliCommand: 'npx @subhanhq/amicro@latest add magnetic-slide-btn',
    componentCode: `// Magnetic arrow slide button with spring motion feedback.`
  },
  {
    id: 'ui-morph-action-pill',
    name: 'Morph Action Expand Pill',
    category: 'ui-kit',
    description: 'Compact action pill that expands on hover to reveal launch indicator.',
    cliCommand: 'npx @subhanhq/amicro@latest add morph-action-pill',
    componentCode: `// Layout-animating expand pill with auto-width transition.`
  },

  // ROW 18: TOGGLES & MODIFIERS (3 VARIATIONS)
  {
    id: 'ui-plus-minus-toggle',
    name: 'Plus / Minus Toggle',
    category: 'ui-kit',
    description: 'Dual square toggle buttons with solid color fills and spring micro-bounce.',
    cliCommand: 'npx @subhanhq/amicro@latest add plus-minus-toggle',
    componentCode: `// Dual square toggle buttons with smooth solid color transition.`
  },
  {
    id: 'ui-light-dark-toggle',
    name: 'Light / Dark Mode Toggle',
    category: 'ui-kit',
    description: 'Circular icon that morphs between bright sun and crescent moon with rotation.',
    cliCommand: 'npx @subhanhq/amicro@latest add light-dark-morph',
    componentCode: `// Morphing Sun/Moon toggle with spring rotation.`
  },
  {
    id: 'ui-ab-tabs',
    name: 'A / B Segmented Tabs',
    category: 'ui-kit',
    description: 'Segmented control where active letter (A or B) slides into a solid pill.',
    cliCommand: 'npx @subhanhq/amicro@latest add ab-segmented-tabs',
    componentCode: `// Segmented A/B pill selector with smooth horizontal layout slide.`
  },

  // ROW 19: PROGRESS & STEPPERS (3 VARIATIONS)
  {
    id: 'ui-progress-stepper',
    name: 'Progress Stepper',
    category: 'ui-kit',
    description: 'Horizontal step line (STEP 1 → STEP 2 → STEP 3) with animated fill bar.',
    cliCommand: 'npx @subhanhq/amicro@latest add progress-stepper',
    componentCode: `// Horizontal timeline with smooth active node expansion.`
  },
  {
    id: 'ui-segmented-arc-meter',
    name: 'Segmented Arc Meter',
    category: 'ui-kit',
    description: 'Stepped 4-bar discrete vertical gauge with percentage readout.',
    cliCommand: 'npx @subhanhq/amicro@latest add segmented-arc-meter',
    componentCode: `// Discrete stepped level meter with scaling animation.`
  },
  {
    id: 'ui-segmented-step-bar',
    name: 'Segmented Step Bar',
    category: 'ui-kit',
    description: 'Battery-style multi-segment discrete progress bar with stepped fill.',
    cliCommand: 'npx @subhanhq/amicro@latest add segmented-step-bar',
    componentCode: `// Discrete multi-segment step indicator.`
  },

  // ROW 20: TABS & STEPPERS (3 VARIATIONS)
  {
    id: 'ui-multi-tab-close',
    name: 'Tab Bar with Close',
    category: 'ui-kit',
    description: 'Horizontal tabs with shrinking slide-away close animations and "+" expander.',
    cliCommand: 'npx @subhanhq/amicro@latest add multi-tab-bar',
    componentCode: `// Horizontal tab strip with AnimatePresence close shrinkage.`
  },
  {
    id: 'ui-date-position',
    name: 'Date Position Selector',
    category: 'ui-kit',
    description: 'Three consecutive day numbers (24th, 25th, 26th) with sliding highlight pill.',
    cliCommand: 'npx @subhanhq/amicro@latest add date-position-selector',
    componentCode: `// Consecutive date selector with smooth sliding layoutId background pill.`
  },
  {
    id: 'ui-stepper-dots',
    name: 'Segmented Stepper Dots',
    category: 'ui-kit',
    description: 'Pill-morphing connected page dots with spring expansion indicator.',
    cliCommand: 'npx @subhanhq/amicro@latest add segmented-stepper-dots',
    componentCode: `// Morphing active pill pagination dots.`
  },

  // ROW 21: ACTION FEEDBACK & GLANCES (3 VARIATIONS)
  {
    id: 'ui-context-menu',
    name: 'Actions Context Menu',
    category: 'ui-kit',
    description: 'Rounded popup menu containing Edit and Delete with soft scale and fade-in.',
    cliCommand: 'npx @subhanhq/amicro@latest add context-menu',
    componentCode: `// Soft context popup with edit/delete actions and AnimatePresence scale.`
  },
  {
    id: 'ui-glance-preview',
    name: 'Card Glance Preview',
    category: 'ui-kit',
    description: 'Micro floating glance card popup with status indicator dot.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-glance-preview',
    componentCode: `// Interactive glance card overlay with spring entrance.`
  },
  {
    id: 'ui-download-icons',
    name: 'Download Progress Icons',
    category: 'ui-kit',
    description: 'Download arrow icons with downward bounce and checkmark completion.',
    cliCommand: 'npx @subhanhq/amicro@latest add download-icons',
    componentCode: `// Dual download icons with animated vertical drop and status morph.`
  },

  // ROW 22: CONTROLS & SWITCHERS (3 VARIATIONS)
  {
    id: 'ui-wheel-counter',
    name: 'Vertical Wheel Counter',
    category: 'ui-kit',
    description: 'Vertical cylinder tumbler wheel number scroll with stepper buttons.',
    cliCommand: 'npx @subhanhq/amicro@latest add vertical-wheel-counter',
    componentCode: `// Vertical cylinder number scroll transition.`
  },
  {
    id: 'ui-perspective-layout',
    name: 'Perspective Layout Switcher',
    category: 'ui-kit',
    description: 'Interactive toggle switching between Grid and 3D Stack layout icons.',
    cliCommand: 'npx @subhanhq/amicro@latest add perspective-layout-switcher',
    componentCode: `// Rotating perspective view layout switcher.`
  },
  {
    id: 'ui-save-pill',
    name: 'Bookmark Save Pill',
    category: 'ui-kit',
    description: 'Interactive Save / Saved state pill toggle with icon morph.',
    cliCommand: 'npx @subhanhq/amicro@latest add bookmark-save-pill',
    componentCode: `// Bookmark save state pill with animated checkmark.`
  }
];

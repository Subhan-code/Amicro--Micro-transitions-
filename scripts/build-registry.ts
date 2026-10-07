import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:hook' | 'registry:lib';
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

const registryItems: RegistryItem[] = [
  // --- ENTRANCE ---
  {
    name: 'fade-in',
    type: 'registry:ui',
    title: 'Fade In',
    description: 'Basic fade entrance animation.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/fade-in.tsx', type: 'registry:ui', target: '@components/amicro/fade-in.tsx' }]
  },
  {
    name: 'fade-up',
    type: 'registry:ui',
    title: 'Fade Up',
    description: 'Fade with upward translation.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/fade-up.tsx', type: 'registry:ui', target: '@components/amicro/fade-up.tsx' }]
  },
  {
    name: 'fade-down',
    type: 'registry:ui',
    title: 'Fade Down',
    description: 'Fade with downward translation.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/fade-down.tsx', type: 'registry:ui', target: '@components/amicro/fade-down.tsx' }]
  },
  {
    name: 'slide-left',
    type: 'registry:ui',
    title: 'Slide Left',
    description: 'Slide in from right to left.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/slide-left.tsx', type: 'registry:ui', target: '@components/amicro/slide-left.tsx' }]
  },
  {
    name: 'slide-right',
    type: 'registry:ui',
    title: 'Slide Right',
    description: 'Slide in from left to right.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/slide-right.tsx', type: 'registry:ui', target: '@components/amicro/slide-right.tsx' }]
  },
  {
    name: 'scale-in',
    type: 'registry:ui',
    title: 'Scale In',
    description: 'Scale transition from small to actual size.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/scale-in.tsx', type: 'registry:ui', target: '@components/amicro/scale-in.tsx' }]
  },
  {
    name: 'zoom-in',
    type: 'registry:ui',
    title: 'Zoom In',
    description: 'Scale transition combined with deep blur/depth effect.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/entrance/zoom-in.tsx', type: 'registry:ui', target: '@components/amicro/zoom-in.tsx' }]
  },

  // --- TEXT ---
  {
    name: 'text-reveal',
    type: 'registry:ui',
    title: 'Text Reveal',
    description: 'Line-by-line slide/reveal text effect.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/text/text-reveal.tsx', type: 'registry:ui', target: '@components/amicro/text-reveal.tsx' }]
  },
  {
    name: 'word-reveal',
    type: 'registry:ui',
    title: 'Word Reveal',
    description: 'Word-by-word fade and scale stagger reveal effect.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/text/word-reveal.tsx', type: 'registry:ui', target: '@components/amicro/word-reveal.tsx' }]
  },
  {
    name: 'blur-text',
    type: 'registry:ui',
    title: 'Blur Text',
    description: 'Blur transition for text container/headings.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/text/blur-text.tsx', type: 'registry:ui', target: '@components/amicro/blur-text.tsx' }]
  },
  {
    name: 'character-stagger',
    type: 'registry:ui',
    title: 'Character Stagger',
    description: 'Character-by-character radial or linear stagger animation.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/text/character-stagger.tsx', type: 'registry:ui', target: '@components/amicro/character-stagger.tsx' }]
  },

  // --- HOVER ---
  {
    name: 'card-hover',
    type: 'registry:ui',
    title: 'Card Hover',
    description: 'Dynamic floating card effect on hover.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/hover/card-hover.tsx', type: 'registry:ui', target: '@components/amicro/card-hover.tsx' }]
  },
  {
    name: 'tilt-card',
    type: 'registry:ui',
    title: 'Tilt Card',
    description: '3D parallax tilt effect following mouse cursor.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/hover/tilt-card.tsx', type: 'registry:ui', target: '@components/amicro/tilt-card.tsx' }]
  },
  {
    name: 'magnetic-button',
    type: 'registry:ui',
    title: 'Magnetic Button',
    description: 'A button that pulls slightly towards the user\'s cursor.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/hover/magnetic-button.tsx', type: 'registry:ui', target: '@components/amicro/magnetic-button.tsx' }]
  },
  {
    name: 'glow-button',
    type: 'registry:ui',
    title: 'Glow Button',
    description: 'Glow/border animation following the cursor.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/hover/glow-button.tsx', type: 'registry:ui', target: '@components/amicro/glow-button.tsx' }]
  },

  // --- CURSOR ---
  {
    name: 'cursor-trail',
    type: 'registry:ui',
    title: 'Cursor Trail',
    description: 'Custom cursor with particle/dots trail.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/cursor/cursor-trail.tsx', type: 'registry:ui', target: '@components/amicro/cursor-trail.tsx' }]
  },
  {
    name: 'spotlight',
    type: 'registry:ui',
    title: 'Spotlight',
    description: 'Masked spotlight highlighting container content on hover.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/cursor/spotlight.tsx', type: 'registry:ui', target: '@components/amicro/spotlight.tsx' }]
  },
  {
    name: 'mouse-follow',
    type: 'registry:ui',
    title: 'Mouse Follow',
    description: 'Smooth spring physics element trailing mouse cursor.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/cursor/mouse-follow.tsx', type: 'registry:ui', target: '@components/amicro/mouse-follow.tsx' }]
  },

  // --- SCROLL ---
  {
    name: 'scroll-reveal',
    type: 'registry:ui',
    title: 'Scroll Reveal',
    description: 'Reveal content block as it scrolls into viewport.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/scroll/scroll-reveal.tsx', type: 'registry:ui', target: '@components/amicro/scroll-reveal.tsx' }]
  },
  {
    name: 'progress-indicator',
    type: 'registry:ui',
    title: 'Progress Indicator',
    description: 'Horizontal page scroll progress indicator bar.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/scroll/progress-indicator.tsx', type: 'registry:ui', target: '@components/amicro/progress-indicator.tsx' }]
  },
  {
    name: 'sticky-reveal',
    type: 'registry:ui',
    title: 'Sticky Reveal',
    description: 'Apple-style scroll-linked side sticky content reveal.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/scroll/sticky-reveal.tsx', type: 'registry:ui', target: '@components/amicro/sticky-reveal.tsx' }]
  },

  // --- LOADING ---
  {
    name: 'skeleton',
    type: 'registry:ui',
    title: 'Skeleton',
    description: 'Loading skeleton with smooth shimmer sweep.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/loading/skeleton.tsx', type: 'registry:ui', target: '@components/amicro/skeleton.tsx' }]
  },
  {
    name: 'pulse',
    type: 'registry:ui',
    title: 'Pulse',
    description: 'Pulsing scaling animation for loading elements.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/loading/pulse.tsx', type: 'registry:ui', target: '@components/amicro/pulse.tsx' }]
  },
  {
    name: 'morph-loader',
    type: 'registry:ui',
    title: 'Morph Loader',
    description: 'Gooey/morphing shape loader.',
    dependencies: ['framer-motion'],
    files: [{ path: 'registry/ui/loading/morph-loader.tsx', type: 'registry:ui', target: '@components/amicro/morph-loader.tsx' }]
  },

  // --- HOOKS ---
  {
    name: 'use-scroll-progress',
    type: 'registry:hook',
    title: 'Use Scroll Progress',
    description: 'Calculates current page/container scroll progress percentage.',
    files: [{ path: 'registry/hooks/use-scroll-progress.ts', type: 'registry:hook', target: '@hooks/use-scroll-progress.ts' }]
  },
  {
    name: 'use-mouse-position',
    type: 'registry:hook',
    title: 'Use Mouse Position',
    description: 'Tracks target element mouse coordinate offsets.',
    files: [{ path: 'registry/hooks/use-mouse-position.ts', type: 'registry:hook', target: '@hooks/use-mouse-position.ts' }]
  },
  {
    name: 'use-stagger',
    type: 'registry:hook',
    title: 'Use Stagger',
    description: 'Calculates custom delays for child stagger layouts.',
    files: [{ path: 'registry/hooks/use-stagger.ts', type: 'registry:hook', target: '@hooks/use-stagger.ts' }]
  },
  {
    name: 'use-reduced-motion',
    type: 'registry:hook',
    title: 'Use Reduced Motion',
    description: 'Detects client system reduced motion media query standard.',
    files: [{ path: 'registry/hooks/use-reduced-motion.ts', type: 'registry:hook', target: '@hooks/use-reduced-motion.ts' }]
  },
  {
    name: 'use-web-haptics',
    type: 'registry:hook',
    title: 'Use Web Haptics',
    description: 'Provides responsive device haptic feedback and vibrations for web interfaces.',
    files: [{ path: 'registry/hooks/use-web-haptics.ts', type: 'registry:hook', target: '@hooks/use-web-haptics.ts' }]
  },

  // --- LIB ---
  {
    name: 'presets',
    type: 'registry:lib',
    title: 'Presets',
    description: 'A set of spring configuration presets for Motion.',
    files: [{ path: 'registry/lib/presets.ts', type: 'registry:lib', target: '@lib/presets.ts' }]
  },
  {
    name: 'utils',
    type: 'registry:lib',
    title: 'Utils',
    description: 'Motion utility functions (cn helper, mapRange).',
    dependencies: ['clsx', 'tailwind-merge'],
    files: [{ path: 'registry/lib/utils.ts', type: 'registry:lib', target: '@lib/utils.ts' }]
  }
];

// Dynamically discover and append other loading components from registry/ui/loading/
const loadingDir = path.join(WORKSPACE_ROOT, 'registry/ui/loading');
if (fs.existsSync(loadingDir)) {
  const files = fs.readdirSync(loadingDir);
  for (const file of files) {
    if (!file.endsWith('.tsx')) continue;
    const name = file.replace('.tsx', '');
    // Skip if already in registryItems
    if (registryItems.some(item => item.name === name)) continue;

    const filePath = path.join(loadingDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract description from comment e.g., "// 1. Classic Spinner (Apple Watch style)"
    let description = 'Vibrant dot loader animation.';
    const commentMatch = content.match(/\/\/\s*\d+\.\s*([^\r\n]+)/);
    if (commentMatch) {
      description = commentMatch[1].trim();
    } else {
      // Fallback for custom files like wave-physics-loader
      const nameWords = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      description = `${nameWords} loading animation.`;
    }

    const title = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    registryItems.push({
      name,
      type: 'registry:ui',
      title,
      description,
      dependencies: ['framer-motion'],
      files: [
        {
          path: `registry/ui/loading/${file}`,
          type: 'registry:ui',
          target: `components/amicro/${file}`
        }
      ]
    });
  }
}

// Dynamically discover transitions if any
const transitionsDir = path.join(WORKSPACE_ROOT, 'registry/ui/transitions');
if (fs.existsSync(transitionsDir)) {
  const files = fs.readdirSync(transitionsDir);
  for (const file of files) {
    if (!file.endsWith('.tsx')) continue;
    const name = file.replace('.tsx', '');
    if (registryItems.some(item => item.name === name)) continue;

    const title = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    registryItems.push({
      name,
      type: 'registry:ui',
      title,
      description: 'Dynamic fullscreen page transition animation.',
      dependencies: ['framer-motion'],
      files: [
        {
          path: `registry/ui/transitions/${file}`,
          type: 'registry:ui',
          target: `components/amicro/${file}`
        }
      ]
    });
  }
}

// Additional blocks/components from src/components/cards and dither-charts if present
const extraCards = [
  {
    name: 'card-carousel',
    type: 'registry:block' as const,
    title: 'Interactive 3D Carousel',
    description: 'An interactive arc-based 3D motion carousel featuring smooth dot indicators and dynamic prev/next controls.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/cards/CardCarousel.tsx', type: 'registry:component', target: 'components/amicro/CardCarousel.tsx' }]
  },
  {
    name: 'card-cover-flow',
    type: 'registry:block' as const,
    title: 'CoverFlow Carousel',
    description: 'A premium 3D CoverFlow carousel displaying cards along a perspective path.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/cards/CardCoverFlow.tsx', type: 'registry:component', target: 'components/amicro/CardCoverFlow.tsx' }]
  },
  {
    name: 'dither-donut-chart',
    type: 'registry:block' as const,
    title: 'Dither Donut Chart',
    description: 'Interactive pixelated dither donut chart with real-time spring physics.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/dither-charts/DitherDonutChart.tsx', type: 'registry:component', target: 'components/amicro/DitherDonutChart.tsx' }]
  },
  {
    name: 'dither-growth-chart',
    type: 'registry:block' as const,
    title: 'Dither Growth Chart',
    description: '60fps canvas growth line chart with pixel dither fill matrix.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/dither-charts/DitherGrowthChart.tsx', type: 'registry:component', target: 'components/amicro/DitherGrowthChart.tsx' }]
  },
  {
    name: 'uptime-chart',
    type: 'registry:block' as const,
    title: 'Uptime Dither Bar Chart',
    description: 'Continuous uptime bar chart with dithered matrix animation.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/dither-charts/UptimeChart.tsx', type: 'registry:component', target: 'components/amicro/UptimeChart.tsx' }]
  },
  {
    name: 'activity-heatmap',
    type: 'registry:block' as const,
    title: 'Activity Dither Heatmap',
    description: 'GitHub-style activity heatmap with interactive dither dots.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/dither-charts/ActivityHeatmap.tsx', type: 'registry:component', target: 'components/amicro/ActivityHeatmap.tsx' }]
  },
  {
    name: 'use-web-haptics',
    type: 'registry:hook' as const,
    title: 'useWebHaptics',
    description: 'Lightweight tactile haptic feedback hook for mobile web interactions using navigator.vibrate.',
    dependencies: [],
    files: [{ path: 'src/hooks/useWebHaptics.ts', type: 'registry:hook', target: 'hooks/useWebHaptics.ts' }]
  },
  {
    name: 'ai-prompt-input',
    type: 'registry:component' as const,
    title: 'AI Prompt Input Studio',
    description: 'Dynamic auto-expanding AI textarea with model switcher, live voice dictation wave pulse, web search & deep thinking toggles, and token counter.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/ai/AiPromptInput.tsx', type: 'registry:component', target: 'components/amicro/AiPromptInput.tsx' }]
  },
  {
    name: 'ai-reasoning-trace',
    type: 'registry:component' as const,
    title: 'AI Reasoning Trace Accordion',
    description: 'Collapsible chain-of-thought reasoning trace with active thought timer, pulsating brain wave, and sequential step status nodes.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/ai/AiReasoningTrace.tsx', type: 'registry:component', target: 'components/amicro/AiReasoningTrace.tsx' }]
  },
  {
    name: 'ai-response-stream',
    type: 'registry:component' as const,
    title: 'AI Response Stream & Code Block',
    description: 'Terminal-like AI code stream card featuring branch revision navigation, instant copy with tactile haptics, and response rating morphs.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/ai/AiResponseStream.tsx', type: 'registry:component', target: 'components/amicro/AiResponseStream.tsx' }]
  },
  {
    name: 'ai-prompt-chips',
    type: 'registry:component' as const,
    title: 'AI Prompt Suggestion Chips',
    description: 'Categorized quick-prompt suggestion chips with spring physics bounce and one-tap populating.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/ai/AiPromptChips.tsx', type: 'registry:component', target: 'components/amicro/AiPromptChips.tsx' }]
  },
  {
    name: 'ai-floating-toolbar',
    type: 'registry:component' as const,
    title: 'AI Floating Action Pill',
    description: 'Glassmorphic floating quick-action pill dock for instant generative prompts and actions.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/ai/AiFloatingToolbar.tsx', type: 'registry:component', target: 'components/amicro/AiFloatingToolbar.tsx' }]
  },
  {
    name: 'morphing-shapes-studio',
    type: 'registry:block' as const,
    title: 'Morphing Shapes Studio',
    description: 'Interactive shape morphing laboratory with studio controls, continuous auto-looping, and spring tension adjustments.',
    dependencies: ['motion', 'lucide-react'],
    files: [{ path: 'src/components/morphing/MorphingShapesPage.tsx', type: 'registry:component', target: 'components/amicro/MorphingShapesPage.tsx' }]
  }
];

for (const extra of extraCards) {
  if (!registryItems.some(item => item.name === extra.name)) {
    const srcExists = fs.existsSync(path.join(WORKSPACE_ROOT, extra.files[0].path));
    if (srcExists) {
      registryItems.push(extra as any);
    }
  }
}

// Clean up any target strings starting with '@' to avoid misconfigured directories
for (const item of registryItems) {
  for (const file of item.files) {
    if (file.target && file.target.startsWith('@')) {
      file.target = file.target.slice(1);
    }
  }
}

function build() {
  console.log(`Building full shadcn registry with ${registryItems.length} items...`);

  const registryDir = path.join(WORKSPACE_ROOT, 'registry');
  const publicDir = path.join(WORKSPACE_ROOT, 'public');
  const publicRDir = path.join(publicDir, 'r');

  // Ensure directories exist
  const dirs = [
    registryDir,
    path.join(registryDir, 'ui'),
    path.join(registryDir, 'hooks'),
    path.join(registryDir, 'lib'),
    publicDir,
    publicRDir
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const masterItems: any[] = [];

  for (const item of registryItems) {
    const itemFilesWithContent: RegistryFile[] = [];

    for (const file of item.files) {
      const sourceFilePath = path.join(WORKSPACE_ROOT, file.path);
      if (!fs.existsSync(sourceFilePath)) {
        console.error(`Error: Source file does not exist at ${sourceFilePath}`);
        process.exit(1);
      }

      const content = fs.readFileSync(sourceFilePath, 'utf-8');
      itemFilesWithContent.push({
        path: file.path,
        type: file.type,
        target: file.target,
        content: content
      });
    }

    // Build the registry-item payload
    const registryItemPayload = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: itemFilesWithContent
    };

    // 1. Save in public/r/[name].json for direct HTTP shadcn resolution (https://domain/r/[name].json)
    const publicItemJsonPath = path.join(publicRDir, `${item.name}.json`);
    fs.writeFileSync(publicItemJsonPath, JSON.stringify(registryItemPayload, null, 2), 'utf-8');

    // 2. Save in registry/[type]/[name].json
    let subfolder = 'ui';
    if (item.type === 'registry:hook') {
      subfolder = 'hooks';
    } else if (item.type === 'registry:lib') {
      subfolder = 'lib';
    }
    const itemJsonPath = path.join(registryDir, subfolder, `${item.name}.json`);
    fs.writeFileSync(itemJsonPath, JSON.stringify(registryItemPayload, null, 2), 'utf-8');

    // Add to master registry listing
    masterItems.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: item.files.map(f => ({ path: f.path, type: f.type, target: f.target }))
    });
  }

  // Master registry payload
  const masterRegistryPayload = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'amicro',
    homepage: 'https://github.com/Subhan-code/Amicro--Micro-transitions-',
    items: masterItems
  };

  const masterJsonContent = JSON.stringify(masterRegistryPayload, null, 2);

  // 1. Workspace root registry.json (for GitHub repository lookups: npx shadcn add owner/repo/item)
  const rootRegistryPath = path.join(WORKSPACE_ROOT, 'registry.json');
  fs.writeFileSync(rootRegistryPath, masterJsonContent, 'utf-8');
  console.log(`✓ Generated Root registry.json: ${path.relative(WORKSPACE_ROOT, rootRegistryPath)}`);

  // 2. public/registry.json (served at https://domain/registry.json)
  const publicRegistryPath = path.join(publicDir, 'registry.json');
  fs.writeFileSync(publicRegistryPath, masterJsonContent, 'utf-8');
  console.log(`✓ Generated Public registry.json: ${path.relative(WORKSPACE_ROOT, publicRegistryPath)}`);

  // 3. public/r/index.json (standard shadcn index of all registry items)
  const publicRIndexPath = path.join(publicRDir, 'index.json');
  fs.writeFileSync(publicRIndexPath, JSON.stringify(masterItems, null, 2), 'utf-8');
  console.log(`✓ Generated Public r/index.json: ${path.relative(WORKSPACE_ROOT, publicRIndexPath)}`);

  // 4. public/r/registry.json (also served at /r/registry.json)
  const publicRRegistryPath = path.join(publicRDir, 'registry.json');
  fs.writeFileSync(publicRRegistryPath, masterJsonContent, 'utf-8');
  console.log(`✓ Generated Public r/registry.json: ${path.relative(WORKSPACE_ROOT, publicRRegistryPath)}`);

  // 5. registry/registry.json
  const localRegistryPath = path.join(registryDir, 'registry.json');
  fs.writeFileSync(localRegistryPath, masterJsonContent, 'utf-8');
  console.log(`✓ Generated registry/registry.json: ${path.relative(WORKSPACE_ROOT, localRegistryPath)}`);

  console.log(`✨ Build completed successfully! Generated ${masterItems.length} registry items across all entrypoints.`);
}

build();

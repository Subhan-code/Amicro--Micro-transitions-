import * as fs from 'fs';
import * as path from 'path';

// Define the absolute workspace root
const WORKSPACE_ROOT = 'c:/Users/we/Desktop/Amicro---Micro-transitions';

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
          target: `@components/amicro/${file}`
        }
      ]
    });
  }
}

function build() {
  console.log('Building custom shadcn registry with target properties...');

  const outputBaseDir = path.join(WORKSPACE_ROOT, 'registry');

  // Ensure directories exist
  const dirs = [
    outputBaseDir,
    path.join(outputBaseDir, 'ui'),
    path.join(outputBaseDir, 'hooks'),
    path.join(outputBaseDir, 'lib')
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

    // Build the registry-item content
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

    // Save individual item JSON
    let subfolder = 'ui';
    if (item.type === 'registry:hook') {
      subfolder = 'hooks';
    } else if (item.type === 'registry:lib') {
      subfolder = 'lib';
    }

    const itemJsonPath = path.join(outputBaseDir, subfolder, `${item.name}.json`);
    fs.writeFileSync(itemJsonPath, JSON.stringify(registryItemPayload, null, 2), 'utf-8');
    console.log(`✓ Generated: ${path.relative(WORKSPACE_ROOT, itemJsonPath)}`);

    // Add to master registry listing (without file contents for size efficiency)
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

  // Generate master registry.json
  const masterRegistryPayload = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'amicro',
    homepage: 'https://github.com/Subhan-code/Amicro--Micro-transitions-',
    items: masterItems
  };

  const masterRegistryPath = path.join(outputBaseDir, 'registry.json');
  fs.writeFileSync(masterRegistryPath, JSON.stringify(masterRegistryPayload, null, 2), 'utf-8');
  console.log(`✓ Generated Master Index: ${path.relative(WORKSPACE_ROOT, masterRegistryPath)}`);

  console.log('Build completed successfully!');
}

build();

import { buttonsData } from './buttons';
import { cardsData } from './cards';
import { loaderGroups } from './loaders';

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  href: string;
  registry: string;
  category: 'buttons' | 'cards' | 'loaders' | 'dither-charts' | 'mono-charts' | 'ai-inputs' | 'morphing';
  categoryLabel: string;
  description: string;
  source: string;
  dependencies: string[];
  interaction: string;
  usage: string;
  props: ComponentProp[];
}

export const KNOWN_COMPONENT_ENTRIES: Record<string, ComponentItem> = {
  // Buttons
  'btn-1': {
    id: 'btn-1',
    name: 'Mac Slide Arrow Button',
    href: '/buttons/btn-1',
    registry: 'button-slide-arrow',
    category: 'buttons',
    categoryLabel: 'Button Interaction',
    description: 'Apple Mac inspired call-to-action button featuring smooth arrow slide transition on hover.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/AnimatedButton.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Hover to observe smooth arrow displacement and background color pulse.',
    usage: `import { AnimatedButton } from "@/components/ui/animated-button";\n\nexport default function Demo() {\n  return (\n    <AnimatedButton\n      config={{\n        id: '1',\n        label: 'Download for Mac',\n        interactionType: 'slide-arrow',\n      }}\n      layoutMode="grid"\n    />\n  );\n}`,
    props: [
      { name: 'config', type: 'ButtonConfig', default: 'required', description: 'Button configuration object detailing label and interaction type.' },
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Visual color theme mode for button container.' },
      { name: 'layoutMode', type: "'grid' | 'list' | 'matrix'", default: "'grid'", description: 'Sizing scale mode matching catalog grid layout.' },
    ],
  },

  // Cards & Card Spreads
  'card-arc-5': {
    id: 'card-arc-5',
    name: 'Arc 5-Card Fan',
    href: '/cards/card-arc-5',
    registry: 'card-arc-5',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Fanned card layout forming a neat curved arc with 5 layered elements.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardArc5.tsx',
    dependencies: ['motion'],
    interaction: 'Hover over card container to trigger radial arc spread animation.',
    usage: `import { CardArc5 } from "@/components/cards/CardArc5";\n\nexport default function Demo() {\n  return <CardArc5 hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'angle', type: 'number', default: '30', description: 'Curvature rotation fan angle in degrees.' },
      { name: 'gap', type: 'number', default: '70', description: 'Horizontal offset spacing across cards.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-arc-7': {
    id: 'card-arc-7',
    name: 'Arc 7-Card Fan',
    href: '/cards/card-arc-7',
    registry: 'card-arc-7',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Expanded card arc layout accommodating 7 items cleanly with curved fanning.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardArc7.tsx',
    dependencies: ['motion'],
    interaction: 'Hover over card container to trigger curved 7-card arc spread animation.',
    usage: `import { CardArc7 } from "@/components/cards/CardArc7";\n\nexport default function Demo() {\n  return <CardArc7 hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'angle', type: 'number', default: '40', description: 'Curvature rotation fan angle in degrees.' },
      { name: 'gap', type: 'number', default: '80', description: 'Horizontal offset spacing across cards.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-long-arc-5': {
    id: 'card-long-arc-5',
    name: 'Long Arc 5-Card Spread',
    href: '/cards/card-long-arc-5',
    registry: 'card-long-arc-5',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Wide, sweeping card arc extending translations laterally with deep perspective.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardLongArc5.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to extend the sweeping parabolic arc spread across 5 cards.',
    usage: `import { CardLongArc5 } from "@/components/cards/CardLongArc5";\n\nexport default function Demo() {\n  return <CardLongArc5 hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'spread', type: 'number', default: '160', description: 'Horizontal expansion width between cards.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-linear-spread': {
    id: 'card-linear-spread',
    name: 'Linear Card Spread',
    href: '/cards/card-linear-spread',
    registry: 'card-linear-spread',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Slides 5 layered cards horizontally in a clean, equidistant linear row without rotations.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardLinearSpread.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to expand cards horizontally in an equidistant linear line.',
    usage: `import { CardLinearSpread } from "@/components/cards/CardLinearSpread";\n\nexport default function Demo() {\n  return <CardLinearSpread hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'gap', type: 'number', default: '90', description: 'Distance to separate cards horizontally.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-corner-fan': {
    id: 'card-corner-fan',
    name: 'Corner Radial Fan',
    href: '/cards/card-corner-fan',
    registry: 'card-corner-fan',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Fans elements radially from a fixed bottom-left origin anchor.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCornerFan.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to fan out cards around the bottom-left anchor point.',
    usage: `import { CardCornerFan } from "@/components/cards/CardCornerFan";\n\nexport default function Demo() {\n  return <CardCornerFan hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'angle', type: 'number', default: '40', description: 'Total rotational span in degrees.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-stamp-arc': {
    id: 'card-stamp-arc',
    name: 'Stamp Arc (Adjustable)',
    href: '/cards/card-stamp-arc',
    registry: 'card-stamp-arc',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Perforated stamp cards with dynamic arc, gap, and offset slider controls.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardStampArc.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to reveal layered stamp cards with dynamic arc curve.',
    usage: `import { CardStampArc } from "@/components/cards/CardStampArc";\n\nexport default function Demo() {\n  return <CardStampArc hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'arc', type: 'number', default: '25', description: 'Radial arc angle curvature.' },
      { name: 'spread', type: 'number', default: '180', description: 'Spread offset distance.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-cascade-stagger': {
    id: 'card-cascade-stagger',
    name: 'Cascade Stagger Fan',
    href: '/cards/card-cascade-stagger',
    registry: 'card-cascade-stagger',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Deploys 5 cards vertically and staggered in a diagonal cascade stack.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCascadeStagger.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to cascade cards in a staggered diagonal step sequence.',
    usage: `import { CardCascadeStagger } from "@/components/cards/CardCascadeStagger";\n\nexport default function Demo() {\n  return <CardCascadeStagger hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'yOffset', type: 'number', default: '25', description: 'Vertical step displacement between cards.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-scatter-spread': {
    id: 'card-scatter-spread',
    name: 'Scatter Desk Deal',
    href: '/cards/card-scatter-spread',
    registry: 'card-scatter-spread',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Scatters cards into an organic overlapping dealt hand layout on hover.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardScatterSpread.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to scatter cards into an organic desk deal layout.',
    usage: `import { CardScatterSpread } from "@/components/cards/CardScatterSpread";\n\nexport default function Demo() {\n  return <CardScatterSpread hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-wheel-fan': {
    id: 'card-wheel-fan',
    name: 'Wheel Radial Fan',
    href: '/cards/card-wheel-fan',
    registry: 'card-wheel-fan',
    category: 'cards',
    categoryLabel: 'Card Spread',
    description: 'Fans cards outward in a radial semi-circle around a bottom-center anchor.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardWheelFan.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to fan cards outward in a radial circular arc.',
    usage: `import { CardWheelFan } from "@/components/cards/CardWheelFan";\n\nexport default function Demo() {\n  return <CardWheelFan hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'angle', type: 'number', default: '50', description: 'Total radial rotation angle span.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-carousel': {
    id: 'card-carousel',
    name: '3D Cylinder Carousel',
    href: '/carousels/card-carousel',
    registry: 'card-carousel',
    category: 'cards',
    categoryLabel: '3D Carousel',
    description: 'Interactive 3D cylindrical carousel card stack with depth perspective rotation.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCarousel.tsx',
    dependencies: ['motion'],
    interaction: 'Hover or swipe to rotate cylinder cards in 3D space.',
    usage: `import { CardCarousel } from "@/components/cards/CardCarousel";\n\nexport default function Demo() {\n  return <CardCarousel hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Triggers 3D carousel spin and spread perspective.' },
      { name: 'isMonochrome', type: 'boolean', default: 'false', description: 'Renders high-contrast monochrome card style.' },
    ],
  },
  'card-cover-flow': {
    id: 'card-cover-flow',
    name: '3D Cover Flow',
    href: '/carousels/card-cover-flow',
    registry: 'card-cover-flow',
    category: 'cards',
    categoryLabel: '3D Cover Flow',
    description: 'Classic iTunes cover flow 3D album art stack featuring depth perspective angles.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCoverFlow.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to slide cover flow stack and shift perspective angles.',
    usage: `import { CardCoverFlow } from "@/components/cards/CardCoverFlow";\n\nexport default function Demo() {\n  return <CardCoverFlow hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Triggers cover flow perspective shift.' },
      { name: 'isMonochrome', type: 'boolean', default: 'false', description: 'Renders sleek monochrome card styling.' },
    ],
  },
  'card-time-machine': {
    id: 'card-time-machine',
    name: 'Time Machine Stack',
    href: '/carousels/card-time-machine',
    registry: 'card-time-machine',
    category: 'cards',
    categoryLabel: '3D Carousel',
    description: 'Apple-style perspective depth card stack with interactive scrubber timeline controls.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardTimeMachine.tsx',
    dependencies: ['motion'],
    interaction: 'Hover and scrub across timeline nodes to flip perspective depth cards.',
    usage: `import { CardTimeMachine } from "@/components/cards/CardTimeMachine";\n\nexport default function Demo() {\n  return <CardTimeMachine />;\n}`,
    props: [
      { name: 'isMonochrome', type: 'boolean', default: 'false', description: 'Renders high-contrast monochrome card styling.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },

  // Mono Charts
  'mono-rounded-line': {
    id: 'mono-rounded-line',
    name: 'Mono Rounded Spline Line',
    href: '/mono-charts/mono-rounded-line',
    registry: 'mono-rounded-line',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic line chart with smooth rounded spline curves and rounded stroke caps.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedLineChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Toggle between Dual and Single series baseline filters to observe spline curves.',
    usage: `import { MonoRoundedLineChart } from "@/components/ui/mono-rounded-line";\n\nexport default function Demo() {\n  return <MonoRoundedLineChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },
  'mono-rounded-bar': {
    id: 'mono-rounded-bar',
    name: 'Mono Rounded Pill Pillars',
    href: '/mono-charts/mono-rounded-bar',
    registry: 'mono-rounded-bar',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic bar chart with full corner radii pill columns and vertical/horizontal layout switches.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedBarChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Click Col / Row buttons to toggle column pillar layout direction dynamically.',
    usage: `import { MonoRoundedBarChart } from "@/components/ui/mono-rounded-bar";\n\nexport default function Demo() {\n  return <MonoRoundedBarChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },
  'mono-rounded-donut': {
    id: 'mono-rounded-donut',
    name: 'Mono Rounded Donut Ring',
    href: '/mono-charts/mono-rounded-donut',
    registry: 'mono-rounded-donut',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic donut chart with rounded segment endcaps, generous spacing, and center metric numbers.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedDonutChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Hover over segment arcs to scale segment radii and inspect center values.',
    usage: `import { MonoRoundedDonutChart } from "@/components/ui/mono-rounded-donut";\n\nexport default function Demo() {\n  return <MonoRoundedDonutChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },

  // Dither Charts
  'dither-donut': {
    id: 'dither-donut',
    name: 'Dither Donut Chart',
    href: '/dither-charts/dither-donut',
    registry: 'dither-donut',
    category: 'dither-charts',
    categoryLabel: 'Dither Visualizer',
    description: 'Retro 1-bit ordered Bayer matrix dithered donut ring with canvas dithering shaders and hover segment callouts.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/dither-charts/DitherDonutChart.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Click time period pills (Week, Month, Quarter, Year) to animate segment data.',
    usage: `import { DitherDonutChart } from "@/components/ui/dither-donut";\n\nexport default function Demo() {\n  return <DitherDonutChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },

  // AI Inputs & Interactions
  'ai-prompt-input': {
    id: 'ai-prompt-input',
    name: 'AI Prompt Input Studio',
    href: '/ai-inputs/ai-prompt-input',
    registry: 'ai-prompt-input',
    category: 'ai-inputs',
    categoryLabel: 'AI Input',
    description: 'Dynamic auto-expanding AI prompt textarea with model selector, live voice dictation wave pulse, web search & deep thinking toggles, and token counter.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/ai/AiPromptInput.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Focus textarea, toggle deep thinking or web search pills, switch AI models, and tap voice mic to observe soundwave animation.',
    usage: `import { AiPromptInput } from "@/components/amicro/AiPromptInput";\n\nexport default function Demo() {\n  return <AiPromptInput onSend={(prompt, model) => console.log(prompt, model)} />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Visual theme mode matching Amicro dark/light styles.' },
      { name: 'onSend', type: '(prompt: string, model: string, options: any) => void', default: 'undefined', description: 'Callback executed when prompt is submitted.' },
      { name: 'initialValue', type: 'string', default: '""', description: 'Initial default prompt value inside textarea.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS wrapper classes.' },
    ],
  },
  'ai-reasoning-trace': {
    id: 'ai-reasoning-trace',
    name: 'AI Reasoning Trace',
    href: '/ai-inputs/ai-reasoning-trace',
    registry: 'ai-reasoning-trace',
    category: 'ai-inputs',
    categoryLabel: 'AI Micro-Interaction',
    description: 'Collapsible chain-of-thought accordion with pulsing brain indicator, duration stopwatch, and step-by-step reasoning progress nodes.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/ai/AiReasoningTrace.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Click accordion header to expand/collapse chain-of-thought steps with spring physics.',
    usage: `import { AiReasoningTrace } from "@/components/amicro/AiReasoningTrace";\n\nexport default function Demo() {\n  return <AiReasoningTrace isStreaming={false} durationSeconds={3.4} />;\n}`,
    props: [
      { name: 'steps', type: 'ReasoningStep[]', default: 'defaultSteps', description: 'Array of thought steps with title, content, and status.' },
      { name: 'isStreaming', type: 'boolean', default: 'false', description: 'Whether the AI model is actively generating thoughts.' },
      { name: 'durationSeconds', type: 'number', default: '3.4', description: 'Total thought computation time in seconds.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether trace is initially expanded.' },
    ],
  },
  'ai-response-stream': {
    id: 'ai-response-stream',
    name: 'AI Response Stream & Code Block',
    href: '/ai-inputs/ai-response-stream',
    registry: 'ai-response-stream',
    category: 'ai-inputs',
    categoryLabel: 'AI Response',
    description: 'Terminal-style code stream container featuring multi-revision branch navigation (< 1 of 3 >), tactile copy button, and upvote/downvote morphs.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/ai/AiResponseStream.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Navigate versions (< / >), click copy button for tactile checkmark, and toggle helpful/unhelpful rating.',
    usage: `import { AiResponseStream } from "@/components/amicro/AiResponseStream";\n\nexport default function Demo() {\n  return <AiResponseStream />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme mode.' },
      { name: 'isStreaming', type: 'boolean', default: 'false', description: 'Displays typing cursor at end of stream.' },
      { name: 'onRegenerate', type: '() => void', default: 'undefined', description: 'Callback when user clicks regenerate button.' },
    ],
  },
  'ai-floating-toolbar': {
    id: 'ai-floating-toolbar',
    name: 'AI Floating Action Pill',
    href: '/ai-inputs/ai-floating-toolbar',
    registry: 'ai-floating-toolbar',
    category: 'ai-inputs',
    categoryLabel: 'AI Micro-Interaction',
    description: 'Glassmorphic floating quick-action pill dock offering instant one-tap AI actions with tactile vibration.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/ai/AiFloatingToolbar.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Hover and click action pills to trigger spring scaling and haptic clicks.',
    usage: `import { AiFloatingToolbar } from "@/components/amicro/AiFloatingToolbar";\n\nexport default function Demo() {\n  return <AiFloatingToolbar onAction={(actionId) => console.log(actionId)} />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme mode.' },
      { name: 'onAction', type: '(actionId: string) => void', default: 'undefined', description: 'Callback invoked when action pill is clicked.' },
    ],
  },

  // Shape Morphing
  'loader-morphing': {
    id: 'loader-morphing',
    name: 'Squircle ➔ Circle Morph',
    href: '/morphing/loader-morphing',
    registry: 'loader-morphing',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Smooth continuous morph between squircle and circle with synchronized 360-degree rotation and scale pulse.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Continuous infinite keyframe loop: borderRadius (20% ➔ 50%), rotate (0° ➔ 360°), scale (1 ➔ 1.2).',
    usage: `import { LoaderMorphing } from "@/components/ui/loader-morphing";\n\nexport default function Demo() {\n  return <LoaderMorphing size={48} color="currentColor" duration={2} />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height of the morph element.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2', description: 'Cycle duration in seconds.' },
      { name: 'className', type: 'string', default: "''", description: 'Tailwind or custom CSS classes.' },
    ],
  },
  'morph-diamond-squircle': {
    id: 'morph-diamond-squircle',
    name: 'Diamond ➔ Squircle Morph',
    href: '/morphing/morph-diamond-squircle',
    registry: 'morph-diamond-squircle',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Sharp diamond corner expansion morphing into soft rounded squircle with angular momentum.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: borderRadius (0% ➔ 38%), rotate (45° ➔ 405°), scale (1 ➔ 1.15).',
    usage: `import { MorphDiamondSquircle } from "@/components/ui/morph-diamond-squircle";\n\nexport default function Demo() {\n  return <MorphDiamondSquircle size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height of the morph element.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.2', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-capsule-stretch': {
    id: 'morph-capsule-stretch',
    name: 'Capsule ➔ Square Stretch',
    href: '/morphing/morph-capsule-stretch',
    registry: 'morph-capsule-stretch',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Biaxial stretching between elongated pill capsule and compact rounded square.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: borderRadius (9999px ➔ 14%), scaleX/scaleY biaxial stretch, rotate 360°.',
    usage: `import { MorphCapsuleStretch } from "@/components/ui/morph-capsule-stretch";\n\nexport default function Demo() {\n  return <MorphCapsuleStretch size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height of the morph element.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.4', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-jelly-skew': {
    id: 'morph-jelly-skew',
    name: 'Kinetic Jelly Skew',
    href: '/morphing/morph-jelly-skew',
    registry: 'morph-jelly-skew',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Elastic rubber-banding skew transition with dynamic border-radius wobble.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: skewX / skewY spring oscillation, borderRadius (24% ➔ 48%).',
    usage: `import { MorphJellySkew } from "@/components/ui/morph-jelly-skew";\n\nexport default function Demo() {\n  return <MorphJellySkew size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '1.8', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-organic-blob': {
    id: 'morph-organic-blob',
    name: 'Organic Fluid Blob',
    href: '/morphing/morph-organic-blob',
    registry: 'morph-organic-blob',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Continuous 8-point border-radius deformation simulating liquid surface tension.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: 8-value CSS border-radius morphing cycle with 360° spin.',
    usage: `import { MorphOrganicBlob } from "@/components/ui/morph-organic-blob";\n\nexport default function Demo() {\n  return <MorphOrganicBlob size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '3.2', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-corner-pinch': {
    id: 'morph-corner-pinch',
    name: 'Diagonal Corner Pinch',
    href: '/morphing/morph-corner-pinch',
    registry: 'morph-corner-pinch',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Alternating diagonal corner pinching creating an organic leaf and teardrop cycle.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: diagonal border-radius alternation (50% 0% 50% 0% ➔ 0% 50% 0% 50%).',
    usage: `import { MorphCornerPinch } from "@/components/ui/morph-corner-pinch";\n\nexport default function Demo() {\n  return <MorphCornerPinch size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.2', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-teardrop-orbit': {
    id: 'morph-teardrop-orbit',
    name: 'Teardrop Orbit Morph',
    href: '/morphing/morph-teardrop-orbit',
    registry: 'morph-teardrop-orbit',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Single directional vertex rotating through all 4 quadrants like a rolling water drop.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: 4-quadrant zero-radius corner rotation with 360° spin.',
    usage: `import { MorphTeardropOrbit } from "@/components/ui/morph-teardrop-orbit";\n\nexport default function Demo() {\n  return <MorphTeardropOrbit size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.5', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-accordion-squish': {
    id: 'morph-accordion-squish',
    name: 'Accordion Squish & Bounce',
    href: '/morphing/morph-accordion-squish',
    registry: 'morph-accordion-squish',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Vertical impact compression with horizontal spring expansion and corner softening.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: scaleX/scaleY impact bounce with corner softening.',
    usage: `import { MorphAccordionSquish } from "@/components/ui/morph-accordion-squish";\n\nexport default function Demo() {\n  return <MorphAccordionSquish size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '1.6', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-dual-crescent': {
    id: 'morph-dual-crescent',
    name: 'Dual Crescent Spin',
    href: '/morphing/morph-dual-crescent',
    registry: 'morph-dual-crescent',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Opposing concave curvature cycle alternating between sharp crescent and smooth pebble.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: concave corner curvature alternation with continuous rotation.',
    usage: `import { MorphDualCrescent } from "@/components/ui/morph-dual-crescent";\n\nexport default function Demo() {\n  return <MorphDualCrescent size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.4', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-super-ellipse': {
    id: 'morph-super-ellipse',
    name: 'Super-Ellipse Curvature',
    href: '/morphing/morph-super-ellipse',
    registry: 'morph-super-ellipse',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Gradual curvature transition expanding from rounded rectangle to perfect circle.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: borderRadius (8% ➔ 50%), scale (0.94 ➔ 1.2), rotate 180°.',
    usage: `import { MorphSuperEllipse } from "@/components/ui/morph-super-ellipse";\n\nexport default function Demo() {\n  return <MorphSuperEllipse size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.6', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-star-kinetic': {
    id: 'morph-star-kinetic',
    name: 'Kinetic Star Cross',
    href: '/morphing/morph-star-kinetic',
    registry: 'morph-star-kinetic',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Quad-point corner pinching creating an alternating 4-point star and circle pulse.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: 4-point star pinch (10% 50% 10% 50% ➔ 50%) with 45° step rotations.',
    usage: `import { MorphStarKinetic } from "@/components/ui/morph-star-kinetic";\n\nexport default function Demo() {\n  return <MorphStarKinetic size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '2.2', description: 'Cycle duration in seconds.' },
    ],
  },
  'morph-wave-ripple': {
    id: 'morph-wave-ripple',
    name: 'Wave Ripple Drop',
    href: '/morphing/morph-wave-ripple',
    registry: 'morph-wave-ripple',
    category: 'morphing',
    categoryLabel: 'Keyframe Morph',
    description: 'Asymmetric fluid ripple deformation with rotating rotational equilibrium.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/morphing/keyframeMorphs.tsx',
    dependencies: ['motion'],
    interaction: 'Keyframe loop: asymmetric fluid ripple deformation with rotating equilibrium.',
    usage: `import { MorphWaveRipple } from "@/components/ui/morph-wave-ripple";\n\nexport default function Demo() {\n  return <MorphWaveRipple size={48} color="currentColor" />;\n}`,
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Pixel width and height.' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Fill background color.' },
      { name: 'duration', type: 'number', default: '3', description: 'Cycle duration in seconds.' },
    ],
  },
};

export function getComponentEntry(id: string): ComponentItem {
  if (KNOWN_COMPONENT_ENTRIES[id]) {
    return KNOWN_COMPONENT_ENTRIES[id];
  }

  // Check card aliases (e.g. c1 -> card-arc-5, c4 -> card-linear-spread)
  const foundCardAlias = cardsData.find((c) => c.id === id || c.interactionType === id);
  if (foundCardAlias && KNOWN_COMPONENT_ENTRIES[foundCardAlias.interactionType]) {
    return KNOWN_COMPONENT_ENTRIES[foundCardAlias.interactionType];
  }

  // Fallback metadata generator for any component ID across the app
  const isDither = id.includes('dither') || id.includes('gauge') || id.includes('heatmap') || id.includes('bubble');
  const isMono = id.startsWith('mono-');
  const isCard = id.startsWith('card-') || id.startsWith('c');
  const isButton = id.startsWith('btn-') || !isNaN(Number(id));
  const isMorph = id.includes('morph') || id.includes('shape');

  let category: ComponentItem['category'] = 'mono-charts';
  let categoryLabel = 'Mono Chart';
  let resolvedName = '';
  let resolvedDesc = '';

  if (isMorph) {
    category = 'morphing';
    categoryLabel = 'Shape Morph';
    resolvedName = 'Shape Morph';
    resolvedDesc = 'Dynamic polygon path morphing engineered with spring motion parameters.';
  } else if (isDither) {
    category = 'dither-charts';
    categoryLabel = 'Dither Visualizer';
  } else if (isCard) {
    category = 'cards';
    categoryLabel = 'Card Spread';
    const foundCard = foundCardAlias;
    if (foundCard) {
      resolvedName = foundCard.label;
      resolvedDesc = foundCard.description;
    }
  } else if (isButton) {
    category = 'buttons';
    categoryLabel = 'Button Micro-Interaction';
    const rawBtnId = id.replace(/^btn-/, '');
    const foundBtn = buttonsData.find((b) => b.id === id || b.id === rawBtnId || `btn-${b.id}` === id);
    if (foundBtn) {
      resolvedName = `${foundBtn.label} Button`;
      resolvedDesc = `${foundBtn.label} micro-interaction featuring ${foundBtn.interactionType} motion physics.`;
    }
  } else if (id.includes('loader') || id.includes('dot') || id.includes('spinner')) {
    category = 'loaders';
    categoryLabel = 'Loader Animation';
    for (const group of loaderGroups) {
      const foundLoader = group.loaders.find((l) => l.kebabName === id || l.name.toLowerCase().replace(/\s+/g, '-') === id);
      if (foundLoader) {
        resolvedName = foundLoader.name;
        resolvedDesc = 'Fluid dynamic loader component engineered with mathematical spring physics.';
        break;
      }
    }
  }

  if (!resolvedName) {
    const rawName = id
      .replace(/^(c|btn|loader|mono|dither)-/, '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    // If rawName is just a number, make it friendly
    if (/^\d+$/.test(rawName.trim())) {
      resolvedName = `Micro Interaction #${rawName}`;
    } else {
      resolvedName = rawName || 'Micro Component';
    }
  }

  const componentIdent = resolvedName.replace(/[^a-zA-Z0-9]/g, '');

  return {
    id,
    name: resolvedName,
    href: `/${category}/${id}`,
    registry: id,
    category,
    categoryLabel,
    description: resolvedDesc || `A curated ${categoryLabel.toLowerCase()} component built with React, Motion, and tailored physics parameters.`,
    source: `https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/${id}.tsx`,
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Interact with controls, hover over elements, and toggle themes to observe visual motion states.',
    usage: `import { ${componentIdent} } from "@/components/ui/${id}";\n\nexport default function Demo() {\n  return <${componentIdent} theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette theme mode for visual contrast.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional custom Tailwind CSS utility classes.' },
    ],
  };
}

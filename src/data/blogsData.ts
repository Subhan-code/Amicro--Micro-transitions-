export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Motion Engineering' | 'Architecture' | 'AI Interfaces' | 'React 19';
  readTime: string;
  date: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'physics-of-micro-transitions',
    title: 'The Physics of Micro-Transitions: Why 200ms Damping Defines Modern SaaS',
    category: 'Motion Engineering',
    readTime: '5 min read',
    date: 'Oct 2026',
    author: {
      name: 'Syed Subhan',
      handle: '@SubhanHQ',
      avatar: '/favicon.jpg',
    },
    excerpt: 'Why linear CSS transitions feel robotic, and how damped cubic-spring physics mimic real material inertia to captivate user attention without latency.',
    tags: ['Motion Physics', 'Framer Motion', 'Micro-Interactions', 'UX Engineering'],
    content: `## The Problem with Linear CSS Transitions

For the past decade, web animations were predominantly defined by simplistic CSS \`ease-in-out\` curves. While functional, mechanical bezier transitions often feel synthetic and detached from real-world physics. In the physical universe, objects do not accelerate and stop instantaneously without momentum, resistance, and friction.

When users interact with high-end digital products like Linear, Raycast, or macOS, every interaction conveys weight and responsiveness. The secret lies in **critically damped spring physics**.

\`\`\`tsx
// Robotic CSS curve:
transition: all 0.2s ease-in-out;

// Organic Spring physics (Motion):
transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.5 }}
\`\`\`

---

## The Three Golden Ratios of Micro-Transitions

When crafting button hover states, card spreads, or modal reveals in Amicro, we adhere to three foundational constants:

1. **Stiffness (\`k = 380 - 450\`)**: Dictates how quickly the element seeks equilibrium. A higher stiffness creates immediate responsiveness, which is essential for user inputs and clicks.
2. **Damping (\`c = 26 - 32\`)**: Counteracts oscillation. Under-damped springs wobble erratically, whereas critically damped springs glide smoothly into their resting state in less than 220ms.
3. **Mass (\`m = 0.4 - 0.6\`)**: Lower mass ensures that mobile touch events register instantaneously without perceived drag.

---

## Perceived Latency vs. Actual Duration

Cognitive science demonstrates that users perceive animations with spring overshoot as *faster* than linear animations of the same duration. The subtle 2-3% rebound tricks the brain into acknowledging completion before the mathematical curve fully reaches zero velocity.

By adopting spring-based micro-transitions across your component library, your interface transitions from a collection of static DOM nodes into an alive, tactile workspace.`,
  },
  {
    id: 'blog-2',
    slug: 'shadcn-registry-two',
    title: 'Migrating to Shadcn Registry 2.0: Distributing Zero-Dependency UI Primitives',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'Sep 2026',
    author: {
      name: 'Syed Subhan',
      handle: '@SubhanHQ',
      avatar: '/favicon.jpg',
    },
    excerpt: 'How the open shadcn registry specification revolutionizes open-source component sharing by replacing monolithic npm wrappers with raw TSX code ownership.',
    tags: ['shadcn/ui', 'Registry 2.0', 'CLI', 'Architecture'],
    content: `## The Era of Monolithic Component Libraries is Ending

Traditional UI packages suffer from severe structural drawbacks:
- You inherit dozens of transitive dependencies you never use.
- Overriding deep internal styles requires awkward CSS specificity wars or monkey-patching.
- Version bumps can introduce breaking changes across unrelated parts of your codebase.

The **shadcn/ui registry pattern** inverts this model completely. Instead of installing a pre-bundled runtime wrapper, your CLI pulls raw, uncompiled TypeScript JSX files directly into your workspace.

---

## How Amicro Distributes Primitives via Shadcn Registry

In Amicro, every component item is compiled into a lightweight JSON payload matching the official registry schema:

\`\`\`json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "fade-up",
  "type": "registry:ui",
  "dependencies": ["motion"],
  "files": [
    {
      "path": "registry/ui/entrance/fade-up.tsx",
      "type": "registry:ui",
      "target": "@components/amicro/fade-up.tsx"
    }
  ]
}
\`\`\`

By registering our endpoint in your project's \`components.json\`:

\`\`\`json
{
  "registries": {
    "@amicro": "https://amicro.vercel.app/r/{name}.json"
  }
}
\`\`\`

Developers can install any component with standard shadcn tooling:
\`\`\`bash
npx shadcn@latest add @amicro/download-button
\`\`\`

---

## Complete Ownership, Zero Wrapper Overhead

Once installed, the component belongs to your codebase. If you need to tweak the spring stiffness, change Tailwind classes, or adapt color tokens to your custom theme, you have 100% control over the source code.`,
  },
  {
    id: 'blog-3',
    slug: 'next-gen-ai-inputs',
    title: 'Engineering Next-Gen AI Inputs: Fluid Textareas, Streaming Thoughts & Haptic Feedback',
    category: 'AI Interfaces',
    readTime: '6 min read',
    date: 'Oct 2026',
    author: {
      name: 'Syed Subhan',
      handle: '@SubhanHQ',
      avatar: '/favicon.jpg',
    },
    excerpt: 'The UX anatomy of modern LLM prompts: multi-line spring expansions, collapsible reasoning traces, and tactile mobile haptics.',
    tags: ['AI UX', 'Mobile Haptics', 'Design Engineering', 'React'],
    content: `## Beyond the Boring Chatbot Textbox

As artificial intelligence models evolve from simple text completion engines into complex reasoning agents, the input bar must reflect this transformation. Modern users expect seamless multimodal controls: model switching, voice dictation, deep thinking toggles, and instant visual feedback.

---

## 1. Auto-Expanding Textarea with Spring Clamping

Static single-line inputs feel restrictive when crafting complex prompts, while native HTML textareas with ugly scrollbars feel antiquated. 

Amicro's AI prompt input dynamically measures its \`scrollHeight\` on each keystroke and smoothly transitions its height container using Framer Motion, clamping automatically between 44px and 200px.

---

## 2. Collapsible Reasoning Traces

With models like Claude 3.7 Sonnet and DeepSeek R1 producing extended thinking tokens, displaying dense chain-of-thought blocks can overwhelm the user.

The optimal UX pattern is an **interactive reasoning accordion**:
- Shows total elapsed thinking time (e.g., \`Thought for 3.4s\`).
- Pulsing brain icon with active state indicators during streaming.
- Collapsible progress nodes that reveal step-by-step reasoning on demand without cluttering the final output.

---

## 3. Micro-Haptics on Mobile Touch

On mobile devices, physical button clicks are absent. Triggering subtle browser vibration haptics (\`navigator.vibrate([12])\`) on send button taps and model switches gives the user physical confirmation that their prompt has been registered.`,
  },
  {
    id: 'blog-4',
    slug: 'react-19-motion-without-layout-shifts',
    title: 'Motion in React 19: Spring Dynamics Without Layout Shifts',
    category: 'React 19',
    readTime: '4 min read',
    date: 'Aug 2026',
    author: {
      name: 'Syed Subhan',
      handle: '@SubhanHQ',
      avatar: '/favicon.jpg',
    },
    excerpt: 'Leveraging React 19 Actions and Motion 12 layoutId to achieve 60fps shared-element morphing across complex component hierarchies.',
    tags: ['React 19', 'Performance', 'Motion 12', 'Zero CLS'],
    content: `## Achieving 60fps Performance on Modern Web

Cumulative Layout Shift (CLS) is one of the most frustrating aspects of web animation. When elements expand or shift without hardware acceleration, the browser reflows the entire layout tree, causing noticeable stutter.

---

## The Power of layoutId Morphing

Motion 12 and Framer Motion provide the \`layoutId\` prop, which calculates bounding rect delta transformations using CSS \`transform: translate3d()\` and \`scale()\`.

Because transforms are rendered on the GPU compositor thread, shared element transitions run at a silky smooth 60fps even on resource-constrained mobile hardware.

\`\`\`tsx
<motion.div
  layoutId="active-pill"
  transition={{ type: "spring", stiffness: 480, damping: 34 }}
  className="absolute inset-0 bg-white rounded-full z-0 pointer-events-none"
/>
\`\`\`

---

## Mobile Viewport & Inertial Scrolling Best Practices

To ensure flawless mobile performance:
- Always specify \`touch-action: manipulation\` to eliminate the 300ms tap delay.
- Use \`-webkit-tap-highlight-color: transparent\` to prevent the gray flash on iOS Safari.
- Never animate \`width\` or \`height\` directly; animate \`scaleX\` or \`scaleY\` whenever possible to avoid triggering layout recalculations.`,
  },
];

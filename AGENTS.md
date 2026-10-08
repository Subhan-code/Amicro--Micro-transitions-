# Amicro — AI Agent Readiness & Engineering Guide

Welcome to **Amicro** (`@subhanhq/amicro`). This guide outlines the system architecture, development workflows, design tokens, and engineering constraints for autonomous AI coding agents and human contributors.

---

## 1. Project Overview & Architecture
Amicro is an open-source React & Next.js micro-transitions library featuring 170+ interactive motion components, spring physics buttons, 3D card spreads, canvas loaders, mono telemetry charts, and WebGL liquid shaders.

### Tech Stack
- **Framework & Runtime**: React 19, TypeScript 5.7+
- **Bundler & Tooling**: Vite 6, `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Styling**: Tailwind CSS (v4) with CSS design tokens and fluid typography
- **Animation & Physics**: Motion (`motion/react` v12) with cubic-bezier easing `[0.16, 1, 0.3, 1]`
- **WebGL Shaders**: `@paper-design/shaders-react` for liquid metal and GPU effects
- **Registry & CLI**: Custom shadcn-compatible registry generator (`scripts/build-registry.ts`)
- **Backend / Serverless**: Vercel Serverless Functions (`api/`) with Polar & Supabase integration

---

## 2. Directory Layout
```
├── api/                   # Serverless endpoints (checkout, sponsors, polar webhooks)
├── public/
│   ├── r/                 # Static JSON registry endpoints for CLI installation
│   ├── sitemap.xml        # Auto-generated canonical sitemap (84+ URLs)
│   └── robots.txt         # Search & crawler permissions
├── registry/              # shadcn UI schemas & source component files
├── scripts/
│   ├── build-registry.ts  # CLI registry compiler (outputs to public/r & registry.json)
│   └── generate-sitemap.ts # Canonical sitemap generator
├── src/
│   ├── components/        # UI components, pages, command palette, shaders
│   ├── data/              # Component metadata, buttons, loaders, tiers
│   ├── hooks/             # Custom hooks (useWebHaptics, etc.)
│   ├── utils/             # Code generators and helpers
│   ├── App.tsx            # Root application router & orchestrator
│   └── index.css          # Design tokens, fluid typography clamp utilities
└── vite.config.ts         # Vite build configuration, manualChunks & API dev plugin
```

---

## 3. Command Matrix
Always execute commands using PowerShell or terminal within the project root:

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server on `http://localhost:3000` with hot-reload and local API server. |
| `npm run build` | Compiles sitemap, builds shadcn registry (176 items), and produces optimized Vite dist bundle. |
| `npm run preview` | Serves the production build locally for verification. |
| `npx tsx scripts/build-registry.ts` | Re-indexes all components into registry JSON files. |
| `npx tsx scripts/generate-sitemap.ts` | Rebuilds canonical sitemap with all routes. |

---

## 4. Design System & Tokens
Adhere strictly to the Amicro Design System (`.agents/skills/amicro-design-system/SKILL.md`):

### 1. Typography & Fluid Scaling
- **Font Family**: `'Outfit', sans-serif`
- **Fluid Utilities**:
  - `.text-fluid-hero`: `clamp(2.75rem, 6.5vw + 0.5rem, 5.25rem)`
  - `.text-fluid-h1`: `clamp(2.25rem, 5vw + 0.5rem, 4rem)`
  - `.text-fluid-h2`: `clamp(1.75rem, 3.5vw + 0.5rem, 2.75rem)`
  - `.text-fluid-sub`: `clamp(1rem, 1.8vw + 0.2rem, 1.25rem)`
  - `.text-fluid-body`: `clamp(0.875rem, 1.2vw + 0.1rem, 1rem)`

### 2. Layout & Responsive Breakpoints
- **Container Constraints**:
  - Outer navbar & catalog grids: `max-w-[1600px] w-full px-4 sm:px-8 lg:px-12 2xl:px-16`
  - Hero & CTA sections: `max-w-[1480px] w-full`
  - Sponsor tiers: `max-w-[1240px] 2xl:max-w-[1360px]`
- **Grid Density**:
  - Mobile (<640px): 1 column
  - Tablet (640px–1024px): 2 columns
  - Laptop (1024px–1536px): 3 columns (`xl:grid-cols-3`)
  - 24"+ Desktop (>1536px): 4 columns (`2xl:grid-cols-4`) for cards / 6 columns for loaders

### 3. Motion Physics
- Transition curve: `ease: [0.16, 1, 0.3, 1]`
- Duration: 200ms–350ms for micro-transitions
- Spring configurations: `stiffness: 400, damping: 25` for hover feedback

---

## 5. Performance & WebGL Shaders
- **Shader Isolation**: Shaders from `@paper-design/shaders-react` must be isolated in `vendor-shaders` chunk via `vite.config.ts`.
- **Diamond Tier Liquid Metal**: DiamondLiquidMetalBackground.tsx provides GPU-accelerated liquid metal shaders over the Diamond sponsorship tier with WebGL fallback and responsive speed scaling.
- **Audio Haptics**: Uses Web Audio API synthesizers in useWebHaptics.ts with local storage persistence.
- **Device Ratio & DPI Safety**: Root containers enforce `overflow-x-clip` and `max-w-full`. Cursor-tracking components (SpotlightCard) update direct CSS variables instead of trigger React re-renders.

---

## 6. Agent Safety & Integrity Rules
1. **Never break routing**: Route paths (`/`, `/buttons`, `/cards`, `/loaders`, `/mono-charts`, `/sponsors`, `/cli`, `/skills`, `/animations`, `/text-animations`) must resolve without regressions.
2. **Always verify builds**: Ensure `npm run build` exits with code 0 before concluding any modification.
3. **Preserve polar integration**: Keep `POLAR_DEFAULT_URL` and `POLAR_PRODUCT_IDS` mappings intact in `src/data/tiers.ts`.

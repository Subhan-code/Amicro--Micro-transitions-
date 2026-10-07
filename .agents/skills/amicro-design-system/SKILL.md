---
name: amicro-design-system
description: Rules, design tokens, card structures, motion physics, and component architecture for the Amicro UI library. Use whenever creating or modifying UI components, page sections, micro-interactions, or transition features in the Amicro repository.
---

# Amicro Design System & Component Guidelines

This skill defines the authoritative design tokens, component architecture, styling rules, and layout standards for the **Amicro** repository. All new features, micro-interactions, cards, loaders, and page transitions **MUST** strictly follow these rules to maintain perfect visual harmony and quality.

---

## 1. Core Design Tokens & Palette

### Font Family
- **Font**: `'Outfit', sans-serif` (configured in `index.css` under `@theme { --font-sans: 'Outfit', sans-serif; }`).
- **Headings**: `font-medium` or `font-semibold` with tight tracking (`tracking-[-0.01em]` or `tracking-[-0.019em]`).

### Color Palette (Dark & Light Theme)

| Token | Dark Mode (`.dark`) | Light Mode |
|---|---|---|
| **Page Background** | `#121212` | `#f8f9fa` |
| **Card Container BG** | `#161616` | `bg-white` |
| **Card Container Border** | `border-white/[0.07] hover:border-white/[0.18]` | `border-neutral-200/80 hover:border-neutral-300` |
| **Card Container Elevation** | `shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]` | `shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_28px_-6px_rgba(0,0,0,0.05)]` |
| **Preview Stage Canvas** | `#0d0d0d` + `shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]` | `#f5f6f8` + `shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]` |
| **Primary Text** | `#ffffff` / `#f0f0f0` | `#000000` |
| **Secondary / Muted Text** | `text-neutral-400` / `text-neutral-500` | `text-neutral-600` / `text-neutral-750` |
| **Pill / Button Inactive** | `bg-[rgba(255,255,255,0.07)]` | `bg-neutral-200/80` |
| **Pill / Button Active** | `bg-[#2a2a2a] text-white` | `bg-white text-black shadow-sm` |

---

## 2. Standard Card Architecture (Minimal Expanded Layout)

Every component entry in the catalog grid (Buttons, Card Spreads, 3D Carousels, Loaders, Page Transitions) **MUST** use the minimal, optimized card layout architecture:

### Gallery Container
```tsx
<div className="mx-auto max-w-[1800px] px-6 pt-5 pb-16 sm:px-10 sm:pt-3 lg:px-16 xl:px-24">
  <div className="space-y-6">
    {/* Island Filter Bar & Secondary Controls */}
    ...
    {/* Responsive Grid */}
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 transition-opacity duration-200 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-8">
      {/* Component Cards */}
    </div>
  </div>
</div>
```

### Component Card Architecture
```tsx
<article className="group/card relative">
  <a 
    href={detailUrl}
    onClick={handleClick}
    className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-3xl no-underline text-inherit"
  >
    {/* Expanded Borderless Playground Stage filling completely with black background */}
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black flex items-center justify-center p-4">
      {/* Component Live Interactive Preview Component Here */}
    </div>

    {/* Minimal Card Footer: Only Title & Description, Hover Copy Button */}
    <div className="flex items-center justify-between gap-3 pt-3 px-1">
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
          {label}
        </h3>
        <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate mt-0.5">
          {description}
        </p>
      </div>

      {/* Action Copy Button - Fades in on card hover */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleCopy}
        className="size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100"
        title="Copy component code"
      >
        <IconSwap>
          <IconSwapItem key={isCopied ? "check" : "copy"}>
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </IconSwapItem>
        </IconSwap>
      </motion.button>
    </div>
  </a>
</article>
```

---

## 3. Catalog Navigation & Pill Styling

- **Desktop Filter Pill Bar**:
  - Container: `hidden sm:flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 bg-[#181818] border-white/5` (Dark) / `bg-neutral-200/50 border-neutral-300/30` (Light).
  - Active Pill: `bg-[#2a2a2a] text-white` (Dark) / `bg-white text-black shadow-sm` (Light).
  - Inactive Pill: `text-[#767676] hover:text-white` (Dark) / `text-black opacity-70 hover:opacity-100` (Light).
- **Mobile Dropdown**:
  - Backdrop blur modal dropdown (`backdrop-blur-xl bg-[#181818]/95 border-white/5`).

---

## 4. Component Micro-Interactions & Haptics

- **Motion**: Use `motion/react` (`framer-motion`) with cubic bezier easing `[0.16, 1, 0.3, 1]` for exponential smooth reveals.
- **Haptics**: Always trigger `useWebHaptics` hook:
  - Copy Code: `triggerHaptic('success')`
  - Button Click / Tab Change: `triggerHaptic('medium')` or `triggerHaptic('light')`
  - Error: `triggerHaptic('error')`
- **Toast Notifications**: Always trigger `showToast("Copied ... code!")`.

---

## 5. CLI Registry Integration Rules

Whenever adding a new component or transition:
1. Add the component source file in `registry/ui/<category>/<name>.tsx`.
2. Register the component item in `registry/registry.json` with dependencies (`framer-motion`, etc.).
3. Provide copy CLI command snippet: `npx @subhanhq/amicro@latest add <kebab-name>`.

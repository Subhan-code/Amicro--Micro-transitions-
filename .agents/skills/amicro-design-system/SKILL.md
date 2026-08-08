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
| **Card Container BG** | `#181818` | `bg-white` |
| **Card Container Hover BG** | `#202020` | `bg-white` + `hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]` |
| **Preview Stage Canvas** | `#131313` | `#f4f4f6` |
| **Primary Text** | `#ffffff` / `#ededed` | `#000000` |
| **Secondary / Muted Text** | `#767676` / `text-neutral-400` | `text-neutral-600` / `text-neutral-750` |
| **Card Inset Border Glow** | `shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]` | `border border-neutral-100/85` |
| **Pill / Button Inactive** | `bg-[rgba(255,255,255,0.07)]` | `bg-neutral-200/80` |
| **Pill / Button Active** | `bg-[#2a2a2a] text-white` | `bg-white text-black shadow-sm` |

---

## 2. Standard Card Architecture

Every component entry in the catalog grid (Buttons, Card Spreads, 3D Carousels, Loaders, Page Transitions) **MUST** use the exact standard card layout geometry:

```tsx
<div className={`relative w-full max-w-[320px] sm:w-[320px] h-[220px] sm:h-[268px] rounded-[24px] transition-all duration-300 group ${
  theme === 'dark'
    ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]'
    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'
}`}>
  {/* Inner Preview Stage Canvas */}
  <div className={`absolute left-[12px] top-[12px] right-[12px] h-[150px] sm:h-[188px] rounded-[14px] flex items-center justify-center overflow-hidden transition-colors duration-300 ${
    theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
  }`}>
    <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${
      theme === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'
    }`} />
    {/* Component Live Interactive Preview Component Here */}
  </div>

  {/* Card Footer Bar */}
  <div className="absolute left-[16px] bottom-[14px] right-[16px] flex items-center justify-between">
    <span className={`text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
      theme === 'dark' ? 'text-white' : 'text-black'
    }`}>
      {label}
    </span>

    {/* Action Copy Button */}
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleCopy}
      className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
        isCopied
          ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-300')
          : (theme === 'dark' ? 'bg-white/[0.08] border-transparent hover:bg-white/[0.14] text-neutral-300 hover:text-white' : 'bg-neutral-100 border-transparent hover:bg-neutral-200 text-neutral-650 hover:text-black')
      }`}
    >
      <IconSwap>
        <IconSwapItem key={isCopied ? "check" : "copy"}>
          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </IconSwapItem>
      </IconSwap>
    </motion.button>
  </div>
</div>
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

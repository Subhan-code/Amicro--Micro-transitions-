import React from 'react';
import { motion } from 'motion/react';

export type CatalogCategory =
  | 'buttons'
  | 'morphing'
  | 'cards'
  | 'carousels'
  | 'loaders'
  | 'mono-charts'
  | 'anime'
  | '3d'
  | 'text-animations';

export interface CategoryItem {
  id: CatalogCategory;
  label: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'morphing', label: 'Morphing' },
  { id: 'cards', label: 'Card Spreads' },
  { id: 'carousels', label: '3D Carousels' },
  { id: 'loaders', label: 'Loaders' },
  { id: 'mono-charts', label: 'Mono Charts' },
  { id: 'anime', label: 'Animations' },
  { id: '3d', label: '3D' },
  { id: 'text-animations', label: 'Text Animations' },
];

interface CategoryPillBarProps {
  theme: 'dark' | 'light';
  selectedCategory: CatalogCategory;
  onSelectCategory: (category: CatalogCategory) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export function CategoryPillBar({
  theme,
  selectedCategory,
  onSelectCategory,
  triggerHaptic,
}: CategoryPillBarProps) {
  const isDark = theme === 'dark';

  return (
    <div className="w-full select-none max-w-[1600px] mx-auto py-2">
      
      {/* 1. Mobile Filter Layout (< sm): Individual Rounded-Corner Buttons */}
      <div className="block sm:hidden w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 py-1.5 scroll-smooth snap-x">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={`mobile-${cat.id}`}
                type="button"
                onClick={() => {
                  triggerHaptic?.('light');
                  onSelectCategory(cat.id);
                }}
                className={`h-8 px-3.5 rounded-full text-xs font-medium shrink-0 transition-all border snap-start active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? isDark
                      ? 'bg-white text-neutral-950 font-semibold border-white shadow-xs'
                      : 'bg-neutral-900 text-white font-semibold border-neutral-900 shadow-xs'
                    : isDark
                    ? 'bg-white/[0.05] border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                    : 'bg-black/[0.04] border-neutral-200 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Desktop Filter Layout (>= sm): Centered Stadium Pill Bar */}
      <div className="hidden sm:flex items-center justify-center w-full">
        <div
          role="tablist"
          aria-label="Component categories"
          className={`relative inline-flex items-center p-1 2xl:p-1.5 rounded-full border transition-all duration-300 gap-1 shrink-0 ${
            isDark
              ? 'bg-[#121214] border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]'
              : 'bg-white border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={`desktop-${cat.id}`}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                type="button"
                onClick={() => {
                  triggerHaptic?.('light');
                  onSelectCategory(cat.id);
                }}
                className={`relative px-3.5 lg:px-4 2xl:px-4.5 py-1.5 2xl:py-2 rounded-full text-[13px] 2xl:text-[13.5px] font-medium leading-none cursor-pointer transition-colors duration-200 border-0 bg-transparent shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 ${
                  isSelected
                    ? isDark
                      ? 'text-[#08080a] font-semibold'
                      : 'text-white font-semibold'
                    : isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span className="relative z-10">{cat.label}</span>

                {isSelected && (
                  <motion.div
                    layoutId="active-category-pill"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 34,
                      mass: 0.6,
                    }}
                    className={`absolute inset-0 rounded-full z-0 pointer-events-none shadow-sm ${
                      isDark ? 'bg-[#ededed]' : 'bg-[#09090b]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

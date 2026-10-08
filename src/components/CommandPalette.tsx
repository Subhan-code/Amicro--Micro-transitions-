import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight, Copy, Check, Sparkles, Layers, Box, Terminal, X, CornerDownLeft } from 'lucide-react';
import { buttonsData } from '../data/buttons';
import { cardsData } from '../data/cards';
import { loaderGroups } from '../data/loaders';
import { cssAnimationsData } from '../data/cssAnimationsData';
import { textAnimationsData } from '../data/textAnimations';
import { useWebHaptics } from '../hooks/useWebHaptics';

export interface SearchableItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  cliCommand: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (id: string, category: string) => void;
  showToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectComponent,
  showToast,
  theme = 'dark',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { trigger: triggerHaptic } = useWebHaptics();

  // Aggregate items across all categories
  const allItems: SearchableItem[] = useMemo(() => {
    const list: SearchableItem[] = [];

    // 1. Buttons
    buttonsData.forEach((btn) => {
      list.push({
        id: `btn-${btn.id}`,
        title: btn.label,
        category: 'Buttons',
        categorySlug: 'buttons',
        description: `${btn.interactionType.replace('-', ' ')} interaction with spring physics`,
        cliCommand: `npx @subhanhq/amicro@latest add button-${btn.interactionType}`,
      });
    });

    // 2. Cards & Carousels
    cardsData.forEach((card) => {
      list.push({
        id: card.interactionType || card.id,
        title: card.label,
        category: card.category === 'carousels' ? '3D Carousels' : 'Card Spreads',
        categorySlug: card.category === 'carousels' ? 'carousels' : 'cards',
        description: card.description,
        cliCommand: `npx @subhanhq/amicro@latest add ${card.interactionType || card.id}`,
      });
    });

    // 3. Loaders
    loaderGroups.forEach((group) => {
      group.loaders.forEach((loader) => {
        list.push({
          id: loader.kebabName,
          title: loader.name,
          category: 'Loaders',
          categorySlug: 'loaders',
          description: `${group.title} loader with kinetic timing`,
          cliCommand: `npx @subhanhq/amicro@latest add ${loader.kebabName}`,
        });
      });
    });

    // 4. CSS Animations
    cssAnimationsData.forEach((anim) => {
      list.push({
        id: anim.id,
        title: anim.name,
        category: 'Animations',
        categorySlug: 'animations',
        description: anim.description,
        cliCommand: `npx @subhanhq/amicro@latest add ${anim.id}`,
      });
    });

    // 5. Text Animations
    textAnimationsData.forEach((txt) => {
      list.push({
        id: txt.id,
        title: txt.name,
        category: 'Text Animations',
        categorySlug: 'text-animations',
        description: txt.description,
        cliCommand: `npx @subhanhq/amicro@latest add ${txt.id}`,
      });
    });

    // 6. Curated Morphing Items
    list.push(
      {
        id: 'dynamic-island',
        title: 'Dynamic Island Capsule',
        category: 'Morphing',
        categorySlug: 'morphing',
        description: 'Contextual capsule status and alert morphing',
        cliCommand: 'npx @subhanhq/amicro@latest add dynamic-island',
      },
      {
        id: 'add-to-cart-morph',
        title: 'Add To Cart Morph',
        category: 'Morphing',
        categorySlug: 'morphing',
        description: 'Button morphs into confirmation check with particles',
        cliCommand: 'npx @subhanhq/amicro@latest add add-to-cart-morph',
      },
      {
        id: 'shapes-heart-morph',
        title: 'Cartoon Shapes to Heart',
        category: 'Morphing',
        categorySlug: 'morphing',
        description: 'Geometric shapes bounce in and morph into solid heart',
        cliCommand: 'npx @subhanhq/amicro@latest add shapes-heart-morph',
      }
    );

    return list;
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    let result = allItems;
    if (activeCategoryFilter !== 'all') {
      result = result.filter((item) => item.categorySlug === activeCategoryFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 40);
  }, [allItems, activeCategoryFilter, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategoryFilter]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveCategoryFilter('all');
    }
  }, [isOpen]);

  const handleCopyCli = useCallback((item: SearchableItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.cliCommand);
    triggerHaptic('success');
    setCopiedId(item.id);
    showToast?.(`Copied ${item.cliCommand}`);
    setTimeout(() => setCopiedId(null), 1800);
  }, [triggerHaptic, showToast]);

  const handleSelectItem = useCallback((item: SearchableItem) => {
    triggerHaptic('medium');
    onClose();
    onSelectComponent(item.id, item.categorySlug);
  }, [triggerHaptic, onClose, onSelectComponent]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      triggerHaptic('light');
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      triggerHaptic('light');
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'morphing', label: 'Morphing' },
    { id: 'loaders', label: 'Loaders' },
    { id: 'animations', label: 'Animations' },
    { id: 'text-animations', label: 'Text' },
  ];

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] ${
              isDark
                ? 'bg-[#121214]/95 border-white/10 text-white shadow-black/80'
                : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-xl'
            }`}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/[0.08]">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search 160+ micro-interactions (e.g. spring, morph, loader)..."
                className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-neutral-500 font-sans tracking-tight"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-neutral-400 px-2 py-0.5 rounded border border-white/10 bg-white/5 shrink-0">
                <span>esc</span>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-white/[0.06] text-xs">
              {categories.map((cat) => {
                const isSelected = activeCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveCategoryFilter(cat.id);
                    }}
                    className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? isDark
                          ? 'bg-white text-black border-white shadow-xs font-semibold'
                          : 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-semibold'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-2.5 space-y-1 divide-y-0"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  <p>No micro-interactions found for "{query}".</p>
                  <p className="text-xs text-neutral-500 mt-1">Try searching for "button", "loader", "card", or "dock".</p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? isDark
                            ? 'bg-white/[0.09] text-white shadow-xs'
                            : 'bg-neutral-100 text-black'
                          : isDark
                          ? 'text-neutral-300 hover:bg-white/[0.04]'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`p-1.5 rounded-lg border shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-white/5 border-white/5 text-neutral-400'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate tracking-tight text-inherit">
                              {item.title}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-400 shrink-0">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Quick Action: Copy CLI command */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleCopyCli(item, e)}
                          title="Copy CLI command"
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                            isCopied
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-white/5 hover:bg-white/15 border-white/10 text-neutral-300'
                          }`}
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                          <span className="hidden sm:inline">CLI</span>
                        </button>

                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-neutral-500'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Hotkeys */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-black/20 border-t border-white/[0.06] text-[11.5px] text-neutral-400 font-sans">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="font-mono bg-white/5 border border-white/10 px-1 rounded">↑</kbd>
                  <kbd className="font-mono bg-white/5 border border-white/10 px-1 rounded">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="font-mono bg-white/5 border border-white/10 px-1 rounded">↵</kbd>
                  <span>open</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <span>Total:</span>
                <span className="font-semibold text-neutral-200">{allItems.length} components</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

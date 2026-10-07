"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { IconSwap, IconSwapItem } from "../IconSwap";
import { KEYFRAME_MORPH_ITEMS, KeyframeMorphItem } from "./keyframeMorphs";
import { formatCliCommand, getStoredRegistryMode } from "../../utils/registryPreference";

import { DynamicIsland } from "./DynamicIsland";
import { AddToCartMorph } from "./AddToCartMorph";
import { PlayPauseMorph } from "./PlayPauseMorph";
import { SearchExpand } from "./SearchExpand";
import { ShapesHeartMorph } from "./ShapesHeartMorph";

interface MorphingShapesPageProps {
  theme?: "dark" | "light";
  showToast?: (msg: string) => void;
  triggerHaptic?: (type: "light" | "medium" | "success" | "error") => void;
  onNavigateHome?: () => void;
  onSelectComponent?: (id: string) => void;
  embedded?: boolean;
}

type UnifiedMorphItem =
  | {
      id: string;
      name: string;
      description: string;
      registry: string;
      kind: "ui";
    }
  | {
      id: string;
      name: string;
      description: string;
      registry: string;
      kind: "shape";
      component: KeyframeMorphItem["component"];
    };

// Curated selection of top, distinct shape morphs (removing redundant/unwanted loops)
const CURATED_SHAPE_IDS = [
  "loader-morphing",
  "morph-diamond-squircle",
  "morph-organic-blob",
  "morph-jelly-skew",
  "morph-star-kinetic",
  "morph-capsule-stretch",
];

const CURATED_SHAPES: UnifiedMorphItem[] = KEYFRAME_MORPH_ITEMS.filter((item) =>
  CURATED_SHAPE_IDS.includes(item.id)
).map((item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  registry: item.registry,
  kind: "shape" as const,
  component: item.component,
}));

const UI_MORPHS: UnifiedMorphItem[] = [
  {
    id: "dynamic-island",
    name: "Dynamic Island",
    description: "Compact status capsule that morphs into contextual actions and alerts.",
    registry: "dynamic-island",
    kind: "ui",
  },
  {
    id: "add-to-cart-morph",
    name: "Add to Cart Morph",
    description: "Button morphs into confirmation check with flying particle counter.",
    registry: "add-to-cart-morph",
    kind: "ui",
  },
  {
    id: "play-pause-morph",
    name: "Play / Pause Morph",
    description: "40px media button with smooth geometric SVG path interpolation.",
    registry: "play-pause-morph",
    kind: "ui",
  },
  {
    id: "shapes-heart-morph",
    name: "Cartoon Shapes to Heart",
    description: "Five flat cartoon shapes bounce in, fade away, and morph into a solid red heart.",
    registry: "shapes-heart-morph",
    kind: "ui",
  },
  {
    id: "search-expand",
    name: "Search Expand",
    description: "Minimal 40px circle trigger expanding into full auto-focused search bar.",
    registry: "search-expand",
    kind: "ui",
  },
];

// Single unified minimal list merging UI micro-morphs and curated shape morphs
const ALL_MORPHS: UnifiedMorphItem[] = [...UI_MORPHS, ...CURATED_SHAPES];

export function MorphingShapesPage({
  theme = "dark",
  showToast,
  triggerHaptic,
  onSelectComponent,
}: MorphingShapesPageProps) {
  const isDark = theme === "dark";
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const registryMode = getStoredRegistryMode();

  const handleCopyCli = (registryId: string, id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    triggerHaptic?.("success");
    const cmd = formatCliCommand(registryId, registryMode);
    navigator.clipboard?.writeText(cmd).catch(() => {});
    setCopiedId(id);
    showToast?.(`Copied: ${cmd}`);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleCardClick = (id: string, registryId: string) => {
    triggerHaptic?.("light");
    if (onSelectComponent) {
      onSelectComponent(id);
    } else {
      handleCopyCli(registryId, id);
    }
  };

  return (
    <div className="w-full">
      {/* Standard Amicro Responsive Component Grid */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-8">
        {ALL_MORPHS.map((item, index) => {
          const isCopied = copiedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.32,
                delay: Math.min(index * 0.02, 0.25),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <article className="group/card relative">
                <div
                  onClick={() => handleCardClick(item.id, item.registry)}
                  className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-3xl no-underline text-inherit cursor-pointer"
                >
                  {/* Live Interactive Preview Box */}
                  <div
                    className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 flex items-center justify-center p-4 sm:p-6 ${
                      isDark
                        ? "bg-black border-white/[0.07] group-hover/card:border-white/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                        : "bg-[#f5f6f8] border-neutral-200/80 group-hover/card:border-neutral-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    <div
                      onClick={(e) => {
                        const isTouch =
                          typeof window !== "undefined" &&
                          (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
                        if (isTouch) e.stopPropagation();
                      }}
                      className="cursor-default flex items-center justify-center w-full"
                    >
                      {item.kind === "shape" ? (
                        <item.component
                          size={52}
                          color={isDark ? "#ffffff" : "#000000"}
                        />
                      ) : item.id === "dynamic-island" ? (
                        <DynamicIsland />
                      ) : item.id === "add-to-cart-morph" ? (
                        <AddToCartMorph />
                      ) : item.id === "play-pause-morph" ? (
                        <PlayPauseMorph />
                      ) : item.id === "shapes-heart-morph" ? (
                        <ShapesHeartMorph />
                      ) : item.id === "search-expand" ? (
                        <SearchExpand />
                      ) : null}
                    </div>
                  </div>

                  {/* Card Info and Action Row */}
                  <div className="flex items-center justify-between gap-3 pt-3 px-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate capitalize mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => handleCopyCli(item.registry, item.id, e)}
                      type="button"
                      className={`size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 opacity-80 sm:opacity-0 sm:group-hover/card:opacity-100 focus-visible:opacity-100 ${
                        isCopied
                          ? "opacity-100 bg-white/10 border-white/30 text-white"
                          : ""
                      }`}
                      aria-label="Copy component command"
                      title="Copy component command"
                    >
                      <IconSwap>
                        <IconSwapItem key={isCopied ? "check" : "copy"}>
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </IconSwapItem>
                      </IconSwap>
                    </motion.button>
                  </div>
                </div>
              </article>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

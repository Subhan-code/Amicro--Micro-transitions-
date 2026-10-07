import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MapleLogo } from './MapleLogo';
import { DiamondAskSlot } from './DiamondAskSlot';

export type StickerTier = 'diamond' | 'gold' | 'silver';

interface StickerItem {
  id: string;
  name: string;
  role: string;
  tier: StickerTier;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  rotation: number; // degrees
  type: 'maple' | 'vercel' | 'shadcn' | 'ossium' | 'tracwell' | 'empty';
  url?: string;
}

const DEFAULT_STICKERS: StickerItem[] = [
  {
    id: 's-maple',
    name: 'Maple',
    role: 'Sponsor',
    tier: 'diamond',
    x: 18,
    y: 34,
    rotation: 0,
    type: 'maple',
    url: 'https://maple.dev',
  },
  {
    id: 's-vercel',
    name: 'Vercel',
    role: 'OSS',
    tier: 'diamond',
    x: 43,
    y: 34,
    rotation: 0,
    type: 'vercel',
    url: 'https://vercel.com/oss',
  },
  {
    id: 's-empty',
    name: 'Your logo',
    role: 'Available Slot',
    tier: 'diamond',
    x: 75,
    y: 34,
    rotation: 0,
    type: 'empty',
  },
  {
    id: 's-shadcn',
    name: 'shadcn/ui',
    role: 'Registry',
    tier: 'gold',
    x: 23,
    y: 64,
    rotation: 0,
    type: 'shadcn',
    url: 'http://ui.shadcn.com/docs/directory?q=amicro',
  },
  {
    id: 's-ossium',
    name: 'Ossium',
    role: 'OSS Directory',
    tier: 'gold',
    x: 52,
    y: 64,
    rotation: 0,
    type: 'ossium',
    url: 'https://ossium.in/home/repos/Subhan-code/Amicro--Micro-transitions-',
  },
  {
    id: 's-tracwell',
    name: 'Tracwell',
    role: 'Analytics',
    tier: 'gold',
    x: 79,
    y: 64,
    rotation: 0,
    type: 'tracwell',
    url: 'https://tracwell.app',
  },
];

interface StickerBoardProps {
  isDark: boolean;
  onScrollToTiers?: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export const StickerBoard: React.FC<StickerBoardProps> = ({
  isDark = true,
  onScrollToTiers,
  triggerHaptic,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<StickerItem[]>(DEFAULT_STICKERS);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [zOrder, setZOrder] = useState<string[]>(DEFAULT_STICKERS.map((s) => s.id));
  const [scaleRatio, setScaleRatio] = useState(1);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const ratio = Math.max(0.65, Math.min(width / 872, 1.1));
        setScaleRatio(ratio);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const dragState = useRef<{
    stickerId: string;
    startX: number;
    startY: number;
    initialStickerX: number;
    initialStickerY: number;
    hasMoved: boolean;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic?.('light');

    const sticker = stickers.find((s) => s.id === id);
    if (!sticker) return;

    setActiveStickerId(id);
    setZOrder((prev) => [...prev.filter((item) => item !== id), id]);

    dragState.current = {
      stickerId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialStickerX: sticker.x,
      initialStickerY: sticker.y,
      hasMoved: false,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !containerRef.current) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragState.current.hasMoved = true;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const percentX = (dx / bounds.width) * 100;
    const percentY = (dy / bounds.height) * 100;

    const newX = Math.max(8, Math.min(92, dragState.current.initialStickerX + percentX));
    const newY = Math.max(10, Math.min(90, dragState.current.initialStickerY + percentY));

    setStickers((prev) =>
      prev.map((s) =>
        s.id === dragState.current?.stickerId ? { ...s, x: newX, y: newY } : s
      )
    );
  };

  const handleCtaClick = () => {
    triggerHaptic?.('medium');
    if (onScrollToTiers) {
      onScrollToTiers();
    } else {
      const elem = document.getElementById('sponsorship-tiers');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePointerUp = () => {
    if (!dragState.current) return;

    if (!dragState.current.hasMoved) {
      const sticker = stickers.find((s) => s.id === dragState.current?.stickerId);
      if (sticker?.type === 'empty') {
        handleCtaClick();
      } else if (sticker?.url) {
        window.open(sticker.url, '_blank');
      }
    }

    dragState.current = null;
    setActiveStickerId(null);
  };

  return (
    <div className="w-full max-w-[872px] mx-auto select-none">
      {/* Frame: rounded-[20px] bg-[#0c0c0e] outline-white/[0.06] shadow + 12px inner lip */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`@container relative z-0 aspect-[872/504] w-full overflow-hidden rounded-[20px] p-4 sm:p-6 touch-none transition-colors select-none ${
          isDark
            ? 'bg-[#0c0c0e] outline -outline-offset-1 outline-white/[0.06] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.04)]'
            : 'bg-[#f4f4f6] outline -outline-offset-1 outline-black/[0.08] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* Amicro Wordmark Centerpiece - Watermark inside laptop container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className={`font-black tracking-tight select-none leading-none text-[clamp(2.5rem,10cqi,5.5rem)] ${
            isDark ? 'text-white/[0.045]' : 'text-black/[0.045]'
          }`}>
            Amicro
          </span>
        </div>

        {/* Draggable Sponsor Stickers Layer */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {stickers.map((sticker) => {
            const zIndexVal = zOrder.indexOf(sticker.id) + 10;
            const isActive = activeStickerId === sticker.id;

            return (
              <div
                key={sticker.id}
                onPointerDown={(e) => handlePointerDown(e, sticker.id)}
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) scale(${scaleRatio})`,
                  zIndex: isActive ? 29 : zIndexVal,
                  transition: isActive
                    ? 'none'
                    : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="absolute cursor-grab active:cursor-grabbing select-none will-change-transform"
              >
                {renderSticker(sticker, handleCtaClick, triggerHaptic)}
              </div>
            );
          })}
        </div>

        {/* Bottom Button: 16px off the bottom edge, white pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={handleCtaClick}
            className={`flex items-center justify-center gap-1.5 h-10 px-5 rounded-full text-sm font-medium transition-colors cursor-pointer border-0 select-none whitespace-nowrap shadow-sm ${
              isDark
                ? 'bg-neutral-50 text-black hover:bg-neutral-200'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <span>Sponsor &amp; get yourself here</span>
            <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-black' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

function renderSticker(
  sticker: StickerItem,
  onEmptyClick?: () => void,
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void
) {
  const wrapWithRole = (card: React.ReactNode) => (
    <div className="flex flex-col items-center group/sticker select-none">
      {card}
      {sticker.role ? (
        <span className="text-[9px] sm:text-[9.5px] font-mono tracking-wider uppercase mt-1 px-1.5 py-0.5 rounded text-white/40 group-hover/sticker:text-white/70 transition-colors select-none pointer-events-none">
          {sticker.role}
        </span>
      ) : null}
    </div>
  );

  const baseCard = (icon: React.ReactNode, name: string) =>
    wrapWithRole(
      <div className="px-4 py-2.5 sm:py-3 rounded-[14px] bg-white/[0.06] hover:bg-white/[0.1] flex items-center gap-2.5 transition-colors select-none text-neutral-50 border-0">
        <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-[14px] sm:text-[15px] leading-[20px] font-semibold tracking-tight whitespace-nowrap">
          {name}
        </span>
      </div>
    );

  switch (sticker.type) {
    case 'maple':
      return wrapWithRole(
        <div className="px-5 py-3 sm:py-3.5 rounded-[14px] bg-white/[0.06] hover:bg-white/[0.1] flex items-center gap-3 transition-colors select-none text-neutral-50 border-0">
          <div className="w-[26px] h-[26px] flex items-center justify-center shrink-0">
            <MapleLogo className="w-[26px] h-[26px] shrink-0" />
          </div>
          <span className="text-[16px] sm:text-[17px] leading-[22px] font-semibold tracking-tight whitespace-nowrap">
            {sticker.name}
          </span>
        </div>
      );

    case 'empty':
      return wrapWithRole(
        <DiamondAskSlot
          variant="canvas"
          triggerHaptic={triggerHaptic}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEmptyClick?.();
          }}
        />
      );

    case 'vercel':
      return baseCard(
        <svg viewBox="0 0 76 65" fill="currentColor" className="w-[20px] h-[20px] text-white">
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>,
        sticker.name
      );

    case 'shadcn':
      return baseCard(
        <div className="w-[22px] h-[22px] rounded-md bg-black flex items-center justify-center text-white font-mono text-[10px] font-bold">
          //
        </div>,
        sticker.name
      );

    case 'ossium':
      return baseCard(
        <img
          src="https://ossium.in/_next/image?url=%2Fossium_logo.webp&w=256&q=75"
          alt="Ossium"
          className="w-[22px] h-[22px] object-contain rounded-md"
        />,
        sticker.name
      );

    case 'tracwell':
      return baseCard(
        <img
          src="https://tracwell.app/brand/downloads/tracwell-icon-dark.svg"
          alt="Tracwell"
          className="w-[22px] h-[22px] object-contain rounded-md"
        />,
        sticker.name
      );

    default:
      return null;
  }
}

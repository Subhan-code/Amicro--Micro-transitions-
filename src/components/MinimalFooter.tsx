import React from 'react';
import { NavItemKey } from './MinimalNavbar';

interface MinimalFooterProps {
  theme: 'dark' | 'light';
  onNavigate?: (key: NavItemKey) => void;
  onNavigateHome?: () => void;
  showToast?: (msg: string) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export function MinimalFooter({
  onNavigateHome,
  triggerHaptic,
}: MinimalFooterProps) {
  return (
    <footer className="relative z-10 w-full border-t border-white/[0.03] select-none">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-6 text-[13px] text-neutral-400">
        {/* Left: Website Logo & Name + Created by Syed Subhan */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            onClick={(e) => {
              if (onNavigateHome && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                triggerHaptic?.('light');
                onNavigateHome();
              }
            }}
            className="inline-flex items-center gap-2 text-inherit no-underline hover:text-white transition-colors cursor-pointer"
            title="Amicro — Home"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10 shadow-xs">
              <img src="/favicon.jpg" alt="Amicro" className="w-full h-full object-cover" />
            </span>
            <span className="font-semibold tracking-tight text-[13.5px] text-neutral-100">Amicro</span>
          </a>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">
            Created by{' '}
            <a
              href="https://x.com/SubhanHQ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              className="font-medium no-underline hover:underline text-neutral-200 hover:text-white transition-colors"
            >
              Syed Subhan
            </a>
          </span>
        </div>

        {/* Right: © 2026 amicro · License */}
        <div className="flex items-center gap-2 text-[12.5px] text-neutral-400">
          <span>© 2026 amicro</span>
          <span>·</span>
          <a
            href="https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic?.('light')}
            className="no-underline hover:underline text-neutral-300 hover:text-white transition-colors"
          >
            License
          </a>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, LayoutTemplate, ArrowDownAZ, Copy } from 'lucide-react';
import { buttonsData } from './data/buttons';
import { AnimatedButton } from './components/AnimatedButton';

type LayoutMode = 'list' | 'grid' | 'matrix';
type SortMode = 'default' | 'alphabetical';

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [sortBy, setSortBy] = useState<SortMode>('default');

  const displayedButtons = useMemo(() => {
    let sorted = [...buttonsData];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.label.localeCompare(b.label));
    }
    return sorted;
  }, [sortBy]);

  return (
    <div className="relative w-full min-h-screen bg-[#121212] flex flex-col font-sans antialiased text-[#ffffff] selection:bg-neutral-800">
      
      {/* Site Navbar */}
      <header className="relative z-50 w-full pt-4 pb-4 px-6">
        <div className="relative z-[3] flex items-center justify-between gap-4 max-w-[1240px] mx-auto">
          <div className="flex items-center gap-[34px] min-w-0">
            <a href="/" className="inline-flex items-center gap-[4px] h-[35px] py-[5px] text-white no-underline shrink-0 group transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]">
              <span className="inline-flex items-center justify-center w-[24px] h-[24px] text-[#ededed] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center group-hover:rotate-[60deg]">
                <svg viewBox="0 0 18 20.2947" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[20.295px] block">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 0L12.5409 1.99176L11.5604 3.73491L10 2.8572V5.14735H8V2.8572L6.43962 3.73491L5.45909 1.99176L9 0ZM14.3613 3.01571L18 5.0625V9.14735H16V7.3794L14.0359 8.51337L13.0359 6.78132L14.9804 5.65867L13.3807 4.75886L14.3613 3.01571ZM4.61925 4.75887L3.01961 5.65867L4.9641 6.78132L3.9641 8.51337L2 7.3794L2 9.14735H0L1.54972e-06 5.0625L3.63873 3.01572L4.61925 4.75887ZM2 11.1473V12.9153L3.9641 11.7813L4.9641 13.5134L3.01961 14.636L4.61925 15.5358L3.63873 17.279L3.57628e-07 15.2322V11.1473H2ZM18 11.1473V15.2322L14.3613 17.279L13.3807 15.5358L14.9804 14.636L13.0359 13.5134L14.0359 11.7813L16 12.9153V11.1473H18ZM10 15.1473V17.4375L11.5604 16.5598L12.5409 18.3029L9 20.2947L5.45908 18.3029L6.43961 16.5598L8 17.4375V15.1473H10Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.0981 9.51337L10 10.7247V13.1474H8V10.7247L5.90192 9.51337L6.90192 7.78132L9 8.99265L11.0981 7.78132L12.0981 9.51337Z" fill="currentColor"></path>
                </svg>
              </span>
              <span className="text-[15px] font-medium leading-none tracking-[-0.01em] whitespace-nowrap ml-1">
                <span>Oxygen</span><span className="text-[#8f8f8f]"> UI</span>
              </span>
            </a>
            <nav className="hidden sm:flex items-center gap-[8px]">
              <a href="/" className="inline-flex items-center justify-center h-[36px] px-[13px] rounded-full text-[13px] font-medium leading-[16px] text-white bg-[rgba(255,255,255,0.06)] no-underline whitespace-nowrap transition-colors duration-150">Components</a>
              <a href="#" className="inline-flex items-center justify-center h-[36px] px-[13px] rounded-full text-[13px] font-medium leading-[16px] text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] no-underline whitespace-nowrap transition-colors duration-150">Documentation</a>
            </nav>
          </div>
          <div className="flex items-center gap-[8px]">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 h-[36px] px-[13px] rounded-full bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] active:bg-[rgba(255,255,255,0.08)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed] font-sans text-[13px] font-medium leading-[16px] no-underline transition-colors duration-150 group">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-auto h-[16px] max-w-[16px] block">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="inline-block">2k</span>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.1)] active:bg-[rgba(255,255,255,0.08)] text-[rgba(237,237,237,0.6)] hover:text-[#ededed] transition-colors duration-150">
              <svg viewBox="0 0 16 17" fill="currentColor" className="w-[16px] h-[17px] block">
                <path d="M12.4041 1.39726H14.6953L9.69087 7.2591L15.5781 15.2368H10.9696L7.35741 10.3996L3.22921 15.2368H0.934687L6.28641 8.96575L0.642598 1.39726H5.36795L8.62962 5.81859L12.4041 1.39726ZM11.5992 13.8329H12.8682L4.67667 2.72798H3.31359L11.5992 13.8329Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center">
        
        <div className="mt-12 mb-16 text-center w-full flex flex-col items-center">
          <h1 className="text-[36px] font-medium leading-[42px] tracking-[-0.005em] text-white mb-2 font-sans">
            Ready to use UI components
          </h1>
          <p className="text-[#767676] text-[16px] leading-[24px] max-w-[430px]">
            Collection of the most essential UI components for web apps. Copy and paste them directly in your project.
          </p>

          <div className="flex items-center gap-2 sm:gap-4 mt-8">
            <div className="flex items-center bg-[#181818] p-1 rounded-full border border-white/5 shadow-inner">
              <button
                onClick={() => setSortBy(sortBy === 'default' ? 'alphabetical' : 'default')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${sortBy === 'alphabetical' ? 'bg-[#2a2a2a] text-white' : 'text-[#767676] hover:text-white'}`}
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">A-Z</span>
              </button>
            </div>
            <div className="flex items-center bg-[#181818] p-1 rounded-full border border-white/5 shadow-inner">
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-full transition-colors ${layout === 'list' ? 'bg-[#2a2a2a] text-white' : 'text-[#767676] hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-full transition-colors ${layout === 'grid' ? 'bg-[#2a2a2a] text-white' : 'text-[#767676] hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('matrix')}
                className={`p-1.5 rounded-full transition-colors ${layout === 'matrix' ? 'bg-[#2a2a2a] text-white' : 'text-[#767676] hover:text-white'}`}
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div 
          className={`
            w-full flex justify-center gap-[24px]
            ${layout === 'list' ? 'flex-col max-w-sm' : ''}
            ${layout === 'grid' ? 'flex-wrap' : ''}
            ${layout === 'matrix' ? 'flex-wrap max-w-4xl gap-4' : ''}
          `}
        >
          <AnimatePresence mode="popLayout">
            {displayedButtons.map((button) => (
              <motion.div 
                layout 
                key={button.id}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`${layout === 'list' ? 'w-full' : ''}`}
              >
                {layout === 'grid' ? (
                  <div className="relative w-[320px] h-[344px] rounded-[24px] bg-[#181818] shadow-[0_1px_3px_0_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06),inset_0_-1px_0_0_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(196,196,196,0.07)] hover:bg-[color-mix(in_srgb,#181818_99.5%,#fff_0.5%)] transition-colors duration-200 group">
                    <div className="absolute left-[12px] top-[12px] w-[296px] h-[260px] rounded-[14px] overflow-hidden bg-[#131313] flex items-center justify-center">
                      <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_0_1px_rgba(191,192,203,0.08)] pointer-events-none z-10" />
                      <AnimatedButton config={button} layoutMode={layout} />
                    </div>
                    <div className="absolute left-[20px] bottom-[20px] w-[calc(100%-80px)] flex flex-col gap-[6px]">
                      <div className="text-[13px] font-medium leading-[18px] text-[#ededed]">{button.label}</div>
                      <div className="text-[13px] font-normal leading-[13px] text-[#767676] capitalize">{button.interactionType.replace('-', ' ')} interaction</div>
                    </div>
                    <button type="button" className="absolute right-[20px] bottom-[16px] w-[36px] h-[36px] rounded-full bg-white/[0.08] hover:bg-white/[0.1] active:bg-white/[0.1] flex items-center justify-center text-[#ededed]/60 hover:text-[#ededed] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ededed]" aria-label="Copy interaction code">
                      <Copy className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                  </div>
                ) : (
                  <AnimatedButton config={button} layoutMode={layout} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recommended course CTA */}
      <aside className="relative z-10 w-full max-w-[720px] mx-auto mt-[70px] mb-[70px] flex items-start sm:items-center gap-2.5 sm:gap-[24px] px-6 sm:px-0">
        <span className="w-[2px] h-[78px] bg-white/[0.14] rounded-[1px] shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[24px]">
          <div className="flex-1 min-w-0 flex flex-col gap-[10px] max-w-[432px]">
            <p className="m-0 text-[14px] leading-[1.4] text-white">
              If you want to use beautiful ready-to-use UI components, I highly recommend <a href="#" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors duration-180">Oxygen UI</a>.
            </p>
            <p className="m-0 flex flex-col text-[13px] leading-[18px] opacity-70">
              <span className="text-[#e9e9e9]">Syed Subhan</span>
              <span className="text-[#767676]">Creator of Oxygen UI</span>
            </p>
          </div>
          <a className="inline-flex items-center gap-[4px] h-[40px] px-[16px] rounded-[24px] bg-[#ffffff] text-[#0d0d0d] font-medium text-[13px] leading-[13px] no-underline transition-colors duration-200 hover:bg-[#e8e8e8] active:bg-[#d8d8d8] shrink-0 sm:ml-auto group" href="#" target="_blank" rel="noopener noreferrer">
            <span>Get Oxygen UI</span>
            <span className="inline-flex w-[16px] h-[16px]">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M7.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V8.5"></path>
                <g className="transition-transform duration-250 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]">
                  <path d="M8.5 7.5L13.5 2.5M10 2.5H13.5V6"></path>
                </g>
              </svg>
            </span>
          </a>
        </div>
      </aside>

      <footer className="relative z-10 w-full text-center pb-[24px] text-[13px] leading-[14px]">
        <span className="text-[#8f8f8f]">Created by</span>
        <a className="text-[#e9e9e9] hover:text-white no-underline ml-[4px]" href="#" target="_blank" rel="noopener noreferrer">Syed Subhan</a>
        <span className="text-[#8f8f8f] mx-1">·</span>
        <a className="text-[#e9e9e9] hover:text-white no-underline" href="#">Terms & License</a>
      </footer>
    </div>
  );
}

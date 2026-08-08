import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Users } from 'lucide-react';
import { cn } from './lib/utils';

const RANGES = [
  { name: '7D', days: 7 },
  { name: '14D', days: 14 },
  { name: '30D', days: 30 },
  { name: '90D', days: 90 },
];

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

function AnimatedNumber({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 190, damping: 27, mass: 0.7 });
  const display = useTransform(spring, (current) => 
    '+' + Math.round(current).toLocaleString('en-US')
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      spring.jump(value);
    } else {
      spring.set(value);
    }
  }, [value, spring, prefersReducedMotion]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

function formatDate(offsetDays: number) {
  const date = new Date(2026, 6, 14); // Anchor to Jul 14, 2026 for instance
  date.setDate(date.getDate() - offsetDays);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MembersGrowthChart() {
  const [rangeIndex, setRangeIndex] = useState(2); // 30D default
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const range = RANGES[rangeIndex];
  
  // Scrubber State
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const targetX = useSpring(0, { stiffness: 650, damping: 42, mass: 0.5 });
  const targetY = useSpring(0, { stiffness: 650, damping: 42, mass: 0.5 });

  const { data, dates, total, maxVal } = useMemo(() => {
    const days = range.days;
    const newData = [];
    const newDates = [];
    let tot = 0;
    let mv = 3;
    for (let i = 0; i < days; i++) {
      const t = i / (days - 1);
      const base = 9 + t * 23;
      const wave = 6 * Math.sin(i * 0.7 + 1) + 3 * Math.sin(i * 1.9);
      const val = Math.max(3, Math.round(base + wave));
      newData.push(val);
      tot += val;
      if (val > mv) mv = val;
      newDates.push(formatDate(days - 1 - i));
    }
    return { data: newData, dates: newDates, total: tot, maxVal: mv };
  }, [rangeIndex]);

  // First mount reveal
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // Animation Refs
  const timeRef = useRef(0);
  const requestRef = useRef<number>();
  const pointerPosRef = useRef({ x: -100, y: -100 });
  const pointerActiveRef = useRef(false);
  
  const fromDataRef = useRef([...data]);
  const fromMaxRef = useRef(maxVal);
  const targetDataRef = useRef([...data]);
  const targetMaxRef = useRef(maxVal);
  const morphStartTimeRef = useRef(0);

  useEffect(() => {
    fromDataRef.current = targetDataRef.current.map((_, i) => targetDataRef.current[i]);
    fromMaxRef.current = targetMaxRef.current;
    
    targetDataRef.current = [...data];
    targetMaxRef.current = maxVal;
    
    // Quick resample if array sizes mismatch (not ideal but works for cross-fade)
    if (fromDataRef.current.length !== targetDataRef.current.length) {
       const len = targetDataRef.current.length;
       const old = fromDataRef.current;
       fromDataRef.current = Array(len).fill(0).map((_, i) => {
         const t = i / (len - 1);
         const oldIdx = Math.round(t * (old.length - 1));
         return old[oldIdx];
       });
    }
    
    morphStartTimeRef.current = performance.now();
  }, [data, maxVal]);

  useEffect(() => {
    const draw = () => {
      timeRef.current += 0.03;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.imageSmoothingEnabled = false;
      }
      
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      
      const w = rect.width;
      const h = rect.height;
      const cell = Math.max(3, Math.round(w / 180));
      
      let prog = 0;
      if (morphStartTimeRef.current > 0) {
        prog = (performance.now() - morphStartTimeRef.current) / 460;
        if (prog > 1) prog = 1;
      } else {
        prog = 1;
      }
      
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        prog = 1;
        timeRef.current = 0;
      }
      
      const curMax = fromMaxRef.current + (targetMaxRef.current - fromMaxRef.current) * prog;
      const curData = targetDataRef.current.map((v, i) => fromDataRef.current[i] + (v - fromDataRef.current[i]) * prog);
      
      const px = pointerPosRef.current.x;
      const py = pointerPosRef.current.y;
      const isActive = pointerActiveRef.current;
      
      for (let x = 0; x < w; x += cell) {
        const t = x / w;
        const exactIdx = t * (curData.length - 1);
        const i0 = Math.floor(exactIdx);
        const i1 = Math.min(i0 + 1, curData.length - 1);
        const frac = exactIdx - i0;
        const val = curData[i0] + (curData[i1] - curData[i0]) * frac;
        
        const headroom = 0.16 * h;
        const plotH = h - headroom;
        const curveY = h - plotH * (val / curMax);
        
        for (let y = h; y >= 0; y -= cell) {
          // Faint rest tile always
          ctx.fillStyle = 'rgba(230, 230, 240, 0.5)'; // approximate oklch(0.9 0.02 264)
          ctx.fillRect(x + 1, y + 1, cell - 1, cell - 1);
          
          if (y < curveY) continue;
          
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          let glow = 0;
          if (isActive && !reducedMotion) {
             // Glow radius based on distance
             const rad = h * 0.35;
             glow = 1 - smoothstep(0, rad, dist);
          }
          
          const shimmer = reducedMotion ? 0 : Math.sin(y * 0.1 - timeRef.current * 2) * 0.07;
          
          ctx.fillStyle = '#FFFFFF';
          const sz = cell * (0.7 + shimmer + glow * 0.3);
          const alpha = 0.6 + glow * 0.4;
          ctx.globalAlpha = alpha;
          
          const offset = (cell - sz) / 2;
          ctx.fillRect(x + offset, y + offset, sz, sz);
          ctx.globalAlpha = 1;
        }
      }
      
      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };
    
    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  const handlePointer = (e: React.MouseEvent | React.PointerEvent) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    pointerPosRef.current = { x, y };
    pointerActiveRef.current = true;
    
    const w = rect.width;
    const h = rect.height;
    
    const t = clamp(x / w, 0, 1);
    const idx = Math.round(t * (data.length - 1));
    setScrubIndex(idx);
    
    const actualT = data.length > 1 ? idx / (data.length - 1) : 0.5;
    targetX.set(actualT * w);
    
    const val = data[idx];
    const headroom = 0.16 * h;
    const plotH = h - headroom;
    const curveY = h - plotH * (val / maxVal);
    targetY.set(curveY);
  };
  
  const handlePointerLeave = () => {
    pointerActiveRef.current = false;
    setScrubIndex(null);
  };

  const xPos = useTransform(targetX, x => `${x}px`);
  const yPos = useTransform(targetY, y => `${y}px`);
  
  const ticks = [maxVal, Math.round(maxVal * 0.66), Math.round(maxVal * 0.33), 0];
  const dateLabels = [
    dates[0],
    dates[Math.floor(dates.length * 0.25)],
    dates[Math.floor(dates.length * 0.5)],
    dates[Math.floor(dates.length * 0.75)],
    dates[dates.length - 1],
  ];

  return (
    <div className="chart-stage-in pt-8">
      <div className="chart-frame">
        <div style={{ width: 500, zoom: 0.688 }}>
          <div className="flex justify-center w-full font-sans">
            <div className="w-full max-w-[500px] flex flex-col items-center gap-[14px]">
              
              <div className="w-full bg-[#FAFAFB] rounded-[14px] p-1.5 flex flex-col gap-1.5">
                
                {/* KPI Card */}
                <div className="flex gap-1.5">
                  <button className="flex-1 bg-white rounded-[10px] p-[12px_14px] flex flex-col gap-1 text-left shadow-[0_0_1.76px_rgba(0,0,0,0.08),0_1px_1.76px_rgba(25,28,33,0.06),0_0_0_1px_rgba(25,28,33,0.04)] outline-none border-none cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-[#8A90A0]" />
                      <span className="text-[12.5px] font-medium tracking-[-0.006em] text-[#171717]">New members</span>
                    </div>
                    <div className="flex items-baseline gap-[7px]">
                      <span className="text-[27px] font-semibold tracking-[-0.015em] text-[#171717] leading-[1.15]">
                        <AnimatedNumber value={total} />
                      </span>
                      <span className="text-[12px] font-medium text-[#2563EB] tabular-nums">↑ 12%</span>
                    </div>
                  </button>
                </div>

                {/* Chart Card */}
                <div className="bg-white rounded-[10px] p-[16px] flex flex-col shadow-[0_0_1.76px_rgba(0,0,0,0.08),0_1px_1.76px_rgba(25,28,33,0.06),0_0_0_1px_rgba(25,28,33,0.04)]">
                  <div className="flex gap-2 items-start">
                    <div className="relative w-[30px] h-[194px] shrink-0">
                       {ticks.map((t, i) => (
                         <span key={i} className="absolute right-0 text-[10px] font-normal text-[#9AA0A6] tabular-nums" style={{ top: `${(i / 3) * 84 + 16}%`, transform: 'translateY(-50%)' }}>
                           {t}
                         </span>
                       ))}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div 
                        ref={wrapperRef}
                        className="relative h-[194px] touch-none cursor-crosshair"
                        onPointerMove={handlePointer}
                        onPointerLeave={handlePointerLeave}
                      >
                        <div className="absolute inset-0 rounded-[5px] pointer-events-none" style={{ background: 'repeating-linear-gradient(-45deg, rgba(79, 96, 132, 0.04) 0px, rgba(79, 96, 132, 0.04) 1px, transparent 1px, transparent 7px)' }} />
                        <div className="absolute left-0 right-0 top-[16%] border-t border-dashed border-[#7882962E] pointer-events-none" />
                        <div className="absolute left-0 right-0 top-[44%] border-t border-dashed border-[#7882962E] pointer-events-none" />
                        <div className="absolute left-0 right-0 top-[72%] border-t border-dashed border-[#7882962E] pointer-events-none" />
                        <div className="absolute left-0 right-0 top-[100%] border-t-[1.5px] border-[#E7E9EE] pointer-events-none" />
                        
                        <motion.div 
                          className="absolute inset-0 overflow-hidden"
                          initial={isMounted ? false : { clipPath: 'inset(0 100% 0 0)', filter: 'blur(9px)', opacity: 0 }}
                          animate={{ clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)', opacity: 1 }}
                          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        >
                          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
                        </motion.div>

                        {/* Scrubber Crosshair & Marker */}
                        <AnimatePresence>
                          {scrubIndex !== null && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.16, ease: "easeOut" }}
                              className="absolute inset-0 pointer-events-none"
                            >
                              <motion.div 
                                className="absolute top-0 bottom-0 w-px bg-[#2563EB47]" 
                                style={{ x: xPos }} 
                              />
                              <motion.div 
                                className="absolute w-[11px] h-[11px] -ml-[5.5px] -mt-[5.5px] rounded-full bg-[#2563EB] border-2 border-white shadow-[0_1px_5px_rgba(15,23,42,0.28)]"
                                style={{ x: xPos, y: yPos }} 
                              />
                              <motion.div
                                className="absolute bg-white border border-[#E5E7EB] rounded-[10px] shadow-[0_6px_20px_-6px_rgba(15,23,42,0.22)] p-[7px_11px] whitespace-nowrap text-center transform -translate-x-1/2 -translate-y-[calc(100%+16px)]"
                                style={{ x: xPos, y: yPos }}
                              >
                                <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">{dates[scrubIndex]}</div>
                                <div className="text-[14px] font-semibold text-[#171717] tabular-nums">+{data[scrubIndex]} joined</div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="flex justify-between pt-[6px]">
                        {dateLabels.map((d, i) => (
                          <span key={i} className="text-[10px] font-normal text-[#5F5F6F] tabular-nums">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Range Selector */}
              <div className="inline-flex bg-[#F3F4F6] rounded-[9px] p-[3px] gap-[2px]">
                {RANGES.map((r, i) => (
                  <button
                    key={r.name}
                    onClick={() => { setRangeIndex(i); setScrubIndex(null); }}
                    className={cn(
                      "relative px-[12px] py-[5px] rounded-[7px] text-[12px] tabular-nums outline-none transition-colors",
                      range.name === r.name ? "text-[#171717] font-semibold" : "text-[#8A90A0] font-medium hover:text-[#5F5F6F]"
                    )}
                  >
                    {range.name === r.name && (
                      <motion.div 
                        layoutId="activeRangeMembers"
                        className="absolute inset-0 bg-white rounded-[7px] shadow-[0_0_0_1px_rgba(25,28,33,0.05),0_1px_2px_rgba(25,28,33,0.08)] z-0"
                        transition={{ duration: 0.32, bounce: 0.2, type: "spring" }}
                      />
                    )}
                    <span className="relative z-10">{r.name}</span>
                  </button>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

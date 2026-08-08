import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';

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
  const date = new Date(2026, 6, 14);
  date.setDate(date.getDate() - offsetDays);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface DitherGrowthChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function DitherGrowthChart({ theme = 'dark', compact = false }: DitherGrowthChartProps) {
  const [rangeIndex, setRangeIndex] = useState(2); // 30D default
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const range = RANGES[rangeIndex];
  
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
          ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
          ctx.fillRect(x + 1, y + 1, cell - 1, cell - 1);
          
          if (y < curveY) continue;
          
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          let glow = 0;
          if (isActive && !reducedMotion) {
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
  }, [theme]);

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

  if (compact) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <div className="relative w-full h-[120px]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    );
  }

  const ticks = [maxVal, Math.round(maxVal * 0.66), Math.round(maxVal * 0.33), 0];
  const dateLabels = [
    dates[0],
    dates[Math.floor(dates.length * 0.25)],
    dates[Math.floor(dates.length * 0.5)],
    dates[Math.floor(dates.length * 0.75)],
    dates[dates.length - 1],
  ];

  return (
    <div className={`relative w-full rounded-3xl p-6 transition-colors border ${
      theme === 'dark' ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-neutral-200 text-black shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={total} />
              </span>
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +14%
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Member growth over selected interval
            </p>
          </div>
        </div>

        {/* Range Filters */}
        <div className={`flex items-center p-1 rounded-full border text-xs font-medium ${
          theme === 'dark' ? 'bg-[#131313] border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {RANGES.map((r, idx) => (
            <button
              key={r.name}
              onClick={() => setRangeIndex(idx)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                rangeIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Chart Stage */}
      <div className="flex gap-3 items-start">
        {/* Y Axis Ticks */}
        <div className="relative w-7 h-[180px] shrink-0">
          {ticks.map((t, i) => (
            <span 
              key={i} 
              className={`absolute right-0 text-[10px] font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`} 
              style={{ top: `${(i / 3) * 82 + 8}%`, transform: 'translateY(-50%)' }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Chart Canvas Container */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div 
            ref={wrapperRef}
            className="relative h-[180px] touch-none cursor-crosshair overflow-hidden rounded-xl"
            onPointerMove={handlePointer}
            onPointerLeave={handlePointerLeave}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 border-t border-b border-dashed border-white/10 pointer-events-none" />
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Interactive Scrubber Line & Tooltip */}
            {scrubIndex !== null && (
              <>
                <motion.div 
                  className="absolute top-0 bottom-0 w-px bg-blue-500/80 pointer-events-none z-10"
                  style={{ left: xPos }}
                />
                <motion.div 
                  className="absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full bg-blue-500 border-2 border-white shadow-lg pointer-events-none z-20"
                  style={{ left: xPos, top: yPos }}
                />
                <motion.div 
                  className={`absolute -translate-x-1/2 -translate-y-full mb-3 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xl border pointer-events-none z-30 ${
                    theme === 'dark' ? 'bg-[#131313] text-white border-white/20' : 'bg-black text-white border-black'
                  }`}
                  style={{ left: xPos, top: yPos }}
                >
                  <div className="text-[10px] text-neutral-400 uppercase">{dates[scrubIndex]}</div>
                  <div>+{data[scrubIndex]} members</div>
                </motion.div>
              </>
            )}
          </div>

          {/* X Axis Dates */}
          <div className="flex justify-between items-center mt-2 px-1 text-[10px] font-mono opacity-60">
            {dateLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Users } from 'lucide-react';
import { cn } from './lib/utils';

type Plan = { name: string; color: string; base: number };
const PLANS: Plan[] = [
  { name: 'Unlimited', color: '#FFFFFF', base: 1240 },
  { name: '30-day pass', color: '#E2E8F0', base: 980 },
  { name: '10-class pack', color: '#CBD5E1', base: 620 },
  { name: 'Drop-in', color: '#94A3B8', base: 410 },
  { name: 'Student', color: '#64748B', base: 300 },
];

type Period = { name: string; mult: number };
const PERIODS: Period[] = [
  { name: 'Week', mult: 0.42 },
  { name: 'Month', mult: 1 },
  { name: 'Quarter', mult: 2.6 },
  { name: 'Year', mult: 8.4 },
];

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const hash = (x: number, y: number) => {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function AnimatedNumber({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 190, damping: 27, mass: 0.7 });
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString('en-US')
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

const drawRoundedWedge = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rIn: number, rOut: number, aStart: number, aEnd: number, cr: number) => {
  const sweep = aEnd - aStart;
  const maxCr = Math.min(cr, (rOut - rIn) / 2, (sweep * rIn) / 2);
  if (sweep <= 0.001) return;
  const crIn = maxCr;
  const crOut = maxCr;

  const aStartIn = aStart + crIn / rIn;
  const aEndIn = aEnd - crIn / rIn;
  const aStartOut = aStart + crOut / rOut;
  const aEndOut = aEnd - crOut / rOut;

  ctx.moveTo(cx + rIn * Math.cos(aStartIn), cy + rIn * Math.sin(aStartIn));
  ctx.arc(cx, cy, rIn, aStartIn, aEndIn);
  ctx.arcTo(
    cx + rIn * Math.cos(aEnd), cy + rIn * Math.sin(aEnd),
    cx + rOut * Math.cos(aEnd), cy + rOut * Math.sin(aEnd),
    crIn
  );
  ctx.arcTo(
    cx + rOut * Math.cos(aEnd), cy + rOut * Math.sin(aEnd),
    cx + rOut * Math.cos(aEndOut), cy + rOut * Math.sin(aEndOut),
    crOut
  );
  ctx.arc(cx, cy, rOut, aEndOut, aStartOut, true);
  ctx.arcTo(
    cx + rOut * Math.cos(aStart), cy + rOut * Math.sin(aStart),
    cx + rIn * Math.cos(aStart), cy + rIn * Math.sin(aStart),
    crOut
  );
  ctx.arcTo(
    cx + rIn * Math.cos(aStart), cy + rIn * Math.sin(aStart),
    cx + rIn * Math.cos(aStartIn), cy + rIn * Math.sin(aStartIn),
    crIn
  );
};

export function ChartCard() {
  const [periodIndex, setPeriodIndex] = useState(1); // Month
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const period = PERIODS[periodIndex];

  // Calculate Data
  const { values, shares, total } = useMemo(() => {
    let newTotal = 0;
    const newValues = PLANS.map((plan, i) => {
      const w = 0.78 + 0.4 * (0.5 + 0.5 * Math.sin(i * 1.9 + periodIndex * 1.3));
      const val = Math.round(plan.base * period.mult * w);
      newTotal += val;
      return val;
    });
    const newShares = newValues.map(v => v / newTotal);
    return { values: newValues, shares: newShares, total: newTotal };
  }, [periodIndex]);

  // Animation Refs
  const timeRef = useRef(0);
  const requestRef = useRef<number>();
  const morphStartTimeRef = useRef<number>(0);
  const fromSharesRef = useRef<number[]>([]);
  const targetSharesRef = useRef<number[]>([]);
  const dispSharesRef = useRef<number[]>([]);
  
  // Track hovering in ref so rAF loop gets latest without restarting
  const hoverRef = useRef(hoverIndex);
  useEffect(() => { hoverRef.current = hoverIndex; }, [hoverIndex]);

  useEffect(() => {
    if (dispSharesRef.current.length === 0) {
       dispSharesRef.current = [...shares];
       fromSharesRef.current = [...shares];
       targetSharesRef.current = [...shares];
    } else {
       fromSharesRef.current = [...dispSharesRef.current];
       targetSharesRef.current = [...shares];
       morphStartTimeRef.current = performance.now();
    }
  }, [shares]);

  useEffect(() => {
    const draw = () => {
      timeRef.current += 0.02;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const logicalSize = 200;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale((rect.width * dpr) / logicalSize, (rect.height * dpr) / logicalSize);
      
      let t = 0;
      if (morphStartTimeRef.current > 0) {
        t = (performance.now() - morphStartTimeRef.current) / 500;
        if (t > 1) t = 1;
      } else {
        t = 1;
      }
      
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
          t = 1; 
          timeRef.current = 0;
      }

      const e = 1 - Math.pow(2, -10 * t);
      for (let i = 0; i < targetSharesRef.current.length; i++) {
        dispSharesRef.current[i] = fromSharesRef.current[i] + (targetSharesRef.current[i] - fromSharesRef.current[i]) * e;
      }
      
      let startAngle = -Math.PI / 2;
      const gap = 0.07;
      const currentHover = hoverRef.current;
      
      for (let i = 0; i < dispSharesRef.current.length; i++) {
        const share = dispSharesRef.current[i];
        if (share === 0) continue;
        
        let sweep = share * Math.PI * 2;
        let aStart = startAngle + gap / 2;
        let aEnd = startAngle + sweep - gap / 2;
        
        if (aEnd < aStart) aEnd = aStart;
        
        ctx.save();
        const isHovered = currentHover === i;
        const isAnyHovered = currentHover !== null;
        
        if (isHovered) {
          const mid = (aStart + aEnd) / 2;
          ctx.translate(Math.cos(mid) * 6, Math.sin(mid) * 6);
        }
        
        ctx.beginPath();
        drawRoundedWedge(ctx, 100, 100, 55, 86, aStart, aEnd, 6);
        ctx.clip();
        
        ctx.globalAlpha = isHovered ? 1.0 : (isAnyHovered ? 0.3 * 0.72 : 0.72);
        ctx.fillStyle = PLANS[i].color;
        
        if (isHovered) {
            ctx.shadowColor = hexToRgba(PLANS[i].color, 0.55);
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        const cell = 4.6;
        for (let x = 14; x <= 186; x += cell) {
          for (let y = 14; y <= 186; y += cell) {
            const dx = x - 100;
            const dy = y - 100;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 55 - cell || dist > 86 + cell) continue;
            
            let a = Math.atan2(dy, dx);
            let normalizedA = a - aStart;
            while (normalizedA < 0) normalizedA += Math.PI * 2;
            while (normalizedA >= Math.PI * 2) normalizedA -= Math.PI * 2;
            if (normalizedA > (aEnd - aStart)) continue;
            
            const fullness = smoothstep(0.62, 1.0, (dist - 55) / (86 - 55));
            const waveRaw = Math.sin(dist * 0.1 - timeRef.current) + Math.sin(a * 3 + timeRef.current * 1.5) + Math.sin(dx * 0.05 + dy * 0.05 + timeRef.current * 2);
            const wave = smoothstep(-1.5, 1.5, waveRaw);
            const jitter = hash(x, y);
            
            const size = cell * ((isHovered ? 0.46 : 0.34) + 0.36 * fullness + 0.26 * wave) * (0.78 + 0.42 * jitter);
            
            ctx.fillRect(x - size/2, y - size/2, size, size);
          }
        }
        
        ctx.restore();
        startAngle += sweep;
      }
      
      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleCanvasMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lx = (x / rect.width) * 200 - 100;
    const ly = (y / rect.height) * 200 - 100;
    const dist = Math.sqrt(lx*lx + ly*ly);
    
    if (dist < 55 || dist > 86) {
      if (hoverIndex !== null) setHoverIndex(null);
      return;
    }
    
    let angle = Math.atan2(ly, lx);
    let startAngle = -Math.PI / 2;
    const gap = 0.07;
    let found: number | null = null;
    
    for (let i = 0; i < dispSharesRef.current.length; i++) {
      const share = dispSharesRef.current[i];
      if (share === 0) continue;
      let sweep = share * Math.PI * 2;
      let aStart = startAngle + gap/2;
      let aEnd = startAngle + sweep - gap/2;
      
      let normalizedA = angle - aStart;
      while (normalizedA < 0) normalizedA += Math.PI * 2;
      while (normalizedA >= Math.PI * 2) normalizedA -= Math.PI * 2;
      
      if (normalizedA <= (aEnd - aStart)) {
        found = i;
        break;
      }
      startAngle += sweep;
    }
    
    if (found !== hoverIndex) setHoverIndex(found);
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col items-center gap-[14px]" style={{ zoom: 0.86 }}>
      <div className="w-full bg-[#FAFAFB] rounded-[14px] p-1.5 flex flex-col gap-1.5 shadow-sm border border-black/5">
        
        <div className="bg-white rounded-[10px] p-[14px_20px] flex flex-col gap-1.5 shadow-[0_0_1.76px_rgba(0,0,0,0.08),0_1px_1.76px_rgba(25,28,33,0.06),0_0_0_1px_rgba(25,28,33,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-medium tracking-tight text-[#171717]">Members by plan</span>
              <Users size={14} className="text-[#B6B8BF]" />
            </div>
            <div className="relative h-4 overflow-hidden w-20 flex justify-end">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={period.name}
                  initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute right-0 text-[12px] text-[#8A90A0] whitespace-nowrap"
                >
                  {period.name} to date
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-baseline gap-[7px]">
             <span className="text-[31px] font-semibold tracking-[-0.015em] text-[#171717] leading-[1.15]">
               <AnimatedNumber value={total} />
             </span>
             <span className="text-[13px] font-medium text-[#8A90A0]">total members</span>
          </div>
        </div>
        
        <div className="bg-white rounded-[10px] p-[18px] flex items-center gap-[18px] shadow-[0_0_1.76px_rgba(0,0,0,0.08),0_1px_1.76px_rgba(25,28,33,0.06),0_0_0_1px_rgba(25,28,33,0.04)]">
          <div className="relative w-[min(190px,44%)] aspect-square shrink-0">
             <canvas 
               ref={canvasRef} 
               className="absolute inset-0 w-full h-full cursor-pointer touch-none" 
               onMouseMove={handleCanvasMove}
               onMouseLeave={() => setHoverIndex(null)}
             />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {PLANS.map((plan, i) => (
               <div 
                 key={plan.name}
                 onMouseEnter={() => setHoverIndex(i)}
                 onMouseLeave={() => setHoverIndex(null)}
                 className={cn(
                   "flex items-center gap-[9px] p-[6px_8px] rounded-[7px] cursor-pointer transition-all duration-150",
                   hoverIndex === i ? "bg-blue-50/50" : "bg-transparent",
                   hoverIndex !== null && hoverIndex !== i ? "opacity-50" : "opacity-100"
                 )}
               >
                 <span className="w-[9px] h-[9px] rounded-[3px] shrink-0" style={{ backgroundColor: plan.color }} />
                 <span className={cn(
                   "flex-1 text-[12.5px] truncate transition-colors duration-150",
                   hoverIndex === i ? "text-[#171717] font-medium" : "text-[#5F5F6F] font-normal"
                 )}>
                   {plan.name}
                 </span>
                 <span className="text-[12.5px] font-medium text-[#171717]">
                   <AnimatedNumber value={values[i]} />
                 </span>
               </div>
            ))}
          </div>
        </div>
        
      </div>
      
      <div className="inline-flex bg-[#F3F4F6] rounded-[9px] p-[3px] gap-[2px]">
        {PERIODS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => { setPeriodIndex(i); setHoverIndex(null); }}
            className={cn(
              "relative px-[14px] py-[5px] rounded-[7px] text-[12px] font-medium transition-colors outline-none",
              period.name === p.name ? "text-[#171717] font-semibold" : "text-[#8A90A0] hover:text-[#5F5F6F]"
            )}
          >
            {period.name === p.name && (
              <motion.div 
                layoutId="activePeriod"
                className="absolute inset-0 bg-white rounded-[7px] shadow-[0_0_0_1px_rgba(25,28,33,0.05),0_1px_2px_rgba(25,28,33,0.08)] z-0"
                transition={{ duration: 0.32, bounce: 0.2, type: "spring" }}
              />
            )}
            <span className="relative z-10">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

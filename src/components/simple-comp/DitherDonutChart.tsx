import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Users } from 'lucide-react';

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

interface DitherDonutChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function DitherDonutChart({ theme = 'dark', compact = false }: DitherDonutChartProps) {
  const [periodIndex, setPeriodIndex] = useState(1); // Month
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const period = PERIODS[periodIndex];

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

  const timeRef = useRef(0);
  const requestRef = useRef<number>();
  const morphStartTimeRef = useRef<number>(0);
  const fromSharesRef = useRef<number[]>([]);
  const targetSharesRef = useRef<number[]>([]);
  const dispSharesRef = useRef<number[]>([]);
  
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

  if (compact) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <div className="relative w-[130px] h-[130px]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl p-6 transition-colors border ${
      theme === 'dark' ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-neutral-200 text-black shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Plan Distribution</h4>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Dithered canvas chart with real-time spring physics
            </p>
          </div>
        </div>

        {/* Period Filter Tabs */}
        <div className={`flex items-center p-1 rounded-full border text-xs font-medium ${
          theme === 'dark' ? 'bg-[#131313] border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {PERIODS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => setPeriodIndex(idx)}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                periodIndex === idx
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Canvas Donut */}
        <div className="relative w-[180px] h-[180px] shrink-0">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Plan Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {PLANS.map((plan, idx) => {
            const val = values[idx];
            const pct = Math.round(shares[idx] * 100);
            const isHovered = hoverIndex === idx;

            return (
              <div
                key={plan.name}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                  isHovered
                    ? (theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-neutral-100 border-neutral-300')
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-xs font-medium">{plan.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {val.toLocaleString()}
                  </span>
                  <span className={`text-[10px] w-8 text-right font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

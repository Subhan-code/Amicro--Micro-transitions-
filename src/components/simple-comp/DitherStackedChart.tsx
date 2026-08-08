import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { CreditCard, DollarSign } from 'lucide-react';

const PERIODS = [
  { name: 'Week', mult: 1 },
  { name: 'Month', mult: 4 },
  { name: 'Quarter', mult: 13 },
  { name: 'Year', mult: 52 },
];

const BRANCHES = ['Bishkek', 'Osh', 'Jalal-Abad', 'Karakol'];
const BANDS = [
  { name: 'Cash', color: '#FFFFFF', share: 0.46 },
  { name: 'QR', color: '#CBD5E1', share: 0.31 },
  { name: 'Bank', color: '#94A3B8', share: 0.23 },
];

const BASE_TOTAL = 150000;
const BRANCH_WEIGHTS = [0.45, 0.25, 0.18, 0.12];

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

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

function AnimatedDollar({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 190, damping: 27, mass: 0.7 });
  const display = useTransform(spring, (current) => 
    '$' + Math.round(current).toLocaleString('en-US')
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

const formatAxisLabel = (val: number) => {
  if (val === 0) return '$0';
  if (val >= 1000000) return '$' + (val / 1000000).toPrecision(3).replace(/\.0+$/, '') + 'M';
  if (val >= 1000) return '$' + (val / 1000).toPrecision(3).replace(/\.0+$/, '') + 'k';
  return '$' + val;
};

const getAxisMax = (maxVal: number) => {
  if (maxVal === 0) return 100;
  const target = maxVal * 1.05;
  const power = Math.pow(10, Math.floor(Math.log10(target)));
  const normalized = target / power;
  let multiplier = 10;
  if (normalized <= 1.0) multiplier = 1;
  else if (normalized <= 2.0) multiplier = 2;
  else if (normalized <= 5.0) multiplier = 5;
  
  return multiplier * power;
};

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rTop: number, rBottom: number) {
  ctx.beginPath();
  ctx.moveTo(x + rTop, y);
  ctx.lineTo(x + w - rTop, y);
  ctx.arcTo(x + w, y, x + w, y + rTop, rTop);
  ctx.lineTo(x + w, y + h - rBottom);
  ctx.arcTo(x + w, y + h, x + w - rBottom, y + h, rBottom);
  ctx.lineTo(x + rBottom, y + h);
  ctx.arcTo(x, y + h, x, y + h - rBottom, rBottom);
  ctx.lineTo(x, y + rTop);
  ctx.arcTo(x, y, x + rTop, y, rTop);
  ctx.closePath();
}

interface DitherStackedChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function DitherStackedChart({ theme = 'dark', compact = false }: DitherStackedChartProps) {
  const [periodIndex, setPeriodIndex] = useState(1); // Month
  const [hoverBranch, setHoverBranch] = useState<number | null>(null);
  const [hoverBand, setHoverBand] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const period = PERIODS[periodIndex];

  const { data, totalValue, axisMax } = useMemo(() => {
    let tot = 0;
    const branches = BRANCHES.map((b, bIdx) => {
      const branchBase = BASE_TOTAL * BRANCH_WEIGHTS[bIdx];
      let branchTotal = 0;
      const bands = BANDS.map((band, bandIdx) => {
        const wobble = 0.9 + 0.14 * Math.sin(bIdx * 3.1 + bandIdx * 1.7);
        const val = Math.round(branchBase * period.mult * band.share * wobble);
        branchTotal += Math.max(6, val);
        return { value: Math.max(6, val) };
      });
      tot += branchTotal;
      return { total: branchTotal, bands };
    });
    
    const maxBranchTotal = Math.max(...branches.map(b => b.total));
    const axMax = getAxisMax(maxBranchTotal);
    
    return { data: branches, totalValue: tot, axisMax: axMax };
  }, [periodIndex]);

  const timeRef = useRef(0);
  const requestRef = useRef<number>();
  const drawnRef = useRef<Map<string, number>>(new Map());
  const morphStartTimeRef = useRef(0);
  const fromStateRef = useRef<Map<string, number>>(new Map());
  
  const hoverRef = useRef({ b: hoverBranch, band: hoverBand });
  useEffect(() => { hoverRef.current = { b: hoverBranch, band: hoverBand }; }, [hoverBranch, hoverBand]);

  useEffect(() => {
    fromStateRef.current = new Map(drawnRef.current);
    morphStartTimeRef.current = performance.now();
  }, [data]);

  useEffect(() => {
    const draw = () => {
      timeRef.current += 0.02;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      
      const w = rect.width;
      const h = rect.height;
      const colW = w / BRANCHES.length;
      const barW = Math.min(colW * 0.62, 54);
      const cell = Math.max(3, Math.round(w / 200));
      const HIGHLIGHT = '#FFFFFF';
      
      let prog = 0;
      if (morphStartTimeRef.current > 0) {
        prog = (performance.now() - morphStartTimeRef.current) / 620;
        if (prog > 1) prog = 1;
      } else {
        prog = 1;
      }
      
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        prog = 1;
        timeRef.current = 0;
      }
      
      const n = BRANCHES.length;
      
      for (let i = 0; i < n; i++) {
        const bp = 1 - Math.pow(1 - clamp((prog - i * 0.05) / (1 - (n - 1) * 0.05), 0, 1), 3);
        const colX = i * colW;
        const cx = colX + colW / 2;
        const x0 = cx - barW / 2;
        
        let currentY = h;
        
        for (let j = 0; j < BANDS.length; j++) {
          const key = `${i}-${j}`;
          const targetH = (data[i].bands[j].value / axisMax) * h;
          const fromH = fromStateRef.current.get(key) || 0;
          const segH = Math.max(0.1, fromH + (targetH - fromH) * bp);
          
          drawnRef.current.set(key, segH);
          
          const yBottom = currentY;
          const yTop = currentY - segH;
          const rTop = j === BANDS.length - 1 ? 8 : 5;
          const rBottom = j === 0 ? 7 : 5;
          
          const hb = hoverRef.current.b;
          const hband = hoverRef.current.band;
          
          const isHot = hb === i && hband === j;
          const isOtherBranch = hb !== null && hb !== i;
          const isOtherBandInBranch = hb === i && hband !== null && hband !== j;
          
          let alpha = 1.0;
          if (isOtherBranch) alpha = 0.3;
          else if (isOtherBandInBranch) alpha = 0.48;
          
          const color = isHot ? HIGHLIGHT : BANDS[j].color;
          
          ctx.save();
          drawRoundedRect(ctx, x0, yTop, barW, segH, rTop, rBottom);
          ctx.clip();
          
          ctx.globalAlpha = alpha * 0.85;
          ctx.fillStyle = color;
          
          for (let bx = x0; bx < x0 + barW; bx += cell) {
            for (let by = yTop; by < yBottom; by += cell) {
              const dx = bx - (x0 + barW / 2);
              const dy = by - (yTop + segH / 2);
              const dist = Math.sqrt(dx*dx + dy*dy);
              
              const jitter = hash(bx, by);
              const wave = Math.sin(dist * 0.1 - timeRef.current * 2) * 0.15;
              const sz = cell * (0.68 + wave + jitter * 0.2);
              
              ctx.fillRect(bx + (cell - sz)/2, by + (cell - sz)/2, sz, sz);
            }
          }
          
          ctx.restore();
          currentY = yTop;
        }
      }
      
      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };
    
    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [data, axisMax]);

  if (compact) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <div className="relative w-full h-[120px]">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedDollar value={totalValue} />
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>total revenue</span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Stacked payment channels per regional branch
            </p>
          </div>
        </div>

        {/* Period filter */}
        <div className={`flex items-center p-1 rounded-full border text-xs font-medium ${
          theme === 'dark' ? 'bg-[#131313] border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {PERIODS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => setPeriodIndex(idx)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                periodIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Band Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs font-medium">
        {BANDS.map((band, idx) => (
          <div 
            key={band.name} 
            onMouseEnter={() => setHoverBand(idx)}
            onMouseLeave={() => setHoverBand(null)}
            className="flex items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100"
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: band.color }} />
            <span>{band.name}</span>
          </div>
        ))}
      </div>

      {/* Main Canvas Chart */}
      <div className="relative h-[200px] w-full rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Branch Labels */}
      <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs font-semibold">
        {BRANCHES.map((branch, idx) => (
          <div
            key={branch}
            onMouseEnter={() => setHoverBranch(idx)}
            onMouseLeave={() => setHoverBranch(null)}
            className={`py-1.5 rounded-lg cursor-pointer transition-all ${
              hoverBranch === idx
                ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-neutral-200 text-black')
                : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
            }`}
          >
            {branch}
          </div>
        ))}
      </div>
    </div>
  );
}

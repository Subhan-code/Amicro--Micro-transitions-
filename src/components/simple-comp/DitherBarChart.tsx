import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { BarChart3 } from 'lucide-react';

const PERIODS = [
  { name: '7D', mult: 1 },
  { name: '30D', mult: 3.8 },
  { name: '90D', mult: 11.2 },
  { name: '1Y', mult: 42.5 },
];

const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BASE_VALUES = [42, 68, 55, 92, 85, 110, 74];

function AnimatedValue({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 190, damping: 27, mass: 0.7 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('en-US'));

  useEffect(() => {
    if (prefersReducedMotion) spring.jump(value);
    else spring.set(value);
  }, [value, spring, prefersReducedMotion]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

export function DitherBarChart({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [periodIdx, setPeriodIdx] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>();

  const period = PERIODS[periodIdx];
  const { data, total, maxVal } = useMemo(() => {
    const raw = BASE_VALUES.map(v => Math.round(v * period.mult));
    const tot = raw.reduce((a, b) => a + b, 0);
    const mx = Math.max(...raw);
    return { data: raw, total: tot, maxVal: mx };
  }, [periodIdx]);

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
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const colW = w / data.length;
      const barW = Math.min(colW * 0.55, 36);
      const cell = Math.max(3, Math.round(w / 160));

      data.forEach((val, i) => {
        const cx = i * colW + colW / 2;
        const x0 = cx - barW / 2;
        const barH = (val / maxVal) * (h * 0.82);
        const yTop = h - barH;
        const isHovered = hoveredIdx === i;

        for (let bx = Math.floor(x0); bx < Math.ceil(x0 + barW); bx += cell) {
          for (let by = Math.floor(yTop); by < h; by += cell) {
            const distToTop = (by - yTop) / barH;
            const wave = Math.sin(bx * 0.08 + timeRef.current * 2) * 0.1;
            const density = 0.4 + 0.6 * (1 - distToTop) + wave;

            if (Math.random() < density || isHovered) {
              ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)';
              const sz = cell * (isHovered ? 0.95 : 0.75);
              const offset = (cell - sz) / 2;
              ctx.fillRect(bx + offset, by + offset, sz, sz);
            }
          }
        }
      });

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [data, maxVal, hoveredIdx]);

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className={`w-full rounded-2xl p-4 flex flex-col gap-3 shadow-lg border transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Dither Vertical Bars</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">↑ 18.4%</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <AnimatedValue value={total} />
          </span>
          <span className="text-xs text-neutral-400">total events</span>
        </div>

        <div 
          className="relative h-[160px] w-full touch-none cursor-pointer"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const colW = rect.width / data.length;
            const idx = Math.min(Math.max(0, Math.floor(x / colW)), data.length - 1);
            setHoveredIdx(idx);
          }}
          onPointerLeave={() => setHoveredIdx(null)}
        >
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />

          <AnimatePresence>
            {hoveredIdx !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full top-2"
                style={{ left: `${((hoveredIdx + 0.5) / data.length) * 100}%` }}
              >
                {LABELS[hoveredIdx]}: {data[hoveredIdx]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between text-[11px] text-neutral-400 px-1 pt-1">
          {LABELS.map((lbl, idx) => (
            <span key={lbl} className={hoveredIdx === idx ? 'text-white font-bold' : ''}>{lbl}</span>
          ))}
        </div>
      </div>

      <div className="inline-flex bg-neutral-800/60 rounded-lg p-1 gap-1 border border-white/10">
        {PERIODS.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => setPeriodIdx(idx)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              periodIdx === idx ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

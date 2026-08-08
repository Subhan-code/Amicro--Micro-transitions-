import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Target } from 'lucide-react';

const TARGETS = [
  { name: '50%', val: 50 },
  { name: '75%', val: 75 },
  { name: '90%', val: 90 },
  { name: '100%', val: 100 },
];

function AnimatedPercent({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 180, damping: 24 });
  const display = useTransform(spring, (current) => Math.round(current) + '%');

  useEffect(() => {
    if (prefersReducedMotion) spring.jump(value);
    else spring.set(value);
  }, [value, spring, prefersReducedMotion]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

export function DitherRadialChart({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [targetIdx, setTargetIdx] = useState(1);
  const [hoverAngle, setHoverAngle] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>();

  const currentTarget = TARGETS[targetIdx];

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
      const cx = w / 2;
      const cy = h / 2;
      const outerR = Math.min(w, h) * 0.42;
      const innerR = outerR * 0.58;
      const cell = Math.max(3, Math.round(w / 160));

      const fillSweep = (currentTarget.val / 100) * (Math.PI * 2);

      for (let x = cx - outerR; x <= cx + outerR; x += cell) {
        for (let y = cy - outerR; y <= cy + outerR; y += cell) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < innerR || dist > outerR) continue;

          let angle = Math.atan2(dy, dx) + Math.PI / 2;
          if (angle < 0) angle += Math.PI * 2;

          const isFilled = angle <= fillSweep;
          const shimmer = Math.sin(dist * 0.1 - timeRef.current * 3) * 0.1;

          if (isFilled) {
            const alpha = 0.65 + shimmer + (dist / outerR) * 0.35;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0.2, alpha))})`;
            const sz = cell * 0.82;
            ctx.fillRect(x, y, sz, sz);
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
          }
        }
      }

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [currentTarget]);

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className={`w-full rounded-2xl p-4 flex flex-col gap-3 shadow-lg border transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Dither Radial Gauge</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Active</span>
        </div>

        <div className="relative h-[160px] w-full flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tight">
              <AnimatedPercent value={currentTarget.val} />
            </span>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">Target</span>
          </div>
        </div>
      </div>

      <div className="inline-flex bg-neutral-800/60 rounded-lg p-1 gap-1 border border-white/10">
        {TARGETS.map((t, idx) => (
          <button
            key={t.name}
            onClick={() => setTargetIdx(idx)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              targetIdx === idx ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

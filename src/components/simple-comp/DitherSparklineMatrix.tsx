import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';

const METRICS = [
  { id: 'm1', label: 'ARR Growth', val: '$1.4M', change: '+24%', pts: [20, 35, 45, 60, 55, 80, 95] },
  { id: 'm2', label: 'Active Users', val: '84.2k', change: '+18%', pts: [40, 30, 55, 70, 65, 85, 90] },
  { id: 'm3', label: 'Conversion', val: '4.8%', change: '+3.2%', pts: [15, 25, 30, 45, 60, 50, 75] },
  { id: 'm4', label: 'Retention', val: '92.4%', change: '+1.5%', pts: [60, 65, 70, 80, 85, 88, 94] },
];

export function DitherSparklineMatrix({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [activeMetric, setActiveMetric] = useState<number | null>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>();

  const current = METRICS[activeMetric ?? 0];

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
      const cell = Math.max(3, Math.round(w / 160));

      const pts = current.pts;
      for (let x = 0; x < w; x += cell) {
        const t = x / w;
        const exactIdx = t * (pts.length - 1);
        const i0 = Math.floor(exactIdx);
        const i1 = Math.min(i0 + 1, pts.length - 1);
        const frac = exactIdx - i0;
        const val = pts[i0] + (pts[i1] - pts[i0]) * frac;
        const curveY = h - (val / 100) * (h * 0.85);

        for (let y = h; y >= 0; y -= cell) {
          if (y < curveY) continue;

          const shimmer = Math.sin(y * 0.1 - timeRef.current * 2) * 0.1;
          const alpha = 0.5 + shimmer + (1 - y / h) * 0.5;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0.2, alpha))})`;
          const sz = cell * 0.85;
          ctx.fillRect(x, y, sz, sz);
        }
      }

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [current]);

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className={`w-full rounded-2xl p-4 flex flex-col gap-3 shadow-lg border transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Dither Sparkline Matrix</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">{current.change}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {METRICS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(idx)}
              className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                activeMetric === idx
                  ? 'bg-neutral-800 border-white/30 text-white shadow-md'
                  : 'bg-neutral-900/50 border-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-[11px] font-medium text-neutral-400">{m.label}</span>
              <span className="text-base font-bold text-white tracking-tight">{m.val}</span>
            </button>
          ))}
        </div>

        <div className="relative h-[120px] w-full rounded-xl overflow-hidden mt-1">
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

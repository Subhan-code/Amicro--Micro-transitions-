import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

const MODES = [
  { name: 'Scatter', mult: 1 },
  { name: 'Trend', mult: 1.4 },
  { name: 'Peak', mult: 2.1 },
];

const POINTS = [
  { x: 15, y: 35, label: 'Node A' },
  { x: 28, y: 62, label: 'Node B' },
  { x: 42, y: 48, label: 'Node C' },
  { x: 58, y: 84, label: 'Node D' },
  { x: 72, y: 70, label: 'Node E' },
  { x: 88, y: 92, label: 'Node F' },
];

export function DitherScatterChart({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [modeIdx, setModeIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>();

  const mode = MODES[modeIdx];

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

      // Draw faint background grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let gx = 0; gx < w; gx += cell * 4) {
        for (let gy = 0; gy < h; gy += cell * 4) {
          ctx.fillRect(gx, gy, cell, cell);
        }
      }

      // Draw Dithered Nodes & Connecting Trend Line
      ctx.beginPath();
      POINTS.forEach((p, idx) => {
        const px = (p.x / 100) * w;
        const py = h - (p.y / 100) * h * (mode.mult / 2.1);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      POINTS.forEach((p, idx) => {
        const px = (p.x / 100) * w;
        const py = h - (p.y / 100) * h * (mode.mult / 2.1);
        const isHovered = hoverIdx === idx;
        const radius = isHovered ? cell * 3.5 : cell * 2.2;

        for (let dx = -radius; dx <= radius; dx += cell) {
          for (let dy = -radius; dy <= radius; dy += cell) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) continue;

            const shimmer = Math.sin(timeRef.current * 4 + idx) * 0.15;
            const alpha = (1 - dist / radius) + shimmer;

            ctx.fillStyle = isHovered ? '#FFFFFF' : `rgba(255, 255, 255, ${Math.min(1, Math.max(0.3, alpha))})`;
            const sz = cell * (isHovered ? 0.9 : 0.75);
            ctx.fillRect(px + dx, py + dy, sz, sz);
          }
        }
      });

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [mode, hoverIdx]);

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className={`w-full rounded-2xl p-4 flex flex-col gap-3 shadow-lg border transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Dither Scatter Plot</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Live Trend</span>
        </div>

        <div 
          className="relative h-[160px] w-full touch-none cursor-pointer"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 100;
            let closestIdx = 0;
            let minDist = Infinity;
            POINTS.forEach((p, idx) => {
              const d = Math.abs(p.x - x);
              if (d < minDist) {
                minDist = d;
                closestIdx = idx;
              }
            });
            setHoverIdx(closestIdx);
          }}
          onPointerLeave={() => setHoverIdx(null)}
        >
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />

          <AnimatePresence>
            {hoverIdx !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full top-2"
                style={{ left: `${POINTS[hoverIdx].x}%` }}
              >
                {POINTS[hoverIdx].label}: {Math.round(POINTS[hoverIdx].y * mode.mult)} pts
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="inline-flex bg-neutral-800/60 rounded-lg p-1 gap-1 border border-white/10">
        {MODES.map((m, idx) => (
          <button
            key={m.name}
            onClick={() => setModeIdx(idx)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              modeIdx === idx ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}

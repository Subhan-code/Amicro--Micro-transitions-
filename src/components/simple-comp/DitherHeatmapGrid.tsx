import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = 12;

export function DitherHeatmapGrid({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>();

  const matrixData = useMemo(() => {
    return DAYS.map((_, d) => 
      Array.from({ length: HOURS }, (_, h) => Math.round(20 + Math.sin(d * 1.5 + h * 0.8) * 35 + Math.random() * 40))
    );
  }, []);

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
      const cellW = w / HOURS;
      const cellH = h / DAYS.length;
      const dotCell = Math.max(3, Math.round(w / 160));

      matrixData.forEach((row, d) => {
        row.forEach((val, hIdx) => {
          const x0 = hIdx * cellW;
          const y0 = d * cellH;
          const isHovered = hoveredCell?.day === d && hoveredCell?.hour === hIdx;
          const intensity = val / 100;

          for (let bx = Math.floor(x0); bx < Math.ceil(x0 + cellW - 2); bx += dotCell) {
            for (let by = Math.floor(y0); by < Math.ceil(y0 + cellH - 2); by += dotCell) {
              const shimmer = Math.sin(bx * 0.1 + timeRef.current * 2) * 0.1;
              if (Math.random() < intensity + shimmer || isHovered) {
                ctx.fillStyle = isHovered ? '#FFFFFF' : `rgba(255, 255, 255, ${Math.min(1, Math.max(0.2, intensity))})`;
                const sz = dotCell * (isHovered ? 0.95 : 0.75);
                ctx.fillRect(bx, by, sz, sz);
              }
            }
          }
        });
      });

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [matrixData, hoveredCell]);

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className={`w-full rounded-2xl p-4 flex flex-col gap-3 shadow-lg border transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Dither Heatmap Grid</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Peak Active</span>
        </div>

        <div 
          className="relative h-[160px] w-full touch-none cursor-pointer"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const hIdx = Math.min(Math.max(0, Math.floor((x / rect.width) * HOURS)), HOURS - 1);
            const dIdx = Math.min(Math.max(0, Math.floor((y / rect.height) * DAYS.length)), DAYS.length - 1);
            setHoveredCell({ day: dIdx, hour: hIdx });
          }}
          onPointerLeave={() => setHoveredCell(null)}
        >
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />

          <AnimatePresence>
            {hoveredCell !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full top-2"
                style={{ left: `${((hoveredCell.hour + 0.5) / HOURS) * 100}%` }}
              >
                {DAYS[hoveredCell.day]} @ {hoveredCell.hour * 2}:00 - {matrixData[hoveredCell.day][hoveredCell.hour]} ops/s
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

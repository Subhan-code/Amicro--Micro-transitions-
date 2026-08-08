import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Globe } from 'lucide-react';

const SOURCES = [
  { name: 'Direct', data: [{ x: 50, y: 50, r: 35, color: '#FFFFFF', label: 'US' }, { x: 30, y: 20, r: 20, color: '#E2E8F0', label: 'UK' }, { x: 70, y: 80, r: 25, color: '#CBD5E1', label: 'CA' }] },
  { name: 'Social', data: [{ x: 40, y: 60, r: 40, color: '#FFFFFF', label: 'IG' }, { x: 70, y: 30, r: 25, color: '#E2E8F0', label: 'TW' }, { x: 20, y: 40, r: 15, color: '#CBD5E1', label: 'FB' }] },
];

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const hash = (x: number, y: number) => {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

export function TrafficBubble({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = SOURCES[sourceIndex];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetBubblesRef = useRef(source.data);
  const fromBubblesRef = useRef(source.data);
  const morphStartTimeRef = useRef(0);

  useEffect(() => {
    fromBubblesRef.current = targetBubblesRef.current;
    targetBubblesRef.current = source.data;
    morphStartTimeRef.current = performance.now();
  }, [source]);

  useEffect(() => {
    let req: number;
    let time = 0;
    const draw = () => {
      time += 0.01;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      let prog = Math.min(1, (performance.now() - morphStartTimeRef.current) / 600);
      const e = 1 - Math.pow(2, -10 * prog);

      for (let i = 0; i < Math.max(fromBubblesRef.current.length, targetBubblesRef.current.length); i++) {
        const target = targetBubblesRef.current[i] || targetBubblesRef.current[targetBubblesRef.current.length-1];
        const from = fromBubblesRef.current[i] || fromBubblesRef.current[fromBubblesRef.current.length-1];
        
        const x = from.x + (target.x - from.x) * e;
        const y = from.y + (target.y - from.y) * e;
        const r = from.r + (target.r - from.r) * e;
        
        const floatX = Math.sin(time + i * 2) * 4;
        const floatY = Math.cos(time + i * 3) * 4;

        const finalX = (x / 100) * rect.width + floatX;
        const finalY = (y / 100) * rect.height + floatY;

        ctx.save();
        ctx.beginPath();
        ctx.arc(finalX, finalY, r, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = target.color;
        
        const cell = Math.max(2, Math.round(rect.width / 200));
        
        for (let bx = Math.floor(finalX - r); bx <= Math.ceil(finalX + r); bx += cell) {
          for (let by = Math.floor(finalY - r); by <= Math.ceil(finalY + r); by += cell) {
            const jx = bx + cell / 2;
            const jy = by + cell / 2;
            const jit = hash(jx, jy);
            
            const dx = jx - finalX;
            const dy = jy - finalY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > r + cell) continue;
            
            const fullness = smoothstep(0, 1, 1 - dist / r);
            const waveRaw = Math.sin(jx * 0.05 + time) + Math.sin(jy * 0.05 + time * 0.7);
            const mod = smoothstep(-1.5, 1.5, waveRaw);
            
            const sz = cell * (0.3 + 0.4 * fullness + 0.3 * mod) * (0.8 + 0.4 * jit);
            ctx.fillRect(bx + (cell - sz)/2, by + (cell - sz)/2, sz, sz);
          }
        }
        
        ctx.restore();
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000000';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(target.label, finalX, finalY);
      }

      ctx.restore();
      req = requestAnimationFrame(draw);
    };
    req = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="relative w-full h-[140px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}

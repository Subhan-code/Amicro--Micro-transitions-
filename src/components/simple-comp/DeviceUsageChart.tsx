import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Smartphone } from 'lucide-react';

const DEVICES = [
  { name: 'Today', data: [{ label: 'Mobile', val: 65, color: '#FFFFFF' }, { label: 'Desktop', val: 25, color: '#E2E8F0' }, { label: 'Tablet', val: 10, color: '#94A3B8' }] },
  { name: 'Last 7D', data: [{ label: 'Mobile', val: 55, color: '#FFFFFF' }, { label: 'Desktop', val: 35, color: '#E2E8F0' }, { label: 'Tablet', val: 10, color: '#94A3B8' }] },
];

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const hash = (x: number, y: number) => {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

export function DeviceUsageChart({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = DEVICES[periodIndex];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetDataRef = useRef(period.data);
  const fromDataRef = useRef(period.data);
  const morphStartTimeRef = useRef(0);

  useEffect(() => {
    fromDataRef.current = targetDataRef.current;
    targetDataRef.current = period.data;
    morphStartTimeRef.current = performance.now();
  }, [period]);

  useEffect(() => {
    let req: number;
    let time = 0;
    const draw = () => {
      time += 0.02;
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

      let prog = Math.min(1, (performance.now() - morphStartTimeRef.current) / 500);
      const e = 1 - Math.pow(2, -10 * prog);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const r = Math.min(cx, cy) * 0.85;
      const rInner = r * 0.65;
      const cell = Math.max(2, Math.round(rect.width / 200));
      
      let startAngle = -Math.PI / 2;

      for (let i = 0; i < period.data.length; i++) {
        const target = targetDataRef.current[i];
        const from = fromDataRef.current[i];
        
        const val = from.val + (target.val - from.val) * e;
        const angle = (val / 100) * Math.PI * 2;
        const endAngle = startAngle + angle;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.arc(cx, cy, rInner, endAngle, startAngle, true);
        ctx.closePath();
        ctx.clip();
        
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = target.color;
        
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x += cell) {
          for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y += cell) {
            const jx = x + cell / 2;
            const jy = y + cell / 2;
            const jit = hash(jx, jy);
            
            const dx = jx - cx;
            const dy = jy - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < rInner - cell || dist > r + cell) continue;
            
            let a = Math.atan2(dy, dx);
            if (a < 0) a += Math.PI * 2;
            
            const waveRaw = Math.sin(jx * 0.05 + time) + Math.sin(jy * 0.05 + time * 0.7);
            const mod = smoothstep(-1.5, 1.5, waveRaw);
            
            const sz = cell * (0.4 + 0.4 * mod) * (0.8 + 0.4 * jit);
            ctx.fillRect(x + (cell - sz)/2, y + (cell - sz)/2, sz, sz);
          }
        }
        
        ctx.restore();
        startAngle = endAngle;
      }

      ctx.restore();
      req = requestAnimationFrame(draw);
    };
    req = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(req);
  }, [period]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="relative w-[130px] h-[130px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const hash = (x: number, y: number) => {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

export function UptimeChart({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const data = Array.from({ length: 90 }, (_, i) => {
    if (i === 12 || i === 45 || i === 78) return 0.8;
    if (i === 22 || i === 60) return 0;
    return 1;
  });

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
      
      const w = rect.width;
      const days = data.length;
      
      const barW = 6;
      const gap = 2;
      const perRow = Math.floor(w / (barW + gap));
      const cell = 2;

      for (let i = 0; i < days; i++) {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        
        const x = col * (barW + gap);
        const y = row * (26 + gap);
        
        const val = data[i];
        const color = val === 1 ? '#FFFFFF' : val === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)';
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, barW, 26);
        ctx.clip();
        
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = color;
        
        for (let tx = x; tx <= x + barW; tx += cell) {
          for (let ty = y; ty <= y + 26; ty += cell) {
            const jx = tx + cell / 2;
            const jy = ty + cell / 2;
            const jit = hash(jx, jy);
            
            const waveRaw = Math.sin(jx * 0.05 + time) + Math.sin(jy * 0.05 + time * 0.7);
            const mod = smoothstep(-1.5, 1.5, waveRaw);
            
            const sz = cell * (0.3 + 0.4 * mod) * (0.8 + 0.4 * jit);
            ctx.fillRect(tx + (cell - sz)/2, ty + (cell - sz)/2, sz, sz);
          }
        }
        ctx.restore();
      }

      ctx.restore();
      req = requestAnimationFrame(draw);
    };
    
    req = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(req);
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="relative w-full h-[60px] flex items-center justify-center px-2">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}

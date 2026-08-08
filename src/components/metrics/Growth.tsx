import { MoreHorizontal } from 'lucide-react';

export default function Growth() {
  const renderBar = (cols: number, rows: number) => {
    return (
      <div 
        className="grid gap-[2px] w-full"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="aspect-square bg-neutral-200 rounded-[1px]" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base font-medium text-neutral-200">Growth</h3>
        <MoreHorizontal className="w-5 h-5 text-neutral-500" />
      </div>
      <p className="text-[13px] text-neutral-400 mb-8">Celebrate your financial success</p>

      <div className="flex items-baseline gap-3 mb-12">
        <span className="text-4xl font-semibold text-white tracking-tight">$7,432.58</span>
        <span className="text-sm font-medium text-emerald-400">↑ 8.3%</span>
      </div>

      <div className="flex items-end gap-2 mt-auto">
        <div className="flex-1">
           {renderBar(14, 16)}
        </div>
        <div className="flex-1">
           {renderBar(14, 28)}
        </div>
        <div className="flex-1">
           {renderBar(14, 46)}
        </div>
      </div>
    </div>
  );
}

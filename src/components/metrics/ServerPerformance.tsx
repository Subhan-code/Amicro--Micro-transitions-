import { ArrowUpRight } from 'lucide-react';

export default function ServerPerformance() {
  const heights = [8, 12, 16, 20, 26, 36, 52, 75];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-medium text-neutral-300">Server Performance Metrics</h3>
        <ArrowUpRight className="w-5 h-5 text-neutral-500" />
      </div>
      
      <div className="text-5xl font-medium text-white mb-10 tracking-tight">+45%</div>

      <div className="flex items-end gap-2 h-[120px] mt-auto">
        {heights.map((h, i) => (
          <div 
            key={i}
            className="flex-1 bg-neutral-800/80 border-t-[3px] border-neutral-300 rounded-b-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

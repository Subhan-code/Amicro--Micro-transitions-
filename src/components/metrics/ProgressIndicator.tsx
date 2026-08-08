import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function ProgressIndicator() {
  const totalBars = 36;
  const filledBars = 24;

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-neutral-200">Progress Indicator</h3>
        <MoreHorizontal className="w-5 h-5 text-neutral-500" />
      </div>
      
      <p className="text-[13px] text-neutral-400 mt-2">
        You are on track to finish this goal three days early
      </p>

      <div className="h-px w-full bg-white/5 my-6"></div>

      <div className="flex items-center gap-3">
        <span className="text-5xl font-semibold tracking-tight text-white">66%</span>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10 bg-white/5">
          <ArrowUpRight className="w-3 h-3 text-neutral-300" />
          <span className="text-[11px] font-medium text-neutral-200">8%</span>
        </div>
        <span className="text-xs text-neutral-500 ml-1">vs. the last period</span>
      </div>

      <div className="flex gap-[3px] h-12 w-full mt-8">
        {Array.from({ length: totalBars }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm ${i < filledBars ? 'bg-neutral-200' : 'bg-neutral-800'}`} 
          />
        ))}
      </div>
    </div>
  );
}

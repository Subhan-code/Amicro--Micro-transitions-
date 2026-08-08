import { MoreHorizontal, Crown } from 'lucide-react';

export default function SalesOverview() {
  return (
    <div className="bg-white rounded-[2.5rem] p-7 shadow-2xl shadow-neutral-200/50 max-w-[360px] mx-auto font-sans border border-neutral-100">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-[22px] font-bold text-neutral-900">Sales Overview</h2>
         <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer">
           <MoreHorizontal className="w-5 h-5 text-neutral-600" />
         </div>
       </div>

       <div className="bg-[#F3F4F6] rounded-2xl p-3.5 flex items-center justify-center gap-2 mb-10 border border-neutral-200/60">
         <Crown className="w-4 h-4 text-indigo-500" />
         <span className="text-[13px] font-medium text-neutral-700">You're the top <span className="text-indigo-600">17%</span> of performers</span>
       </div>

       <div className="relative flex justify-center mb-10">
          <div className="relative w-[260px] h-[130px] overflow-hidden">
             <div className="absolute top-0 left-0 w-[260px] h-[260px]">
               {Array.from({length: 12}).map((_, i) => {
                 const rotation = (i * (180 / 11)) - 180;
                 const isFilled = i < 8;
                 return (
                   <div 
                      key={i} 
                      className="absolute top-0 left-1/2 w-8 h-[130px] origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                   >
                      <div 
                        className={`w-[26px] h-10 rounded-md mx-auto ${isFilled ? 'bg-[#5B5CE6]' : 'bg-neutral-100'} shadow-sm`} 
                        style={isFilled ? { boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' } : {}}
                      />
                   </div>
                 )
               })}
             </div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-full">
             <div className="text-[34px] font-bold text-neutral-900 tracking-tight leading-none mb-1">67.2%</div>
             <div className="text-[13px] text-neutral-600 font-medium">sales goals</div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
         <div className="bg-[#F9FAFB] rounded-[1.25rem] p-4 border border-neutral-200/60 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-semibold text-neutral-500 leading-tight w-12">Number of Sales</span>
              <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center gap-0.5 shadow-sm">
                3.5% <span className="text-xs leading-none">↗</span>
              </span>
            </div>
            <div className="text-[22px] font-bold text-neutral-900 tracking-tight">1,304</div>
         </div>
         <div className="bg-[#F9FAFB] rounded-[1.25rem] p-4 border border-neutral-200/60 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-semibold text-neutral-500 leading-tight w-12">Total Revenue</span>
              <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center gap-0.5 shadow-sm">
                4.5% <span className="text-xs leading-none">↘</span>
              </span>
            </div>
            <div className="text-[22px] font-bold text-neutral-900 tracking-tight">$21.1K</div>
         </div>
       </div>
    </div>
  )
}

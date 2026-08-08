import { MoreHorizontal, HelpCircle } from 'lucide-react';

export default function CacheStatsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] mx-auto font-sans shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100">
       <div className="flex justify-between items-start mb-2">
         <h2 className="text-[17px] font-semibold text-neutral-800 flex items-center gap-1">
           query <span className="font-bold text-neutral-900">getUser</span> <span className="text-neutral-400 font-normal">›</span>
         </h2>
         <MoreHorizontal className="w-5 h-5 text-neutral-400" />
       </div>
       
       <div className="text-[13px] text-neutral-500 font-medium mb-6">
         7.15M Requests · 9% · 734ms P95
       </div>

       <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-[12px] text-neutral-500 font-medium mb-1.5">Cache Hit Rate</div>
            <div className="flex items-center gap-2 mb-1.5">
               <div className="w-6 h-6 relative">
                 {/* Circular dots icon approximation */}
                 <svg viewBox="0 0 24 24" className="w-full h-full -rotate-90">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#F1F5F9" strokeWidth="3" strokeDasharray="4 4" />
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="4 20" />
                 </svg>
               </div>
               <span className="text-[28px] font-bold text-neutral-900 tracking-tight leading-none">12.3%</span>
            </div>
            <div className="text-[12px] font-medium text-[#EF4444] flex items-center gap-1">
              ↘ down from 19.6%
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[12px] text-neutral-500 font-medium mb-1.5">Max CHR</div>
            <div className="text-[28px] font-medium text-neutral-600 tracking-tight leading-none mb-1.5">72.6%</div>
            <div className="text-[12px] font-medium text-neutral-500 flex items-center justify-end gap-1">
              CHR Impact +5.4% <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />
            </div>
          </div>
       </div>

       <div className="h-px w-[calc(100%+3rem)] -mx-6 bg-neutral-100 mb-6" />

       <div className="mb-6">
         <div className="flex items-baseline gap-1.5 mb-1">
           <span className="text-[20px] font-semibold text-neutral-900 tracking-tight">90.5 GB</span>
           <span className="text-[15px] font-medium text-neutral-500">(69.8%)</span>
         </div>
         <div className="flex justify-between items-center text-[12px] font-medium text-neutral-500 mb-4">
           <div className="flex items-center gap-1.5">
             <div className="flex gap-[2px] opacity-60">
               <div className="w-0.5 h-2.5 bg-purple-600 rounded-full" />
               <div className="w-0.5 h-3.5 bg-purple-600 rounded-full" />
               <div className="w-0.5 h-2.5 bg-purple-600 rounded-full" />
             </div>
             Cacheable Bandwidth
           </div>
           <div className="flex items-center gap-1">
             <div className="w-4 h-4 rounded-full border border-neutral-200 flex items-center justify-center text-[9px]">$</div>
             $9.50
             <HelpCircle className="w-3.5 h-3.5 text-neutral-300 ml-0.5" />
           </div>
         </div>

         {/* Segmented Progress Bar */}
         <div className="h-3.5 w-full flex gap-1 rounded-full overflow-hidden mb-6">
            <div className="bg-[#1C1635] w-[20%] rounded-l-full" />
            <div className="bg-[#9F7AEA] w-[15%]" />
            <div className="bg-[#E9D5FF] flex-1 rounded-r-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)' }} />
         </div>

         <div className="space-y-2 text-[12px] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9F7AEA]" />
              <span className="text-neutral-500">Cached</span>
              <span className="text-neutral-900">12.8 GB</span>
              <span className="text-neutral-400">(9.8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C1635]" />
              <span className="text-neutral-500">Non-Cacheable</span>
              <span className="text-neutral-900">26.3 GB</span>
              <span className="text-neutral-400">(20.3%)</span>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-neutral-500">Total</span>
              <span className="text-neutral-900">129.6 GB</span>
            </div>
         </div>
       </div>
    </div>
  )
}

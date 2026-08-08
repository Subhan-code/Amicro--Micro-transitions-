export default function RunningStatsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] mx-auto font-sans shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
       <div className="flex justify-between items-start mb-10">
         <div>
           <div className="text-[28px] font-bold text-neutral-900 tracking-tight leading-none mb-2">18,13 km</div>
           <div className="text-[13px] text-neutral-400 font-medium">3h 45m</div>
         </div>
         <div className="text-[13px] text-neutral-400 font-medium mt-1">
           Running last week
         </div>
       </div>

       <div className="h-[140px] relative px-2 flex items-end justify-between">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            <div className="w-full border-b border-neutral-100 relative">
               <span className="absolute -right-1 -top-2 text-[9px] text-neutral-300 font-medium bg-white pl-2">10 km</span>
            </div>
            <div className="w-full border-b border-neutral-100 relative">
               <span className="absolute -right-1 -top-2 text-[9px] text-neutral-300 font-medium bg-white pl-2">5 km</span>
            </div>
            <div className="w-full border-b border-neutral-100 relative">
               <span className="absolute -right-1 -top-2 text-[9px] text-neutral-300 font-medium bg-white pl-2">0 km</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <div className="w-[18px] bg-[#F97316] rounded-t-lg h-[95%]" />
            <span className="text-[10px] font-semibold text-neutral-400 absolute -bottom-1">Mon</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <div className="w-[18px] bg-[#F97316] rounded-t-lg h-[75%]" />
            <span className="text-[10px] font-semibold text-neutral-400 absolute -bottom-1">Tue</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <span className="text-[10px] font-semibold text-neutral-400 absolute -bottom-1">Wed</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <div className="w-[18px] bg-[#F97316] rounded-t-lg h-[85%]" />
            <span className="text-[10px] font-semibold text-neutral-400 absolute -bottom-1">Thu</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <span className="text-[10px] font-bold text-white bg-neutral-900 px-2 py-0.5 rounded-full absolute -bottom-1 whitespace-nowrap z-20">Fri</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <span className="text-[10px] font-semibold text-neutral-300 absolute -bottom-1">Sat</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 relative z-10 w-8 h-full justify-end pb-8">
            <span className="text-[10px] font-semibold text-neutral-300 absolute -bottom-1">Sun</span>
          </div>
       </div>
    </div>
  )
}

export default function NoiseCards() {
  return (
    <div className="flex gap-4">
       {/* 40 dB */}
       <div className="bg-white rounded-[1.5rem] p-5 w-40 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100/50">
          <div className="text-[11px] text-neutral-400 font-medium mb-1">Current noise level</div>
          <div className="flex items-start justify-between mb-8">
             <div className="flex items-baseline gap-1">
               <span className="text-[32px] font-semibold text-neutral-900 tracking-tight leading-none">40</span>
               <span className="text-xs font-medium text-neutral-400">dB</span>
             </div>
             <div className="flex items-end gap-[3px] h-3 mt-1.5">
               <div className="w-[3px] h-1.5 bg-[#4ADE80] rounded-full" />
               <div className="w-[3px] h-2.5 bg-[#4ADE80] rounded-full" />
               <div className="w-[3px] h-4 bg-[#4ADE80] rounded-full" />
             </div>
          </div>
          
          <div className="flex justify-between text-[9px] text-neutral-400 font-medium mb-2">
            <span>Low</span>
            <span>High</span>
          </div>

          <div className="flex gap-1 h-10">
             <div className="flex-[0.8] bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-xl flex items-end p-2 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)' }}></div>
                <span className="text-white text-[10px] font-bold relative z-10">30</span>
             </div>
             <div className="flex-1 bg-neutral-100 rounded-xl flex items-end justify-end p-2">
                <span className="text-neutral-300 text-[10px] font-bold">120</span>
             </div>
          </div>
       </div>

       {/* 60 dB */}
       <div className="bg-white rounded-[1.5rem] p-5 w-40 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100/50">
          <div className="text-[11px] text-neutral-400 font-medium mb-1">Current noise level</div>
          <div className="flex items-start justify-between mb-8">
             <div className="flex items-baseline gap-1">
               <span className="text-[32px] font-semibold text-neutral-900 tracking-tight leading-none">60</span>
               <span className="text-xs font-medium text-neutral-400">dB</span>
             </div>
             <div className="flex items-end gap-[3px] h-3 mt-1.5">
               <div className="w-[3px] h-2 bg-[#FACC15] rounded-full" />
               <div className="w-[3px] h-3 bg-[#FACC15] rounded-full" />
               <div className="w-[3px] h-4 bg-[#FACC15] rounded-full" />
             </div>
          </div>
          
          <div className="flex justify-between text-[9px] text-neutral-400 font-medium mb-2">
            <span>Low</span>
            <span>High</span>
          </div>

          <div className="flex gap-1 h-10">
             <div className="flex-1 bg-gradient-to-br from-[#FACC15] to-[#EAB308] rounded-xl flex items-end p-2 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)' }}></div>
                <span className="text-white text-[10px] font-bold relative z-10">60</span>
             </div>
             <div className="flex-[0.8] bg-neutral-100 rounded-xl flex items-end justify-end p-2">
                <span className="text-neutral-300 text-[10px] font-bold">120</span>
             </div>
          </div>
       </div>
    </div>
  )
}

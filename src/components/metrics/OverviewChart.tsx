import { ChevronDown } from 'lucide-react';

export default function OverviewChart() {
  const data = [
    { month: 'Apr', value: 30 },
    { month: 'May', value: 15 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 40 },
    { month: 'Aug', value: 75, active: true },
    { month: 'Sep', value: 35 },
    { month: 'Oct', value: 40 },
    { month: 'Nov', value: 45 },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-7 shadow-2xl shadow-neutral-200/50 max-w-[500px] w-full mx-auto font-sans border border-neutral-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[19px] font-semibold text-neutral-900 mb-5">Overview</h2>
          <div className="text-[13px] text-neutral-500 font-medium mb-1">Avg Per month</div>
          <div className="flex items-center gap-3">
             <span className="text-[28px] font-bold text-neutral-900 tracking-tight">1,860<span className="text-[20px] font-semibold text-neutral-400">/3K</span></span>
             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-md shadow-sm flex items-center gap-0.5">
               50.2% ▲
             </span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:bg-neutral-50">
           Last Month <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-[180px] relative mt-16 px-1 flex items-end justify-between">
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 pt-2">
           <div className="w-full border-b border-dashed border-neutral-200/80"></div>
           <div className="w-full border-b border-dashed border-neutral-200/80"></div>
           <div className="w-full border-b border-dashed border-neutral-200/80"></div>
         </div>

         {data.map((item, i) => (
           <div key={i} className="flex flex-col items-center gap-3 relative z-10 w-11">
             {item.active && (
                <div className="absolute -top-[64px] flex flex-col items-center w-[90px]">
                   <div className="bg-[#2C2C2C] text-white rounded-xl p-2.5 text-center shadow-xl w-full relative z-20 border border-neutral-800">
                     <div className="text-[10px] text-neutral-400 font-medium mb-1">August 2025</div>
                     <div className="text-[13px] font-semibold">120 pcs</div>
                     <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#2C2C2C] border-b border-r border-neutral-800 rotate-45"></div>
                   </div>
                </div>
             )}
             
             {item.active && (
                <div className="absolute -top-3.5 w-4 h-4 bg-white border-[3px] border-[#2C2C2C] rounded-full z-20 shadow-sm"></div>
             )}

             <div 
               className={`w-full rounded-lg border-2 transition-all ${item.active ? 'bg-[#999999] border-[#2C2C2C]' : 'border-neutral-200/60 bg-neutral-50'}`}
               style={{ 
                 height: `${item.value}%`,
                 ...(item.active ? {
                   backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 2px, transparent 2px, transparent 6px)'
                 } : {
                   backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 2px, transparent 2px, transparent 6px)'
                 })
               }}
             />
             <span className="text-[13px] font-medium text-neutral-500">{item.month}</span>
           </div>
         ))}
      </div>
    </div>
  )
}

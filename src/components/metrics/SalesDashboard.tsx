import { Wallet, Eye, CircleDollarSign, List } from 'lucide-react';

export default function SalesDashboard() {
  return (
    <div className="bg-[#F8F7F5] p-8 rounded-[2.5rem] w-full font-sans relative overflow-hidden border border-neutral-200/50 shadow-inner">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 relative z-10">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
           <div className="flex items-center gap-2.5 text-neutral-500 mb-5">
             <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100/80">
                <Wallet className="w-4 h-4 text-neutral-600" />
             </div>
             <span className="text-[13px] font-medium text-neutral-600">Total Sales</span>
           </div>
           <div className="text-[26px] font-semibold text-neutral-900 mb-2.5 tracking-tight">$34,678</div>
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-md flex items-center gap-0.5">
                ▲ 8%
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">VS Last Week</span>
           </div>
         </div>

         <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
           <div className="flex items-center gap-2.5 text-neutral-500 mb-5">
             <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100/80">
                <Eye className="w-4 h-4 text-neutral-600" />
             </div>
             <span className="text-[13px] font-medium text-neutral-600">Property views</span>
           </div>
           <div className="text-[26px] font-semibold text-neutral-900 mb-2.5 tracking-tight">46246</div>
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-md flex items-center gap-0.5">
                ▼ 1.8%
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">VS Last Week</span>
           </div>
         </div>

         <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
           <div className="flex items-center gap-2.5 text-neutral-500 mb-5">
             <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100/80">
                <CircleDollarSign className="w-4 h-4 text-neutral-600" />
             </div>
             <span className="text-[13px] font-medium text-neutral-600">Future funds</span>
           </div>
           <div className="text-[26px] font-semibold text-neutral-900 mb-2.5 tracking-tight">$34,678</div>
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-md flex items-center gap-0.5">
                ▲ 18%
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">VS Last Week</span>
           </div>
         </div>

         <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
           <div className="flex items-center gap-2.5 text-neutral-500 mb-5">
             <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100/80">
                <List className="w-4 h-4 text-neutral-600" />
             </div>
             <span className="text-[13px] font-medium text-neutral-600">Total properties</span>
           </div>
           <div className="text-[26px] font-semibold text-neutral-900 mb-2.5 tracking-tight">435</div>
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-md flex items-center gap-0.5">
                ▼ 1.2%
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">VS Last Week</span>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
         {/* Sales Analytics */}
         <div className="bg-white rounded-3xl p-7 shadow-sm border border-neutral-100 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-[17px] font-semibold text-neutral-900">Sales analytics</h3>
               <div className="flex bg-neutral-100/80 rounded-full p-0.5 text-[11px] font-medium">
                 <button className="px-4 py-1.5 rounded-full text-neutral-500">Monthly</button>
                 <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-neutral-900 border border-neutral-200/50">Weekly</button>
               </div>
            </div>

            <div className="mb-8">
              <div className="text-[13px] text-neutral-400 font-medium mb-1.5">Total unites sold</div>
              <div className="text-4xl font-semibold text-neutral-900 tracking-tight flex items-baseline gap-1">
                345 <span className="text-xl text-neutral-400 font-normal">/500</span>
              </div>
            </div>

            <div className="flex items-center gap-5 text-[11px] font-semibold text-neutral-500 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#EA580C] rounded-[3px]" /> Total Sales
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#FBBF24] rounded-[3px]" /> Total Earnings
              </div>
            </div>

            <div className="flex-1 relative flex items-end justify-between px-6 pb-6 mt-4">
               <div className="absolute inset-0 flex flex-col justify-between pb-8 pt-4">
                 <div className="border-b border-dashed border-neutral-200 w-full relative"><span className="absolute -left-6 -top-2 text-[10px] text-neutral-400 font-medium">300</span></div>
                 <div className="border-b border-dashed border-neutral-200 w-full relative"><span className="absolute -left-6 -top-2 text-[10px] text-neutral-400 font-medium">200</span></div>
                 <div className="border-b border-dashed border-neutral-200 w-full relative"><span className="absolute -left-6 -top-2 text-[10px] text-neutral-400 font-medium">100</span></div>
                 <div className="border-b border-dashed border-neutral-200 w-full relative"><span className="absolute -left-4 -top-2 text-[10px] text-neutral-400 font-medium">0</span></div>
               </div>
               
               {/* Sep */}
               <div className="flex gap-2 items-end h-[60%] relative z-10 w-14 justify-center">
                 <div className="w-[18px] h-full rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <div className="w-[18px] h-[80%] rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <span className="absolute -bottom-7 text-[11px] font-medium text-neutral-400">Sep</span>
               </div>
               {/* Oct - Highlighted */}
               <div className="flex gap-2 items-end h-[85%] relative z-10 w-14 justify-center">
                 <div className="w-[20px] h-[80%] rounded-md bg-[#EA580C] shadow-sm"></div>
                 <div className="w-[20px] h-full rounded-md bg-[#FBBF24] shadow-sm"></div>
                 <span className="absolute -bottom-7 text-[11px] font-bold text-neutral-800">Oct</span>
               </div>
               {/* Nov */}
               <div className="flex gap-2 items-end h-[70%] relative z-10 w-14 justify-center">
                 <div className="w-[18px] h-full rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <div className="w-[18px] h-[60%] rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <span className="absolute -bottom-7 text-[11px] font-medium text-neutral-400">Nov</span>
               </div>
               {/* Dec */}
               <div className="flex gap-2 items-end h-[50%] relative z-10 w-14 justify-center">
                 <div className="w-[18px] h-full rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <div className="w-[18px] h-[40%] rounded-md bg-neutral-50 border border-neutral-200/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, transparent 2px, transparent 4px)' }}></div>
                 <span className="absolute -bottom-7 text-[11px] font-medium text-neutral-400">Dec</span>
               </div>
            </div>
         </div>

         {/* Sales Target */}
         <div className="bg-white rounded-3xl p-7 shadow-sm border border-neutral-100 flex flex-col min-h-[400px]">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-[17px] font-semibold text-neutral-900">Sales target</h3>
               <div className="flex bg-neutral-100/80 rounded-full p-0.5 text-[11px] font-medium">
                 <button className="px-4 py-1.5 rounded-full text-neutral-500">Monthly</button>
                 <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-neutral-900 border border-neutral-200/50">Yearly</button>
               </div>
            </div>

            <div className="flex items-center gap-6 text-[12px] font-medium text-neutral-600 mb-12 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-200 rounded-full" /> Property listed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#EA580C] rounded-full" /> Property delivered
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative mt-8">
               {/* Semi circle gauge using rotated divs */}
               <div className="relative w-[320px] h-[160px] overflow-hidden">
                 <div className="absolute top-0 left-0 w-[320px] h-[320px]">
                   {Array.from({length: 16}).map((_, i) => {
                     const rotation = (i * (180 / 15)) - 180;
                     const isFilled = i < 11;
                     const isOrange = i < 6;
                     return (
                       <div 
                          key={i} 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[160px] origin-bottom"
                          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                       >
                          <div className={`w-[36px] h-12 rounded-[8px] mx-auto ${isFilled ? (isOrange ? 'bg-[#FDBA74]' : 'bg-[#EA580C]') : 'bg-neutral-100'} border-[3px] border-white shadow-sm`} />
                       </div>
                     )
                   })}
                 </div>
               </div>
               
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                 <div className="text-[40px] font-bold text-neutral-900 tracking-tight leading-none">70%</div>
                 <div className="text-[13px] text-neutral-500 font-medium mt-2">Achieved</div>
               </div>
               
               {/* Subtle shadow glow under the gauge */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] h-[120px] bg-orange-500/10 rounded-t-full blur-3xl pointer-events-none"></div>
            </div>
         </div>
      </div>
    </div>
  );
}

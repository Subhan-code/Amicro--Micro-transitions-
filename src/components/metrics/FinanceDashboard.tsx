import { MoreHorizontal, ChevronDown } from 'lucide-react';

export default function FinanceDashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Savings & Expenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            {/* Savings Progress */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[17px] font-semibold text-neutral-800">Savings Progress</h3>
                  <p className="text-[13px] text-neutral-500 mt-0.5">Your Savings: $16,322.95</p>
                </div>
                <div className="flex bg-neutral-100/50 rounded-xl p-1">
                  {['1D', '7D', '1M'].map((period, i) => (
                    <button key={period} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${i === 2 ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-400'}`}>
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-40 relative flex items-end">
                 <div className="absolute inset-0 grid grid-cols-[repeat(24,1fr)] gap-[3px] opacity-[0.15]">
                    {Array.from({length: 24 * 8}).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-neutral-400 rounded-sm" />
                    ))}
                 </div>
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-sm text-[11px] font-bold text-emerald-500 border border-neutral-100 flex items-center gap-1.5 z-10">
                    Savings: $223.42
                 </div>
                 <div className="absolute top-10 bottom-0 left-1/2 w-px border-l-2 border-dashed border-emerald-500" />
                 
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-neutral-400 font-semibold">
                   Jun 20
                 </div>
              </div>
            </div>

            {/* Credit Score */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
               <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[17px] font-semibold text-neutral-800">Credit Score</h3>
                  <p className="text-[13px] text-neutral-500 mt-0.5">Your current credit rating.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-xl shadow-sm">
                  Weekly <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-semibold text-neutral-900 tracking-tight">88</span>
                <span className="text-xl text-neutral-400 font-medium">/100</span>
                <span className="text-[11px] font-bold text-emerald-500 ml-2">▲ 13.6%</span>
                <span className="text-[11px] font-medium text-neutral-400">vs last month</span>
              </div>

              <div className="flex gap-[3px] h-8">
                {Array.from({length: 42}).map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i < 35 ? 'bg-emerald-500' : 'bg-neutral-100'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Major Expenses */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[17px] font-semibold text-neutral-800">Major Expenses</h3>
                <p className="text-[13px] text-neutral-500 mt-0.5">Your biggest spending categories.</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="flex gap-4 mb-8 text-[11px] font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#60A5FA]" /> Housing</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#FB7185]" /> Food</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#FBBF24]" /> Others</div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-4 pb-6 relative">
               <div className="w-full flex flex-col gap-[3px] relative group">
                 <div className="w-full bg-neutral-100 h-16 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-4" />
                 <div className="w-full bg-[#FB7185] h-3" />
                 <div className="w-full bg-[#60A5FA] h-12 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Mon.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-8 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-20" />
                 <div className="w-full bg-[#FB7185] h-8" />
                 <div className="w-full bg-[#60A5FA] h-14 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Tue.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-24 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-6" />
                 <div className="w-full bg-[#FB7185] h-6" />
                 <div className="w-full bg-[#60A5FA] h-12 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Wed.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-4 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-8" />
                 <div className="w-full bg-[#60A5FA] h-28 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Thu.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-16 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-12" />
                 <div className="w-full bg-[#FB7185] h-4" />
                 <div className="w-full bg-[#60A5FA] h-16 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Fri.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-12 rounded-t-sm" />
                 <div className="w-full bg-[#FBBF24] h-16" />
                 <div className="w-full bg-[#FB7185] h-20 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Sat.</span>
               </div>
               <div className="w-full flex flex-col gap-[3px] relative">
                 <div className="w-full bg-neutral-100 h-20 rounded-t-sm" />
                 <div className="w-full bg-[#FB7185] h-8" />
                 <div className="w-full bg-[#60A5FA] h-20 rounded-b-sm" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-neutral-400">Sun.</span>
               </div>
            </div>
          </div>
        </div>

        {/* Your Assets */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
           <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[17px] font-semibold text-neutral-800">Your Assets</h3>
                <p className="text-[13px] text-neutral-500 mt-0.5">Total value of what you own.</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-xl shadow-sm">
                All Tokens <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-4 mb-4 gap-4">
               <div>
                  <div className="text-3xl font-semibold text-neutral-900 tracking-tight">$16,546.37</div>
                  <div className="text-[11px] font-bold text-emerald-500 mt-1">▲ 4.2% <span className="text-neutral-400 font-medium">vs last month</span></div>
               </div>

               <div className="flex items-center gap-6 text-[11px] font-semibold text-neutral-600">
                  <div className="flex items-center gap-1.5">
                     <div className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center text-[8px] text-white">$</div>
                     $5,482.19 <span className="text-neutral-400 font-medium">(USDC)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-[8px] text-white">₿</div>
                     $6,731.58 <span className="text-neutral-400 font-medium">(BTC)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center text-[8px] text-white">₮</div>
                     $4,332.60 <span className="text-neutral-400 font-medium">(USDT)</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-[3px] h-3 w-full rounded-sm overflow-hidden">
               <div className="bg-[#6366F1] rounded-sm" style={{width: '35%'}} />
               <div className="bg-[#F59E0B] rounded-sm" style={{width: '40%'}} />
               <div className="bg-[#14B8A6] rounded-sm" style={{width: '25%'}} />
            </div>
        </div>
      </div>
    </div>
  )
}

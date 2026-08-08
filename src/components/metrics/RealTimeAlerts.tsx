export default function RealTimeAlerts() {
  return (
    <div className="bg-white rounded-[2rem] p-6 max-w-[340px] mx-auto font-sans border border-neutral-100 shadow-2xl shadow-neutral-200/50">
       <div className="bg-[#F8F9FA] rounded-3xl p-6 shadow-sm border border-neutral-200/60 mb-6">
          <div className="flex justify-between items-center text-[13px] font-semibold text-neutral-700 mb-5 font-mono">
             <span>Mar - Apr</span>
             <span>68%</span>
          </div>

          <div className="relative h-2 w-full bg-neutral-200 rounded-full mb-3">
             <div className="absolute top-0 left-0 h-full w-[68%] bg-[#FB4358] rounded-full" />
             <div className="absolute top-1/2 -translate-y-1/2 left-[68%] w-4 h-4 bg-[#FB4358] rounded-full shadow-md border-2 border-white -ml-2" />
          </div>
          
          <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-10">
            <span>0B</span>
            <span>45B</span>
          </div>

          <div className="relative h-44 flex items-end justify-between px-1">
             <div className="absolute top-8 left-0 right-0 border-b border-dashed border-[#FB4358]/50 z-10" />
             
             {/* AI Bar */}
             <div className="w-12 h-[75%] rounded-[1.25rem] bg-white border border-neutral-200/80 flex flex-col relative overflow-hidden p-1 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)]">
                <div className="w-full h-1/4 bg-neutral-50 rounded-t-[14px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 2px, transparent 2px, transparent 6px)' }} />
                <div className="w-full flex-1 bg-[#1C1C1C] rounded-[16px] flex flex-col items-center justify-between py-3">
                   <span className="text-[11px] text-white font-medium font-mono">8.5B</span>
                   <span className="text-[11px] text-white font-medium">AI</span>
                </div>
             </div>

             {/* ChatGPT Bar */}
             <div className="w-12 h-[100%] rounded-[1.25rem] bg-white border border-neutral-200/80 flex flex-col relative overflow-hidden p-1 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)] z-20">
                <div className="w-full h-[15%] bg-neutral-50 rounded-t-[14px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 2px, transparent 2px, transparent 6px)' }} />
                <div className="w-full flex-1 bg-[#1C1C1C] rounded-[16px] flex flex-col items-center justify-between py-3">
                   <span className="text-[11px] text-white font-medium font-mono">9.2B</span>
                   <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] text-white">❋</div>
                </div>
             </div>

             {/* Meta Bar */}
             <div className="w-12 h-[55%] rounded-[1.25rem] bg-white border border-neutral-200/80 flex flex-col relative overflow-hidden p-1 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)]">
                <div className="w-full h-[10%] bg-neutral-50 rounded-t-[14px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 2px, transparent 2px, transparent 6px)' }} />
                <div className="w-full flex-1 bg-[#1C1C1C] rounded-[16px] flex flex-col items-center justify-between py-3">
                   <span className="text-[11px] text-white font-medium font-mono">4.1B</span>
                   <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] text-white">∞</div>
                </div>
             </div>

             {/* Plus Bar */}
             <div className="w-12 h-[80%] rounded-[1.25rem] bg-white border border-neutral-200/80 flex flex-col relative overflow-hidden p-1 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)]">
                <div className="w-full h-[10%] bg-neutral-50 rounded-t-[14px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 2px, transparent 2px, transparent 6px)' }} />
                <div className="w-full flex-1 bg-[#1C1C1C] rounded-[16px] flex flex-col items-center justify-between py-3">
                   <span className="text-[11px] text-white font-medium font-mono">8.7B</span>
                   <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[12px] text-white">✦</div>
                </div>
             </div>
          </div>
       </div>

       <div className="px-2">
         <h3 className="text-xl font-semibold text-neutral-900 mb-3 tracking-tight">Real-Time Alerts</h3>
         <p className="text-[14px] leading-[1.6] text-neutral-500">
            Set custom budgets or thresholds and receive instant Slack or email notifications at <span className="font-semibold text-neutral-700">80 % usage</span> so you can course-correct long before invoices explode.
         </p>
       </div>
    </div>
  )
}

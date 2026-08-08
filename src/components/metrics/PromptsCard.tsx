export default function PromptsCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 w-full max-w-[240px] font-sans border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mx-auto">
       <div className="text-[28px] font-semibold text-neutral-900 tracking-tight leading-none mb-3 font-mono">
         12,480
       </div>
       <div className="flex items-center gap-1.5 mb-6 text-[13px]">
          <span className="text-[#10B981] font-bold flex items-center gap-0.5">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
             +8.4%
          </span>
          <span className="text-neutral-500 font-medium">Prompts</span>
       </div>

       <div className="flex gap-[3px] h-6 w-full">
         {Array.from({length: 30}).map((_, i) => (
           <div 
             key={i} 
             className={`flex-1 rounded-sm ${i < 18 ? 'bg-[#FF6B00]' : 'bg-neutral-100'}`} 
           />
         ))}
       </div>
    </div>
  )
}

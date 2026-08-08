export default function Budget() {
  const totalCols = 64;
  const spentCols = 42;

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 flex flex-col h-full font-mono">
      <h3 className="text-2xl tracking-[0.2em] text-neutral-300 mb-10">BUDGET</h3>
      
      <div className="flex justify-between text-xs text-neutral-400 mb-5 tracking-wider">
        <span>SPENT: $1420</span>
        <span>LIMIT: $2200</span>
      </div>

      <div className="grid grid-rows-3 grid-cols-[repeat(64,1fr)] gap-0.5 mb-12">
        {Array.from({ length: 3 * totalCols }).map((_, i) => {
          const colIndex = i % totalCols;
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-[1px] ${colIndex < spentCols ? 'bg-neutral-300' : 'bg-neutral-800'}`} 
            />
          );
        })}
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div className="text-[10px] leading-[1.8] tracking-[0.15em] text-neutral-500 uppercase">
          <div>You're getting close to your limit</div>
          <div>Consider slowing down spending</div>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold tracking-widest hover:bg-neutral-200 transition-colors">
          DETAILS
        </button>
      </div>
    </div>
  );
}

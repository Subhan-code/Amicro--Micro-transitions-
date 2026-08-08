import { Share, MoreVertical } from 'lucide-react';

export default function NetworkTelemetry() {
  const generateData = (rows: number, cols: number) => {
    // deterministic random looking pattern
    const pattern = [
      0,0,1,1,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,1,1,0,0,1,1,0,
      0,1,1,0,1,0,0,0,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,1,1,0,1,0,0,1,1,
      1,0,0,0,0,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,0,1,1,0,0,0,1,0,0,1,1,0,
      0,0,1,1,0,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,0,0,0,0
    ];
    return pattern;
  };

  const augustData = generateData(4, 32);
  const septemberData = [...generateData(4, 32)].reverse();

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-medium text-neutral-200">Network Telemetry</h3>
        <div className="flex items-center gap-4 text-neutral-500">
          <Share className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <MoreVertical className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-3">Average Finality</div>
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-normal tracking-tight text-white">1.8s</span>
            <span className="font-mono text-sm font-medium text-emerald-500">↑ 14.6%</span>
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-3">Intents Finalized</div>
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-normal tracking-tight text-white">312,134</span>
            <span className="font-mono text-sm font-medium text-emerald-500">↑ 11.5%</span>
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-auto">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">August / Testnet V0</span>
            <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">12,450 Intents</span>
          </div>
          <div className="grid grid-cols-[repeat(32,1fr)] gap-1">
            {augustData.map((isActive, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-[1px] ${isActive === 1 ? 'bg-emerald-500' : 'bg-emerald-950/30'}`} 
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">September / V1 Sequencer</span>
            <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">18,916 Intents</span>
          </div>
          <div className="grid grid-cols-[repeat(32,1fr)] gap-1">
            {septemberData.map((isActive, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-[1px] ${isActive === 1 ? 'bg-emerald-500' : 'bg-emerald-950/30'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

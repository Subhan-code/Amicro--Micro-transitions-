import { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

// Stable pseudo-random generator for realistic stock curves
const generateData = (points: number, start: number, trend: number, volatility: number) => {
  let p = start;
  const res = [];
  for (let i = 0; i < points; i++) {
    // Generate a smooth-ish curve using sine waves and a trend
    const change = (Math.sin(i * 0.4) * 0.5 + trend + (Math.sin(i * 2.1) * 0.2)) * volatility;
    p += change;
    
    // Format a mock time/date based on index
    const date = new Date();
    date.setHours(9, 30 + (i * 15), 0, 0); // Mock 15 min intervals starting at 9:30 AM
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    res.push({
      time: timeString,
      price: Number(p.toFixed(2))
    });
  }
  return res;
};

export default function StockChartCard() {
  const [range, setRange] = useState('1W');

  // Generate mock data for different time ranges
  const chartData = useMemo(() => {
     return {
       '1D': generateData(40, 172.5, 0.05, 0.6),
       '1W': generateData(40, 168.2, 0.15, 1.2),
       '1M': generateData(40, 185.0, -0.2, 2.0),
       '3M': generateData(40, 155.0, 0.3, 3.5),
       '1Y': generateData(40, 130.0, 0.4, 4.0),
       'ALL': generateData(40, 45.0, 1.2, 8.0),
     };
  }, []);

  const data = chartData[range as keyof typeof chartData];
  const startPrice = data[0].price;
  const endPrice = data[data.length - 1].price;
  const diff = endPrice - startPrice;
  const percent = (diff / startPrice) * 100;
  const isPositive = diff >= 0;
  
  // Apple HIG Semantic Colors
  const color = isPositive ? '#34C759' : '#FF3B30';
  const gradientId = `stockGradient-${isPositive ? 'green' : 'red'}`;

  return (
    <div className="bg-white rounded-[2rem] p-6 w-full max-w-2xl mx-auto font-sans shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col h-[460px]">
      {/* Header Info */}
      <div className="mb-6 flex justify-between items-start">
         <div>
            <h2 className="text-[18px] font-semibold text-neutral-900 tracking-tight leading-none mb-1">AAPL</h2>
            <div className="text-[13px] font-medium text-neutral-500 mb-3">Apple Inc.</div>
            
            <div className="flex flex-col">
              <span className="text-[44px] font-bold text-neutral-900 tracking-tight leading-none mb-1">
                ${endPrice.toFixed(2)}
              </span>
              <div className="text-[15px] font-semibold flex items-center gap-1.5" style={{ color }}>
                <span>{isPositive ? '+' : ''}{diff.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{percent.toFixed(2)}%)</span>
              </div>
            </div>
         </div>
      </div>

      {/* Interactive Plot Area */}
      <div className="flex-1 w-[calc(100%+2rem)] -ml-4 relative z-10 min-h-[200px]">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
               <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
                     <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <YAxis domain={['dataMin', 'dataMax']} hide />
               
               {/* Apple-style floating scrubber tooltip */}
               <Tooltip
                  content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                        return (
                           <div className="bg-neutral-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-xl border border-neutral-700/50 flex flex-col items-center min-w-[100px] transform -translate-y-4">
                              <span className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                                 {payload[0].payload.time}
                              </span>
                              <span className="text-[15px] font-bold tracking-tight">
                                 ${payload[0].value}
                              </span>
                           </div>
                        );
                     }
                     return null;
                  }}
                  cursor={{ stroke: '#A1A1AA', strokeWidth: 1.5, strokeDasharray: '4 4' }}
               />
               
               <Area
                  type="monotone"
                  dataKey="price"
                  stroke={color}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  activeDot={{ r: 6, fill: color, stroke: '#FFFFFF', strokeWidth: 3, style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' } }}
                  animationDuration={600}
                  animationEasing="ease-in-out"
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      {/* Dynamic Range Selector */}
      <div className="mt-8 flex justify-between bg-neutral-100/80 p-1.5 rounded-full">
         {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((r) => (
            <button
               key={r}
               onClick={() => setRange(r)}
               className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-200 ${
                  range === r
                  ? 'bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
               }`}
            >
               {r}
            </button>
         ))}
      </div>
    </div>
  );
}

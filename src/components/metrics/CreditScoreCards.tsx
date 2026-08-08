import { ArrowUp } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const scoreHistory = [
  { month: 'May', score: 700 },
  { month: 'Jun', score: 717 },
  { month: 'Jul', score: 730 },
];

export default function CreditScoreCards() {
  // Gauge math
  const score = 730;
  const min = 300;
  const max = 850;
  const percent = (score - min) / (max - min);
  const radius = 80;
  const circumference = Math.PI * radius;
  const dashoffset = circumference * (1 - percent);
  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto font-sans">
      {/* Check your score */}
      <div className="bg-[#F5F6FF] rounded-[2rem] p-6 flex flex-col items-center">
        <h3 className="text-[17px] font-semibold text-[#2D334A] w-full text-left mb-6">Check your score</h3>
        <div className="relative w-48 h-24 mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
            {/* Background track */}
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
            {/* Foreground progress */}
            <path 
               d="M 20 100 A 80 80 0 0 1 180 100" 
               fill="none" 
               stroke="#6384F9" 
               strokeWidth="16" 
               strokeLinecap="round" 
               strokeDasharray={circumference} 
               strokeDashoffset={dashoffset} 
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end">
            <span className="text-[15px] font-medium text-[#2D334A] mb-0.5">Good</span>
            <span className="text-[42px] font-bold text-[#111827] leading-none">{score}</span>
          </div>
        </div>
        <div className="bg-[#E4E9FF] text-[#5575E7] px-4 py-2 rounded-full text-[14px] font-semibold flex items-center gap-1.5 mt-2">
          <ArrowUp className="w-4 h-4" /> 8 Points
        </div>
      </div>

      {/* Credit report card */}
      <div className="bg-[#F2F1E4] rounded-[2rem] p-6">
        <h3 className="text-[17px] font-semibold text-[#2D334A] mb-5">Credit report card</h3>
        <div className="flex flex-col gap-3">
          <div className="bg-white/60 rounded-[1.25rem] p-3 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E3DEC6] text-[#787158] font-bold flex items-center justify-center text-[15px]">B</div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#2D334A]">Card Usage</div>
              <div className="text-[12px] text-neutral-500 font-medium">High Impact</div>
            </div>
            <div className="text-[14px] font-bold text-[#2D334A] pr-2">18%</div>
          </div>
          <div className="bg-white/60 rounded-[1.25rem] p-3 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#7C8563] text-white font-bold flex items-center justify-center text-[15px]">A</div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#2D334A] truncate max-w-[100px]">Payment Histo...</div>
              <div className="text-[12px] text-neutral-500 font-medium">High Impact</div>
            </div>
            <div className="text-[14px] font-bold text-[#2D334A] pr-2">Great</div>
          </div>
          <div className="bg-white/60 rounded-[1.25rem] p-3 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#F5EED3] text-[#787158] font-bold flex items-center justify-center text-[15px]">C</div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#2D334A]">Hard Inquiries</div>
              <div className="text-[12px] text-neutral-500 font-medium">Low Impact</div>
            </div>
            <div className="text-[14px] font-bold text-[#2D334A] pr-2">4</div>
          </div>
        </div>
      </div>

      {/* See your utilization */}
      <div className="bg-[#F4ECE3] rounded-[2rem] p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-[17px] font-semibold text-[#663A2B] mb-6">See your utilization</h3>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-[13px] font-medium text-[#A47665] mb-1">Balance</div>
              <div className="text-[32px] font-bold text-[#8C3A21] leading-none">$856</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-[#A47665] mb-1">Limit</div>
              <div className="text-[20px] font-bold text-[#663A2B] leading-none">$14.5k</div>
            </div>
          </div>
          
          <div className="w-full h-4 bg-[#E8DACB] rounded-full overflow-hidden flex relative mb-2">
             <div className="bg-[#F98A5B] h-full rounded-full absolute left-0 top-0 z-10 border-2 border-[#F4ECE3]" style={{ width: '15%' }} />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-[#A47665] px-1">
            <span>Great</span>
            <span>Good</span>
            <span>Fair</span>
            <span>Poor</span>
          </div>
        </div>
        <div className="text-center text-[22px] font-bold text-[#8C3A21] mt-6">
          6% Utilization
        </div>
      </div>

      {/* See changes over time */}
      <div className="bg-[#FCF1F6] rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between">
        <h3 className="text-[17px] font-semibold text-[#5B2C46] mb-4 relative z-10">See changes over time</h3>
        <div className="bg-white/60 rounded-2xl p-3 flex items-center gap-3 relative z-10 mb-8">
          <div className="w-7 h-7 rounded-full bg-[#EFCADD] text-[#933D6B] flex items-center justify-center">
            <ArrowUp className="w-4 h-4" />
          </div>
          <div className="text-[13px] font-medium text-[#5B2C46] leading-tight">
            Your score increased<br/>by 13 points
          </div>
        </div>
        
        <div className="flex-1 w-[calc(100%+2.5rem)] -ml-5 mt-4 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ display: 'none' }}
                itemStyle={{ color: '#9A4572', fontWeight: 600, fontSize: '14px' }}
                formatter={(value: number) => [`${value} Points`, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#9A4572" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#9A4572', stroke: '#FCF1F6', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#9A4572', stroke: '#FCF1F6', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[12px] font-medium text-[#5B2C46] relative z-10 px-4 mt-2">
           {scoreHistory.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react';
import { Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Feb 20', m: 120, c: 45 },
  { name: '', m: 130, c: 65 },
  { name: '', m: 125, c: 85 },
  { name: '', m: 135, c: 80 },
  { name: '', m: 120, c: 60 },
  { name: '', m: 110, c: 45 },
  { name: '', m: 115, c: 60 },
  { name: '', m: 130, c: 55 },
  { name: '', m: 135, c: 75 },
  { name: '', m: 120, c: 90 },
  { name: '', m: 130, c: 85 },
  { name: '', m: 180, c: 95 },
  { name: '', m: 170, c: 110 },
  { name: 'Feb 21', m: 160, c: 100 },
  { name: '', m: 145, c: 105 },
  { name: '', m: 175, c: 100 },
  { name: '', m: 145, c: 110 },
  { name: '', m: 140, c: 105 },
  { name: '', m: 140, c: 100 },
  { name: '', m: 140, c: 80 },
  { name: '', m: 140, c: 45 },
  { name: '', m: 140, c: 50 },
  { name: '', m: 140, c: 70 },
  { name: 'Feb 24', m: 140, c: 70 },
  { name: '', m: 140, c: 55 },
  { name: '', m: 140, c: 65 },
  { name: '', m: 140, c: 50 },
  { name: '', m: 140, c: 55 },
  { name: '', m: 140, c: 60 },
  { name: '', m: 140, c: 60 },
  { name: '', m: 140, c: 60 },
  { name: 'Feb 25', m: 145, c: 62 },
];

export default function VisitorsChartCard() {
  const [activeTab, setActiveTab] = useState('5D');

  return (
    <div className="bg-white rounded-[1.5rem] p-6 max-w-2xl w-full mx-auto font-sans shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100">
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
               <Users className="w-4 h-4" />
            </div>
            <h2 className="text-[17px] font-semibold text-neutral-900">Visitantes</h2>
         </div>
         
         <div className="flex gap-4 text-[13px] font-medium text-neutral-500">
            {['1D', '5D', '1M', '6M', '1A', 'Personalizado'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`transition-colors ${
                     activeTab === tab 
                     ? 'text-neutral-900 font-bold bg-neutral-100/80 px-2 py-0.5 rounded' 
                     : 'hover:text-neutral-700 py-0.5'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      <div className="flex justify-between items-end mb-8">
         <div className="flex items-baseline gap-4">
            <span className="text-[48px] font-bold text-neutral-900 tracking-tight leading-none">120</span>
            <div className="flex flex-col gap-1">
               <span className="text-[12px] text-neutral-500 font-medium">Nos últimos 5 dias</span>
               <span className="text-[12px] font-semibold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded inline-flex items-center gap-0.5 w-fit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  +48%
               </span>
            </div>
         </div>
         
         <div className="flex gap-4 text-[13px] font-medium text-neutral-600">
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-1 bg-[#DC2626] rounded-full" /> Militantes
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-1 bg-[#0284C7] rounded-full" /> Cidadãos
            </div>
         </div>
      </div>

      <div className="h-[240px] w-full relative">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
               <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
               />
               <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  ticks={[0, 50, 100, 150, 200]}
               />
               <Tooltip 
                  content={({ active, payload, label }) => {
                     if (active && payload && payload.length) {
                        return (
                           <div className="bg-white p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-neutral-100 min-w-[140px]">
                              <div className="text-[11px] text-neutral-500 font-medium mb-3">Feb 21 23:45</div>
                              <div className="flex flex-col gap-3">
                                 <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col">
                                       <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 mb-0.5">
                                          <div className="w-0.5 h-3 bg-[#DC2626] rounded-full" /> Militantes
                                       </div>
                                       <div className="text-[13px] font-semibold text-neutral-900">+80</div>
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#10B981] mt-auto">+13%</div>
                                 </div>
                                 <div className="h-px w-full bg-neutral-100" />
                                 <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col">
                                       <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 mb-0.5">
                                          <div className="w-0.5 h-3 bg-[#0284C7] rounded-full" /> Cidadãos
                                       </div>
                                       <div className="text-[13px] font-semibold text-neutral-900">-13</div>
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#EF4444] mt-auto">-5%</div>
                                 </div>
                              </div>
                           </div>
                        );
                     }
                     return null;
                  }}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
               />
               <Line 
                  type="monotone" 
                  dataKey="m" 
                  stroke="#DC2626" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#DC2626', stroke: 'white', strokeWidth: 2 }}
               />
               <Line 
                  type="monotone" 
                  dataKey="c" 
                  stroke="#0284C7" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#0284C7', stroke: 'white', strokeWidth: 2 }}
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </div>
  )
}

import { useState } from 'react';
import { ArrowRight, ArrowUp, ArrowDown, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'AUG 1', value: 300 },
  { name: 'AUG 2', value: 500 },
  { name: 'AUG 3', value: 450 },
  { name: 'AUG 4', value: 700 },
  { name: 'AUG 5', value: 550 },
  { name: 'AUG 6', value: 650 },
  { name: 'AUG 7', value: 400 },
  { name: 'AUG 8', value: 350 },
  { name: 'AUG 9', value: 600 },
  { name: 'AUG 10', value: 500 },
  { name: 'AUG 11', value: 800 },
  { name: 'AUG 12', value: 700 },
  { name: 'AUG 13', value: 1000 },
];

export default function UsersChartCard() {
  const [activeTab, setActiveTab] = useState('12d');

  return (
    <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full mx-auto font-sans shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100">
      <h2 className="text-[12px] font-semibold text-neutral-400 tracking-widest uppercase mb-4">Users</h2>
      
      <div className="bg-neutral-100/80 rounded-full p-1 flex justify-between mb-6">
         {['7d', '12d', '30d'].map((tab) => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 text-[13px] font-medium py-1.5 rounded-full transition-colors ${
                  activeTab === tab 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
         <span className="text-[40px] font-bold text-neutral-900 tracking-tight leading-none">1,240</span>
         <span className="text-[13px] font-semibold text-[#10B981] flex items-center gap-0.5 mt-2">
            <ArrowUp className="w-4 h-4" /> 12.5%
         </span>
      </div>

      <div className="h-[120px] w-[calc(100%+2rem)] -ml-4 relative mb-6">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
               <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
               <Tooltip 
                  content={({ active, payload, label }) => {
                     if (active && payload && payload.length) {
                        return (
                           <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-neutral-100 text-[12px] font-medium text-neutral-600">
                              {label}
                           </div>
                        );
                     }
                     return null;
                  }}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
               />
               <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
               />
            </AreaChart>
         </ResponsiveContainer>
         <div className="flex justify-between text-[11px] font-medium text-neutral-400 mt-2 px-4 uppercase tracking-wider">
            <span>Aug 1</span>
            <span>Aug 6</span>
            <span>Aug 12</span>
         </div>
      </div>

      <div className="flex flex-col gap-4 mb-6 px-1">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-600">
               <User className="w-4 h-4 text-neutral-400" /> New users
            </div>
            <div className="text-[14px] font-semibold text-neutral-900">980</div>
         </div>
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-600">
               <ArrowDown className="w-4 h-4 text-neutral-400" /> Bounce rate
            </div>
            <div className="text-[14px] font-semibold text-neutral-900">43.5%</div>
         </div>
      </div>

      <button className="w-full py-3.5 rounded-2xl border border-neutral-200 text-[14px] font-semibold text-neutral-900 flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors">
         View details <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

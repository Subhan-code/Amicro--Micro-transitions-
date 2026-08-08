import { ArrowUpRight, Plus } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const transactionData = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 50 },
  { day: 'Sat', value: 40 },
  { day: 'Sun', value: 30 },
];

export default function SavingsCards() {
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto font-sans justify-center">
      {/* Dark Version */}
      <div className="flex flex-col gap-3 w-[280px]">
         <div className="bg-[#1C1C1E] rounded-[1.5rem] p-5 text-white shadow-xl">
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-[18px] font-medium tracking-tight">Savings</h3>
               <span className="text-[#60A5FA] text-[13px] font-medium">05.24</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-[1.4] mb-6 max-w-[90%]">
               Save more every month with new features in <span className="text-[#60A5FA]">Premium version</span>
            </p>
            
            <div className="flex justify-between items-center mb-2">
               <span className="text-[13px] font-medium text-neutral-300">Progress</span>
               <Plus className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mb-1.5 flex">
               <div className="h-full bg-[#3B82F6] w-[74%]" />
               <div className="h-full bg-neutral-600 w-1 ml-0.5 rounded-full" />
            </div>
            <div className="text-right text-[11px] text-neutral-400 font-medium mb-6">
               74/100
            </div>

            <div className="flex justify-between items-center bg-neutral-800/50 rounded-2xl p-3 mb-4 border border-neutral-700/50">
               <div className="text-[16px] font-semibold tracking-tight">$890.00<span className="text-neutral-400 font-medium">/$1,200</span></div>
               <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-neutral-300" />
               </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
               <span>Last month</span>
               <span>01 January 2024 - 2025</span>
            </div>
         </div>

         <div className="bg-[#1C1C1E] rounded-[1.5rem] p-5 text-white shadow-xl flex flex-col justify-between">
            <div className="h-[110px] w-[calc(100%+1rem)] -ml-2 mb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={12}>
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#262626', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#60A5FA'}} labelStyle={{display: 'none'}} />
                     <Bar dataKey="value" radius={[2, 2, 2, 2]} background={{ fill: '#262626', radius: 2 }}>
                        {transactionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill="#60A5FA" />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
               <div className="flex justify-between text-[9px] text-neutral-500 font-medium mt-2 px-3">
                  {transactionData.map(d => <span key={d.day}>{d.day}</span>)}
               </div>
            </div>
            <div>
               <h4 className="text-[14px] text-neutral-300 font-medium mb-1">Transactions</h4>
               <div className="flex items-center gap-2">
                  <span className="text-[28px] font-semibold tracking-tight">54%</span>
                  <span className="text-[11px] text-[#60A5FA] bg-blue-500/10 px-2 py-0.5 rounded-full font-medium">vs last month</span>
               </div>
            </div>
         </div>
      </div>

      {/* Light Version */}
      <div className="flex flex-col gap-3 w-[280px]">
         <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100">
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-[18px] font-medium text-neutral-900 tracking-tight">Savings</h3>
               <span className="text-[#3B82F6] text-[13px] font-medium">05.24</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-[1.4] mb-6 max-w-[90%]">
               Save more every month with new features in <span className="text-[#3B82F6]">Premium version</span>
            </p>
            
            <div className="flex justify-between items-center mb-2">
               <span className="text-[13px] font-medium text-neutral-600">Progress</span>
               <Plus className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden mb-1.5 flex">
               <div className="h-full bg-[#3B82F6] w-[74%]" />
               <div className="h-full bg-blue-300 w-1 ml-0.5 rounded-full" />
            </div>
            <div className="text-right text-[11px] text-neutral-500 font-medium mb-6">
               74/100
            </div>

            <div className="flex justify-between items-center bg-white rounded-2xl p-3 mb-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-neutral-100">
               <div className="text-[16px] font-semibold tracking-tight text-neutral-900">$890.00<span className="text-neutral-400 font-medium">/$1,200</span></div>
               <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                  <ArrowUpRight className="w-4 h-4 text-neutral-600" />
               </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
               <span>Last month</span>
               <span>01 January 2024 - 2025</span>
            </div>
         </div>

         <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col justify-between">
            <div className="h-[110px] w-[calc(100%+1rem)] -ml-2 mb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={12}>
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #f5f5f5', borderRadius: '8px', color: '#000'}} itemStyle={{color: '#0EA5E9'}} labelStyle={{display: 'none'}} />
                     <Bar dataKey="value" radius={[2, 2, 2, 2]} background={{ fill: '#EFF6FF', radius: 2 }}>
                        {transactionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill="#0EA5E9" />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
               <div className="flex justify-between text-[9px] text-neutral-500 font-medium mt-2 px-3">
                  {transactionData.map(d => <span key={d.day}>{d.day}</span>)}
               </div>
            </div>
            <div>
               <h4 className="text-[14px] text-neutral-600 font-medium mb-1">Transactions</h4>
               <div className="flex items-center gap-2">
                  <span className="text-[28px] font-semibold tracking-tight text-neutral-900">54%</span>
                  <span className="text-[11px] text-[#3B82F6] bg-blue-50 px-2 py-0.5 rounded-full font-medium">vs last month</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

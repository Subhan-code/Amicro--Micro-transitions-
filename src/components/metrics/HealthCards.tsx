import { ChevronUp, Info } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const workoutData = [
  { day: 'Mon', value: 20 },
  { day: 'Tue', value: 40 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 60 },
  { day: 'Fri', value: 45 },
];

const stepData = [
  { time: 'AM', value: 1000 },
  { time: '05 AM', value: 2000 },
  { time: '06 AM', value: 1500 },
  { time: '07 AM', value: 4000 },
  { time: '08 AM', value: 5093 },
];

const hrData = Array.from({length: 40}).map((_, i) => ({
  time: i,
  value: 60 + Math.random() * 40,
  isHigh: i > 25 && i < 35
}));

export default function HealthCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto font-sans bg-neutral-100 p-8 rounded-[2rem]">
      
      {/* Column 1 */}
      <div className="flex flex-col gap-4">
         {/* Your daily goals */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-red-50 text-red-500 rounded-full text-[12px]">🎯</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Your daily goals</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-2">
               <span>Achieved</span>
               <span>4/7</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full mb-6 overflow-hidden">
               <div className="h-full bg-[#D8B4FE] w-[60%]" />
            </div>

            <div className="flex justify-between">
               {[1,2,3,4,5,6,7].map((i) => {
                  const percent = i <= 4 ? 1 : 0;
                  const dashoffset = 88 * (1 - percent);
                  return (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 rounded-full border-[3px] border-[#F3E8FF] relative flex items-center justify-center">
                        {percent > 0 && (
                           <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="14" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="88" strokeDashoffset={dashoffset} strokeLinecap="round" />
                           </svg>
                        )}
                     </div>
                     <span className="text-[11px] font-semibold text-neutral-500">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i-1]}</span>
                  </div>
               )})}
            </div>
         </div>

         {/* Period */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center text-red-500 text-[14px]">🩸</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Period</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-2">
               <span>Day of Cycle</span>
               <span>7/9hr</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full mb-6 flex">
               <div className="h-full bg-[#FECDD3] w-[80%] rounded-full" />
            </div>

            <div className="flex justify-between">
               {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={`w-6 h-6 rounded-full ${i <= 6 ? 'bg-[#FECDD3]' : 'bg-neutral-100'}`} />
                     <span className="text-[11px] font-semibold text-neutral-500">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i-1]}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Hydration */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center text-blue-400 text-[14px]">💧</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Hydration</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-2">
               <span>Today</span>
               <span>1,203/1,500cal</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full mb-6 flex overflow-hidden">
               <div className="h-full bg-[#BAE6FD] w-[80%]" />
            </div>

            <div className="flex justify-between">
               {[1,2,3,4,5,6,7].map((i) => {
                  const percent = i <= 4 ? 1 : (i === 5 ? 0.6 : 0);
                  const dashoffset = 88 * (1 - percent);
                  return (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 rounded-full border-[3px] border-[#E0F2FE] relative flex items-center justify-center">
                        {percent > 0 && (
                           <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="14" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="88" strokeDashoffset={dashoffset} strokeLinecap="round" />
                           </svg>
                        )}
                     </div>
                     <span className="text-[11px] font-semibold text-neutral-500">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i-1]}</span>
                  </div>
               )})}
            </div>
         </div>

         {/* Workout Stats */}
         <div className="bg-[#0A0A0A] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden h-[180px]">
            <div className="flex justify-between items-center mb-6 relative z-10">
               <h3 className="text-[15px] font-semibold">Workout Stats</h3>
               <Info className="w-4 h-4 text-neutral-400" />
            </div>
            
            <div className="flex justify-between text-[11px] font-medium text-neutral-400 mb-6 relative z-10 px-1">
               <span className="bg-white text-black px-3 py-1 rounded-full">Day</span>
               <span className="px-2 py-1">Week</span>
               <span className="px-2 py-1">Month</span>
               <span className="px-2 py-1">Year</span>
            </div>

            <div className="absolute bottom-8 left-0 right-0 h-[80px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workoutData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4} />
                           <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <Tooltip contentStyle={{backgroundColor: '#262626', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#A855F7'}} labelStyle={{display: 'none'}} />
                     <Area type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={3} fill="url(#workoutGrad)" activeDot={{ r: 6, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-[10px] text-neutral-500 absolute bottom-4 left-4 right-4 z-10">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
            </div>
         </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4">
         {/* Daily Average */}
         <div className="bg-[#0A0A0A] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden h-[180px]">
            <div className="flex justify-between items-start mb-2 relative z-10">
               <div className="text-[12px] font-medium text-neutral-400">Daily Average</div>
               <Info className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center gap-2 mb-6 relative z-10">
               <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-[12px]">🏃</div>
               <div className="text-[28px] font-semibold tracking-tight leading-none">5.093 <span className="text-[12px] text-neutral-500 font-medium tracking-normal">STEPS</span></div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 h-[80px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stepData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4} />
                           <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <Tooltip contentStyle={{backgroundColor: '#262626', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#A855F7'}} labelStyle={{display: 'none'}} />
                     <Area type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={3} fill="url(#stepGrad)" activeDot={{ r: 6, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-[9px] font-medium text-neutral-500 absolute bottom-3 left-4 right-4 z-10">
               <span>AM</span>
               <span>05 AM</span>
               <span>06 AM</span>
               <span>07 AM</span>
               <span>08 AM</span>
            </div>
         </div>

         {/* Sleep Quality */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center text-[14px]">🛌</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Sleep Quality</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-6">
               <span>Today</span>
               <span>6,5/8hr</span>
            </div>

            <div className="flex items-center h-10 w-full mb-2">
               <div className="h-full w-[15%] bg-[#BAE6FD]" />
               <div className="h-full w-0.5 bg-neutral-800" />
               <div className="h-[60%] w-[10%] bg-[#E0F2FE]" />
               <div className="h-[80%] w-[15%] bg-[#BAE6FD]" />
               <div className="h-full w-0.5 bg-neutral-800" />
               <div className="h-full w-[25%] bg-[#E9D5FF]" />
               <div className="h-[40%] w-[10%] bg-[#F3E8FF]" />
               <div className="h-full w-0.5 bg-neutral-800" />
               <div className="h-full w-[20%] bg-[#BAE6FD]" />
            </div>
            
            <div className="flex justify-between text-[11px] font-medium text-neutral-500">
               <span>10.00pm</span>
               <span>6.30am</span>
            </div>
         </div>

         {/* Heart Rate */}
         <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center text-[14px]">🫀</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Heart Rate</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-6">
               <span>Today</span>
               <span>72-90Bpm</span>
            </div>

            <div className="h-20 w-[calc(100%+1rem)] -ml-2 mb-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hrData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={0} barCategoryGap="20%">
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #f5f5f5', borderRadius: '8px', color: '#000'}} labelStyle={{display: 'none'}} />
                     <Bar dataKey="value" radius={[2, 2, 2, 2]}>
                        {hrData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.isHigh ? '#FDA4AF' : '#BAE6FD'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-[11px] font-medium text-neutral-500">
               <span>08.00am</span>
               <span>12.00pm</span>
               <span>4.00pm</span>
            </div>
         </div>

         {/* Your weekly target */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-500 rounded-lg text-[10px] font-bold">FEB<br/>24</div>
                  <div>
                     <h3 className="text-[14px] font-semibold text-neutral-900 leading-tight">Your weekly target</h3>
                     <div className="text-[11px] text-neutral-400 font-medium">Last 7 Day</div>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-neutral-600" />
               </div>
            </div>
            
            <div className="flex justify-between text-[13px] font-medium text-neutral-600 mb-2">
               <span>Achieved</span>
               <span>4/7</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full mb-6">
               <div className="h-full bg-[#A3E635] w-[55%] rounded-full" />
            </div>

            <div className="bg-[#ECFCCB] rounded-2xl p-4 text-[12px] font-medium text-neutral-800 leading-relaxed">
               Scoring at least <span className="font-bold">150 Heart Points</span> each week helps you stay fit and healthy.
            </div>
         </div>
      </div>
    </div>
  )
}

import { User, UserPlus, Flame, Clock } from 'lucide-react';

export default function UserMetrics() {
  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      <div className="grid grid-cols-2 bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 overflow-hidden">
        <div className="p-5 border-b border-r border-neutral-100/60">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-medium text-neutral-700">New Users</span>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 mb-1 tracking-tight">1.39K</div>
          <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
             147% <span className="text-neutral-400 font-semibold ml-0.5">VS PREV. 28 DAYS</span>
          </div>
        </div>
        <div className="p-5 border-b border-neutral-100/60">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-medium text-neutral-700">Unique Users</span>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 mb-1 tracking-tight">1.52K</div>
          <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
             53% <span className="text-neutral-400 font-semibold ml-0.5">VS PREV. 28 DAYS</span>
          </div>
        </div>
        <div className="p-5 border-r border-neutral-100/60">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-medium text-neutral-700">Week 1 Retention</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 mb-1 tracking-tight">4.53%</div>
          <div className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-wider">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
             10.7% <span className="text-neutral-400 font-semibold ml-0.5">VS PREV. 28 DAYS</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-medium text-neutral-700">Session</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 mb-1 tracking-tight">0.9 sec</div>
          <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
             29% <span className="text-neutral-400 font-semibold ml-0.5">VS PREV. 28 DAYS</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-800 mb-3">Views</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-semibold text-neutral-900 tracking-tight">12.7K</span>
              <div className="flex flex-col text-[10px] leading-tight font-bold">
                <span className="text-emerald-500 flex items-center gap-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  2.6%
                </span>
                <span className="text-neutral-400 uppercase tracking-wider mt-0.5">VS PREV. DAY</span>
              </div>
            </div>
          </div>
          <div className="flex border border-neutral-200 rounded-lg p-0.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-[11px] font-semibold text-neutral-600 bg-neutral-50/50">
             <button className="px-3.5 py-1.5 rounded-md hover:text-neutral-900">Day</button>
             <button className="px-3.5 py-1.5 rounded-md bg-white shadow-sm border border-neutral-200/60 text-neutral-900">Week</button>
             <button className="px-3.5 py-1.5 rounded-md hover:text-neutral-900">Month</button>
          </div>
        </div>

        <div className="h-44 relative w-full mt-8">
           {/* Chart Background Grid */}
           <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-dashed border-neutral-200 w-full h-0 relative">
                 <span className="absolute -right-6 -top-2 text-[10px] text-neutral-400 font-medium">2.5K</span>
              </div>
              <div className="border-b border-dashed border-orange-300 w-full h-0 relative z-10">
                 <span className="absolute -right-6 -top-2 text-[10px] font-bold text-orange-400">AVG</span>
              </div>
              <div className="border-b border-dashed border-neutral-200 w-full h-0 relative">
                 <span className="absolute -right-6 -top-2 text-[10px] text-neutral-400 font-medium">1.5K</span>
              </div>
              <div className="border-b border-neutral-200 w-full h-0 relative">
                 <span className="absolute -right-4 -top-2 text-[10px] text-neutral-400 font-medium">0</span>
              </div>
           </div>

           {/* Chart Vertical Grid */}
           <div className="absolute inset-0 flex justify-between px-10 border-l border-r border-dashed border-neutral-200 opacity-50">
             <div className="border-l border-dashed border-neutral-200 h-full"></div>
             <div className="border-l border-dashed border-neutral-200 h-full"></div>
             <div className="border-l border-dashed border-neutral-200 h-full"></div>
           </div>
           
           {/* Chart SVG */}
           <div className="absolute inset-0 right-8 bottom-0 overflow-visible">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,70 Q5,55 10,60 T20,70 T30,25 T40,45 T50,30 T60,50 T70,35 T80,85 T90,65 T100,80 L100,100 L0,100 Z" fill="url(#blueGradient)" />
                <path d="M0,70 Q5,55 10,60 T20,70 T30,25 T40,45 T50,30 T60,50 T70,35 T80,85 T90,65 T100,80" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
           </div>
           
           <div className="absolute -bottom-7 left-0 right-8 flex justify-between text-[11px] text-neutral-400 font-medium">
             <span>12 AM</span>
             <span>4 AM</span>
             <span>8 AM</span>
             <span>12 PM</span>
             <span>4 PM</span>
             <span>8 PM</span>
           </div>
        </div>
      </div>
    </div>
  );
}

import { Star } from 'lucide-react';

export default function GrowthCalendar() {
  return (
    <div className="flex flex-col md:flex-row gap-6 font-sans w-fit mx-auto items-center md:items-stretch">
       {/* Users growth card (Dark) */}
       <div className="bg-[#1C1C1C] rounded-[2rem] p-7 w-[300px] shadow-2xl flex flex-col justify-between border border-neutral-800 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 fill-white text-white" />
                <span className="text-white text-[15px] font-medium">Users growth</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
                <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-end gap-3 mb-10">
               <div className="text-indigo-300">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
               </div>
               <div className="text-[40px] font-medium text-white tracking-tight leading-none">+88.3%</div>
               <div className="text-[11px] text-neutral-400 font-medium pb-1 flex items-center gap-0.5">
                  +1.78% <span className="text-[10px]">↗</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 relative z-10">
            <div className="h-11 w-[55%] bg-white rounded-full flex items-center px-4 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
               <span className="text-[13px] font-semibold text-neutral-900 relative z-10">12.01</span>
            </div>
            <div className="h-11 w-[75%] bg-white rounded-full flex items-center px-4 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
               <span className="text-[13px] font-semibold text-neutral-900 relative z-10">13.01</span>
            </div>
            <div className="h-[52px] w-full bg-gradient-to-r from-[#A5B4FC] via-[#D8B4FE] to-[#A5B4FC] rounded-full flex items-center px-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] border border-purple-200/20">
               <span className="text-[13px] font-semibold text-neutral-900">14.01</span>
            </div>
          </div>
       </div>

       {/* Calendar card (Light) */}
       <div className="bg-[#F8F9FA] rounded-[2rem] p-7 w-[300px] shadow-2xl shadow-neutral-200/40 border border-neutral-100">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[15px] font-medium text-neutral-900">Calendar</span>
            <span className="text-[13px] font-medium text-indigo-500 cursor-pointer flex items-center gap-1.5">September 2024 <span className="text-[8px]">▼</span></span>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-[13px]">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="font-medium text-neutral-600 mb-2">{d}</div>
            ))}
            
            {/* Week 1 */}
            <div className="text-neutral-300">29</div>
            <div className="text-neutral-300">30</div>
            <div className="text-neutral-300">31</div>
            <div className="text-neutral-300">01</div>
            <div className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full mx-auto font-bold shadow-sm">02</div>
            <div className="text-neutral-300">03</div>
            <div className="text-neutral-300">04</div>

            {/* Week 2 */}
            <div className="text-neutral-300">05</div>
            <div className="text-neutral-300">06</div>
            <div className="text-neutral-900 font-bold">07</div>
            <div className="text-neutral-300">08</div>
            <div className="text-neutral-300">09</div>
            <div className="text-neutral-300">10</div>
            <div className="text-neutral-300">11</div>

            {/* Week 3 */}
            <div className="text-neutral-300">12</div>
            <div className="text-neutral-300">13</div>
            <div className="text-neutral-300">14</div>
            <div className="text-neutral-300">15</div>
            <div className="text-neutral-900 font-bold">16</div>
            <div className="text-neutral-900 font-bold">17</div>
            <div className="text-neutral-300">18</div>

            {/* Week 4 */}
            <div className="text-neutral-300">19</div>
            <div className="bg-emerald-300 text-neutral-900 w-8 h-8 flex items-center justify-center rounded-full mx-auto font-bold shadow-sm">20</div>
            <div className="text-neutral-300">21</div>
            <div className="text-neutral-300">22</div>
            <div className="text-neutral-300">23</div>
            <div className="text-neutral-300">24</div>
            <div className="text-neutral-300">25</div>

            {/* Week 5 */}
            <div className="text-neutral-300">26</div>
            <div className="text-neutral-300">27</div>
            <div className="text-neutral-300">28</div>
            <div className="text-neutral-300">29</div>
            <div className="text-neutral-300">30</div>
            <div className="text-neutral-300">31</div>
            <div className="text-neutral-300">31</div>
          </div>
       </div>
    </div>
  )
}

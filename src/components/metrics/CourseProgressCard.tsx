import { Book, BarChart2 } from 'lucide-react';

export default function CourseProgressCard() {
  return (
    <div className="flex flex-col gap-4 max-w-[340px] w-full mx-auto font-sans">
       {/* Course Progress */}
       <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-[15px]">
               <Book className="w-5 h-5 text-neutral-700" /> Course Progress
            </div>
            <button className="px-3 py-1.5 rounded-xl border border-neutral-200 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 shadow-sm">
               See All
            </button>
         </div>

         <div className="h-px w-full bg-neutral-100 mb-5" />

         <div className="flex gap-5 items-center">
            <div className="relative w-16 h-16 flex-shrink-0">
               <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5B32EA"
                    strokeWidth="4"
                    strokeDasharray="25, 100"
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-neutral-900">
                 25%
               </div>
            </div>
            <div>
               <h3 className="text-[15px] font-semibold text-neutral-900 mb-1 leading-tight">Team Diversity Training</h3>
               <p className="text-[12px] text-neutral-500 leading-[1.4] mb-2">
                 Designed to foster inclusivity and leverage diverse perspectives.
               </p>
               <a href="#" className="text-[12px] font-semibold text-[#5B32EA] underline decoration-[#5B32EA]/40 underline-offset-2">Resume Course</a>
            </div>
         </div>
       </div>

       {/* Training Analysis */}
       <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-[15px]">
               <BarChart2 className="w-5 h-5 text-neutral-700" /> Training Analysis
            </div>
            <button className="px-3 py-1.5 rounded-xl border border-neutral-200 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 shadow-sm">
               Details
            </button>
         </div>

         <div className="h-px w-full bg-neutral-100 mb-5" />

         <div className="flex justify-between items-end">
            <div className="pb-1">
               <div className="text-[20px] font-semibold text-neutral-900 leading-none mb-1.5">12 courses</div>
               <div className="text-[12px] text-neutral-500 mb-4">Completed in this quarter</div>
               
               <div className="flex items-center gap-3 text-[12px] font-medium text-neutral-600">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full border-2 border-white bg-purple-100 z-30 flex items-center justify-center overflow-hidden"><span className="text-xs">👩🏽</span></div>
                     <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 z-20 flex items-center justify-center overflow-hidden"><span className="text-xs">👩🏻‍🦰</span></div>
                     <div className="w-6 h-6 rounded-full border-2 border-white bg-orange-100 z-10 flex items-center justify-center overflow-hidden"><span className="text-xs">👨🏼‍💼</span></div>
                  </div>
                  26 Attended
               </div>
            </div>

            <div className="flex items-end gap-1.5 h-16 w-32">
               <div className="w-full bg-[#D8B4FE] h-[40%] rounded-sm" />
               <div className="w-full bg-[#6D28D9] h-[80%] rounded-sm" />
               <div className="w-full bg-[#6D28D9] h-[60%] rounded-sm" />
               <div className="w-full bg-[#8B5CF6] h-[55%] rounded-sm" />
               <div className="w-full bg-[#D8B4FE] h-[45%] rounded-sm" />
               <div className="w-full bg-[#6D28D9] h-[95%] rounded-sm" />
               <div className="w-full bg-[#D8B4FE] h-[35%] rounded-sm" />
            </div>
         </div>
       </div>
    </div>
  )
}

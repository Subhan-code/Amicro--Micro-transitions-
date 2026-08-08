import { Send, MoreHorizontal } from 'lucide-react';

export default function FeedbackCard() {
  return (
    <div className="w-full max-w-[320px] mt-8">
       {/* Window UI */}
       <div className="bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 mb-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-[11px] font-medium text-neutral-600 border border-neutral-100 shadow-sm z-10 whitespace-nowrap">
            Ads Feedback
          </div>
          
          <div className="p-4 pt-6 border-b border-neutral-50/50">
             <div className="flex gap-1.5 mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
             </div>
             
             {/* Skeleton content */}
             <div className="flex flex-col gap-2.5 mb-6">
                <div className="w-3/4 h-2 bg-neutral-100 rounded-full" />
                <div className="w-full flex gap-2">
                  <div className="flex-1 h-3.5 bg-blue-500 rounded-full" />
                  <div className="w-12 h-2 bg-neutral-100 rounded-full mt-0.5" />
                </div>
                <div className="w-1/2 h-2 bg-neutral-100 rounded-full" />
             </div>

             {/* Input Area */}
             <div className="flex gap-2 relative mt-4">
                <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                   <div className="text-sm">👨🏻‍💼</div>
                </div>
                <div className="flex-1 bg-white border border-neutral-200 rounded-full pl-3 pr-1 py-1 flex items-center justify-between shadow-sm">
                   <span className="text-[11px] text-neutral-800">Make it professional <span className="text-blue-500 font-medium">@Arthur</span></span>
                   <button className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Send className="w-3 h-3 ml-0.5" />
                   </button>
                </div>

                <div className="absolute -right-8 top-5 bg-blue-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full rounded-tl-none shadow-sm shadow-blue-500/20">
                   Jack
                </div>
             </div>
          </div>
       </div>

       {/* Comment Reply */}
       <div className="bg-white rounded-xl p-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 relative ml-8">
          <div className="flex justify-between items-start mb-1.5">
             <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                 <div className="text-sm">👨🏽‍💼</div>
               </div>
               <div>
                 <span className="text-xs font-semibold text-neutral-900">Arthur T.</span>
                 <span className="text-[10px] text-neutral-400 font-medium ml-1.5">5 min ago</span>
               </div>
             </div>
             <MoreHorizontal className="w-4 h-4 text-neutral-400" />
          </div>
          
          <p className="text-[11px] text-neutral-800 mb-2.5 pl-9">
            Okay Jack, I'll need one day to rework it.
          </p>

          <div className="flex gap-1.5 pl-9">
            <div className="h-1.5 w-8 bg-purple-500 rounded-full" />
            <div className="h-1.5 w-24 bg-purple-500 rounded-full" />
          </div>

          <div className="absolute -left-4 -bottom-4 bg-purple-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full rounded-tr-none shadow-sm shadow-purple-500/20">
             Arthur
          </div>
       </div>
    </div>
  )
}

import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Area1({ 
  trigger = "hover", 
  loop = true,
  theme = "dark",
  className = ""
}: { 
  trigger?: "hover" | "click";
  loop?: boolean;
  theme?: "dark" | "light";
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2200);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div 
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      } ${className}`}
      onMouseEnter={trigger === "hover" ? () => setHoverKey(k => k + 1) : undefined}
      onClick={trigger === "click" ? () => setHoverKey(k => k + 1) : undefined}
    >
      <style>{`
        @keyframes cloth_open {
          0% { height: 10px; }
          60% { height: 75px; }
          100% { height: 70px; }
        }
        @keyframes cloth_close {
          0% { height: 70px; }
          60% { height: 7px; }
          100% { height: 10px; }
        }
        .cloth-anim {
          animation: cloth_open 0.6s ease-in-out 0.2s both, cloth_close 0.6s ease-in-out 1.4s forwards;
        }
      `}</style>
      <div className="absolute inset-0 flex justify-center items-center area1-scene">
        <div key={activeKey} className="absolute left-0 w-full flex justify-center items-center flex-col top-1/2 -translate-y-[15px]">
          <div className="absolute top-[-26px] left-1/2 -translate-x-1/2 w-[14px] h-[14px]">
            <div className={`absolute top-[4px] right-1/2 w-[50px] h-[4px] origin-right -rotate-[30deg] ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-300'}`} />
            <div className={`absolute top-[4px] left-1/2 w-[50px] h-[4px] origin-left rotate-[30deg] ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-300'}`} />
            <div className="absolute inset-0 rounded-full bg-blue-500" />
          </div>
          <div className={`w-[95px] h-[9px] rounded-full ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-300'}`} />
          <div className={`w-[85px] cloth-anim ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`} />
          <div className={`w-[95px] h-[9px] rounded-full ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-300'}`} />
        </div>
      </div>
    </div>
  );
}

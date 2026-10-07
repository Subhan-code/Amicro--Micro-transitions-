import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Area6({ 
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
  const loopFlg = useLoopFlg(true, 1400);
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
        @keyframes bar_stretch {
          0% { width: 50px; height: 32px; }
          100% { width: 110px; height: 28px; }
        }
        @keyframes bar_shrink {
          0% { width: 110px; height: 28px; }
          50% { width: 34px; height: 36px; }
          75% { width: 60px; height: 30px; }
          100% { width: 50px; height: 32px; }
        }
        .bar-anim {
          animation: bar_stretch 0.35s ease-in-out 0.2s both, bar_shrink 0.65s ease-in-out 0.55s forwards;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center area6-scene">
        <div 
          key={activeKey} 
          className={`rounded-full bar-anim ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} 
        />
      </div>
    </div>
  );
}

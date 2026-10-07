import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Kakikaki({ 
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
  const loopFlg = useLoopFlg(true, 3000);
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
        @keyframes kakikaki-draw {
          0% {
            stroke-dashoffset: 1200;
          }
          60% {
            stroke-dashoffset: 0;
          }
          80%, 100% {
            stroke-dashoffset: -1200;
          }
        }
        .kakikaki-path {
          stroke-dasharray: 1200;
          animation: kakikaki-draw 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[150px] h-[100px] flex items-center justify-center">
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full"
          fill="none"
          stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline
            className="kakikaki-path"
            points="20,100 40,20 80,100 100,40 140,90 170,30 190,70"
          />
        </svg>
      </div>
    </div>
  );
}

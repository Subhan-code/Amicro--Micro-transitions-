import React, { useEffect, useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Tsumiki({ 
  trigger = "hover", 
  loop = true, 
  theme = "dark",
  onCovered,
  className = ""
}: { 
  trigger?: "hover" | "click";
  loop?: boolean;
  theme?: "dark" | "light";
  onCovered?: () => void;
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  useEffect(() => {
    if (onCovered) {
      const timeout = setTimeout(() => {
        onCovered();
      }, 1400);
      return () => clearTimeout(timeout);
    }
  }, [activeKey, onCovered]);

  return (
    <div 
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      } ${className}`}
      onMouseEnter={trigger === "hover" ? () => setHoverKey(k => k + 1) : undefined}
      onClick={trigger === "click" ? () => setHoverKey(k => k + 1) : undefined}
    >
      <style>{`
        @keyframes tsumiki_bounce_right {
          0% { transform: translateY(-300%) rotate(30deg); opacity: 0; }
          20% { opacity: 1; }
          60% { transform: translateY(0%) rotate(-4deg); opacity: 1; }
          70% { transform: translateY(-10%) rotate(2deg); opacity: 1; }
          80% { transform: translateY(0%) rotate(0deg); opacity: 1; }
          90% { transform: translateY(-5%) rotate(-1deg); opacity: 1; }
          100% { transform: translateY(0%) rotate(0deg); opacity: 1; }
        }
        @keyframes tsumiki_bounce_left {
          0% { transform: translateY(-300%) rotate(-30deg); opacity: 0; }
          20% { opacity: 1; }
          60% { transform: translateY(0%) rotate(4deg); opacity: 1; }
          70% { transform: translateY(-10%) rotate(-2deg); opacity: 1; }
          80% { transform: translateY(0%) rotate(0deg); opacity: 1; }
          90% { transform: translateY(-5%) rotate(1deg); opacity: 1; }
          100% { transform: translateY(0%) rotate(0deg); opacity: 1; }
        }
        @keyframes tsumiki_fall_right {
          0% { transform: translateY(0%) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(400%) rotate(20deg); opacity: 0; }
        }
        @keyframes tsumiki_fall_left {
          0% { transform: translateY(0%) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(400%) rotate(-20deg); opacity: 0; }
        }

        .bar-0 { animation: tsumiki_bounce_right 0.8s ease-in-out 0.6s both, tsumiki_fall_right 0.5s cubic-bezier(0.74, 0.03, 1, 1) 2.0s forwards; }
        .bar-1 { animation: tsumiki_bounce_left 0.8s ease-in-out 0.45s both, tsumiki_fall_left 0.5s cubic-bezier(0.74, 0.03, 1, 1) 1.85s forwards; }
        .bar-2 { animation: tsumiki_bounce_right 0.8s ease-in-out 0.3s both, tsumiki_fall_right 0.5s cubic-bezier(0.74, 0.03, 1, 1) 1.7s forwards; }
        .bar-3 { animation: tsumiki_bounce_left 0.8s ease-in-out 0.15s both, tsumiki_fall_left 0.5s cubic-bezier(0.74, 0.03, 1, 1) 1.55s forwards; }
        .bar-4 { animation: tsumiki_bounce_right 0.8s ease-in-out 0s both, tsumiki_fall_right 0.5s cubic-bezier(0.74, 0.03, 1, 1) 1.4s forwards; }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center tsumiki-scene">
        <div key={activeKey} className="absolute left-1/2 -translate-x-1/2 w-[70px] top-1/2 -translate-y-1/2 h-[75%]">
          <div className="absolute top-[0%] left-0 w-full h-[18%] rounded-[14px] opacity-0 bar-0 bg-blue-400" />
          <div className="absolute top-[20%] left-0 w-full h-[18%] rounded-[14px] opacity-0 bar-1 bg-blue-500" />
          <div className="absolute top-[40%] left-0 w-full h-[18%] rounded-[14px] opacity-0 bar-2 bg-blue-600" />
          <div className="absolute top-[60%] left-0 w-full h-[18%] rounded-[14px] opacity-0 bar-3 bg-blue-700" />
          <div className="absolute top-[80%] left-0 w-full h-[18%] rounded-[14px] opacity-0 bar-4 bg-blue-800" />
        </div>
      </div>
    </div>
  );
}

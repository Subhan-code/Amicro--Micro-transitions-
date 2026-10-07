import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Tissue({ 
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
        .tissue-wrapper {
          transform: scale(0.85);
          display: grid;
          place-content: center;
        }
        .tissue-box {
          position: relative;
          width: 140px;
          height: 55px;
        }
        .tissue-box::before,
        .tissue-box::after {
          content: "";
          position: absolute;
          z-index: 1;
        }
        .tissue-box::before {
          inset: 0;
          background-color: ${theme === 'dark' ? '#1e293b' : '#ffffff'};
          border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'};
          border-radius: 18px 18px 8px 8px;
        }
        .tissue-box::after {
          bottom: 0;
          left: 0;
          width: 100%;
          height: 48%;
          background-color: ${theme === 'dark' ? '#0f172a' : '#f1f5f9'};
          border-radius: 0 0 8px 8px;
        }
        .tissue-paper1,
        .tissue-paper2 {
          position: absolute;
          bottom: 99%;
          left: 50%;
          width: 70%;
          height: 55%;
          transform: translate(-50%, 0);
          transform-origin: center bottom;
          background-color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%);
        }
        .tissue-paper1 {
          animation: tissue-pull 3s ease-in-out infinite both;
        }
        .tissue-paper2 {
          animation: tissue-push 3s ease-in-out infinite both;
        }
        @keyframes tissue-pull {
          0% {
            transform: translate(-50%, 0) scale(1, 1);
          }
          15% {
            transform: translate(-50%, -20%) scale(0.9, 1.2);
          }
          30%, 100% {
            transform: translate(-50%, -150%) scale(0.8, 1);
            opacity: 0;
          }
        }
        @keyframes tissue-push {
          0%, 25% {
            transform: translate(-50%, 40%) scale(0.6, 0.4);
            opacity: 0;
          }
          45% {
            transform: translate(-50%, -10%) scale(1.05, 1.15);
            opacity: 1;
          }
          60%, 100% {
            transform: translate(-50%, 0) scale(1, 1);
            opacity: 1;
          }
        }
      `}</style>
      <div key={activeKey} className="tissue-wrapper">
        <div className="tissue-box">
          <div className="tissue-paper1" />
          <div className="tissue-paper2" />
        </div>
      </div>
    </div>
  );
}

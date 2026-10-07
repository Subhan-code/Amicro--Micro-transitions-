import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Curtain({ 
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
  const loopFlg = useLoopFlg(true, 3200);
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
        .curtain-wrapper {
          position: absolute;
          inset: 0;
          transform: scale(0.85);
          display: grid;
          place-content: center;
        }
        .curtain-clothes {
          position: absolute;
          inset: 0;
        }
        .curtain-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 90%;
        }
        .curtain-line::before {
          content: "";
          display: block;
          position: absolute;
          inset: 0;
          background-color: ${theme === 'dark' ? '#262626' : '#e5e7eb'};
          animation: curtain-line-anim 3.2s ease-in-out 0s infinite both;
        }
        @keyframes curtain-line-anim {
          0%, 6.67% { transform: translateY(0); }
          33.33%, 53.33% { transform: translateY(-160px); }
          80%, 100% { transform: translateY(0); }
        }
        .curtain-cloth {
          position: absolute;
          top: 0;
          width: calc(50% - 2px);
          height: 100%;
        }
        .curtain-cloth::before {
          content: "";
          display: block;
          position: absolute;
          inset: 0;
          background-color: ${theme === 'dark' ? '#1e3a8a' : '#3b82f6'};
          animation: curtain-cloth-anim 3.2s ease-in-out 0s infinite both;
        }
        .curtain-cloth--left { left: 0; }
        .curtain-cloth--right { right: 0; transform: scaleX(-1); }
        @keyframes curtain-cloth-anim {
          0%, 6.67% { border-radius: 0 0 0 0; }
          40%, 53.33% { border-radius: 0 0 85% 0; }
          86.67%, 100% { border-radius: 0 0 0 0; }
        }
        .curtain-zipper-wrapper {
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, -80%);
          width: 22px;
          height: 28px;
          background-color: ${theme === 'dark' ? '#2563eb' : '#1d4ed8'};
          border-radius: 6px;
          border: 3px solid ${theme === 'dark' ? '#0f172a' : '#ffffff'};
          animation: curtain-zipper-up 3.2s ease-in-out 0s infinite both;
        }
        @keyframes curtain-zipper-up {
          0%, 6.67% { bottom: 0; }
          33.33%, 53.33% { bottom: 160px; }
          80%, 100% { bottom: 0; }
        }
        .curtain-zipper {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform-origin: center 8px;
          transform: translate(-50%, 70%);
          width: 18px;
          height: 36px;
          background-color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          border: 3px solid ${theme === 'dark' ? '#0f172a' : '#ffffff'};
          border-radius: 7px;
          animation: curtain-zipper-rotate 3.2s ease-in-out 0s infinite both;
        }
        .curtain-zipper::before,
        .curtain-zipper::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
        }
        .curtain-zipper::before {
          width: 8px;
          height: 8px;
          background-color: ${theme === 'dark' ? '#0f172a' : '#ffffff'};
        }
        .curtain-zipper::after {
          width: 4px;
          height: 4px;
          background-color: ${theme === 'dark' ? '#131313' : '#f4f4f6'};
        }
        @keyframes curtain-zipper-rotate {
          0%, 6.67% { transform: translate(-50%, 70%) rotate(0deg); }
          13.33% { transform: translate(-50%, 70%) rotate(8deg); }
          20% { transform: translate(-50%, 70%) rotate(-6deg); }
          26.67% { transform: translate(-50%, 70%) rotate(4deg); }
          33.33%, 53.33% { transform: translate(-50%, 70%) rotate(0deg); }
          60% { transform: translate(-50%, 70%) rotate(8deg); }
          66.67% { transform: translate(-50%, 70%) rotate(-6deg); }
          73.33% { transform: translate(-50%, 70%) rotate(4deg); }
          80%, 100% { transform: translate(-50%, 70%) rotate(0deg); }
        }
      `}</style>
      <div key={activeKey} className="curtain-wrapper w-[160px] h-[190px]">
        <div className="curtain-clothes">
          <div className="curtain-cloth curtain-cloth--left" />
          <div className="curtain-cloth curtain-cloth--right" />
        </div>
        <div className="curtain-line" />
        <div className="curtain-zipper-wrapper">
          <div className="curtain-zipper" />
        </div>
      </div>
    </div>
  );
}

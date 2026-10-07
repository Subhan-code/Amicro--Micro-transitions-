import React, { useState } from "react";
import useLoopFlg from "../../../hooks/useLoopFlg";

export function Bookmark({ 
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
  const loopFlg = useLoopFlg(true, 3600);
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
        .bookmark-box {
          --bg: ${theme === 'dark' ? '#1c1c1c' : '#ffffff'};
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          aspect-ratio: 1;
          background-color: var(--bg);
          border-radius: 20px;
          border: 1px solid ${theme === 'dark' ? '#2e2e2e' : '#e5e7eb'};
          overflow: hidden;
        }
        .bookmark-scene {
          position: absolute;
          inset: 0;
        }
        @keyframes bookmark-scale {
          from { transform: scale(0); }
          to { transform: scale(1.3); }
        }
        .bookmark-scene__bg {
          position: absolute;
          inset: 0;
          background-color: ${theme === 'dark' ? '#262626' : '#eff6ff'};
          border-radius: 50%;
          animation: bookmark-scale 0.8s cubic-bezier(0.7, 0.01, 0.23, 1) 0.4s both;
        }
        .bookmark-scene__bg--alt {
          background-color: ${theme === 'dark' ? '#1f1f1f' : '#f8f9fa'};
          animation-delay: 2.6s;
        }
        .bookmark-marks {
          --s: 66px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0%);
          width: var(--s);
          height: var(--s);
        }
        .bookmark-marks__inner,
        .bookmark-marks__main {
          position: absolute;
          inset: 0;
        }
        .bookmark-marks__main {
          animation: bookmark-up 0.55s cubic-bezier(0.75, 0.01, 0.24, 0.98) 2.6s both;
        }
        .bookmark-mark {
          --c: #3b82f6;
          position: absolute;
          top: 0;
          left: 17.5%;
          width: 65%;
          height: 100%;
          background-color: var(--c);
          clip-path: polygon(0 -100%, 100% -100%, 100% 100%, 50% 80%, 0 100%);
        }
        .bookmark-mark::after {
          content: "";
          position: absolute;
          inset: 0;
          background-color: var(--c);
          transform: translateY(-99%);
        }
        @keyframes bookmark-up {
          from { transform: translateY(0); }
          50% { transform: translateY(22%); }
          to { transform: translateY(-101%); }
        }
        @keyframes bookmark-reset {
          from { transform: translateY(-101%); }
          to { transform: translateY(0%); }
        }
        @keyframes bookmark-color {
          from { background-color: #2563eb; }
          to { background-color: #3b82f6; }
        }
        @keyframes bookmark-down {
          from {
            transform: perspective(700px) translateY(-40%) rotateX(80deg) rotateY(var(--z)) scale(1.5, 1.15);
          }
          to {
            transform: perspective(700px) translateY(0) rotateX(0deg) rotateY(0) scale(1);
          }
        }
        .bookmark-mark--1 {
          --c: #1d4ed8;
          animation:
            bookmark-up 0.55s cubic-bezier(0.75, 0.01, 0.24, 0.98) 0s both,
            bookmark-reset 0.01s ease-out 1s forwards,
            bookmark-color 1s linear 2.6s forwards;
        }
        .bookmark-mark--2 {
          --c: #60a5fa;
          --z: 20deg;
          top: 0%;
          transform-origin: top center;
          animation: bookmark-down 0.7s cubic-bezier(0.7, 0.01, 0.23, 1) 0.35s both;
        }
        .bookmark-mark--3 {
          --c: #3b82f6;
          --z: 12deg;
          top: 0%;
          transform-origin: top center;
          animation: bookmark-down 0.7s cubic-bezier(0.7, 0.01, 0.23, 1) 0.5s both;
        }
        .bookmark-mark--4 {
          --c: #2563eb;
          --z: 0deg;
          transform-origin: top center;
          animation: bookmark-down 0.7s cubic-bezier(0.7, 0.01, 0.23, 1) 0.65s both;
        }
        @keyframes bookmark-kira {
          from, to { transform: scale(0); }
          50% { transform: scale(1); }
        }
        .bookmark-kira {
          --s: 26px;
          position: absolute;
          width: var(--s);
          height: var(--s);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M16 0C17.2 11.5 20.5 14.8 32 16C20.5 17.2 17.2 20.5 16 32C14.8 20.5 11.5 17.2 0 16C11.5 14.8 14.8 11.5 16 0Z' fill='%2360a5fa'/%3E%3C/svg%3E");
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          animation: bookmark-kira 0.6s ease-in-out var(--delay, 0s) both;
        }
        .bookmark-kira--1 { --delay: 0.8s; top: 17%; left: 2%; }
        .bookmark-kira--2 { --delay: 1s; top: 48%; right: 2%; }
        .bookmark-kira--3 { --delay: 1.2s; top: 62%; left: 10%; }
        .bookmark-kira--4 { --delay: 1.4s; top: 6%; right: 6%; }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center bookmark-scene-wrapper">
        <div key={activeKey} className="bookmark-box">
          <div className="bookmark-scene">
            <div className="bookmark-scene__bg"></div>
            <div className="bookmark-scene__bg bookmark-scene__bg--alt"></div>

            <div className="bookmark-marks">
              <div className="bookmark-marks__inner">
                <div className="bookmark-mark bookmark-mark--1"></div>
                <div className="bookmark-marks__main">
                  <div className="bookmark-mark bookmark-mark--2"></div>
                  <div className="bookmark-mark bookmark-mark--3"></div>
                  <div className="bookmark-mark bookmark-mark--4"></div>
                </div>
              </div>
            </div>

            <div className="bookmark-kira bookmark-kira--1"></div>
            <div className="bookmark-kira bookmark-kira--2"></div>
            <div className="bookmark-kira bookmark-kira--3"></div>
            <div className="bookmark-kira bookmark-kira--4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

export function KineticTensionCapsule({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 2800);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes tension_pill_stretch {
          0%, 100% {
            width: 52px;
            height: 36px;
            border-radius: 18px;
            transform: scaleX(1) scaleY(1);
          }
          30% {
            width: 108px;
            height: 24px;
            border-radius: 12px;
            transform: scaleX(1.1) scaleY(0.85);
          }
          55% {
            width: 38px;
            height: 42px;
            border-radius: 19px;
            transform: scaleX(0.9) scaleY(1.12);
          }
          75% {
            width: 56px;
            height: 34px;
            border-radius: 17px;
            transform: scaleX(1.03) scaleY(0.97);
          }
          88% {
            width: 52px;
            height: 36px;
            border-radius: 18px;
            transform: scaleX(1) scaleY(1);
          }
        }
        @keyframes inner_nodes_separate {
          0%, 100% { gap: 6px; }
          30% { gap: 54px; }
          55% { gap: 2px; }
          75% { gap: 10px; }
          88% { gap: 6px; }
        }
        .tension-capsule-body {
          animation: tension_pill_stretch 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
        .tension-inner-nodes {
          animation: inner_nodes_separate 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[75px] flex items-center justify-center">
        {/* Elastic Morphing Solid Capsule */}
        <div className="tension-capsule-body bg-blue-600 shadow-md flex items-center justify-center px-2">
          {/* Inner Magnetic Tension Indicator Nodes */}
          <div className="tension-inner-nodes flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm shrink-0" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-300 shadow-sm shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

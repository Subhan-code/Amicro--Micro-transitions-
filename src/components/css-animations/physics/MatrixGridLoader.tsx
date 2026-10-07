import React from 'react';

export function MatrixGridLoader({
  theme = 'dark',
  className = '',
}: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        .blue-matrix-loader {
          --color-blue-400: #60a5fa;
          --color-blue-500: #3b82f6;
          --color-blue-600: #2563eb;
          --color-blue-700: #1d4ed8;
          display: block;
          justify-content: center;
          align-items: center;
          transform: rotate(0deg);
        }

        .blue-matrix-loader .form1,
        .blue-matrix-loader .form2 {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .blue-matrix-square {
          width: 42px;
          height: 42px;
          margin: 3px;
          background-color: ${theme === 'dark' ? '#262626' : '#e5e7eb'};
          border-radius: 8px;
          animation: blue-matrix-blinking 0.8s ease-in-out infinite;
          opacity: 0;
        }

        @keyframes blue-matrix-blinking {
          0% {
            opacity: 0.25;
            background-color: var(--color-blue-700);
          }
          50% {
            opacity: 0.55;
            background-color: var(--color-blue-600);
          }
          75% {
            opacity: 0.8;
            background-color: var(--color-blue-500);
          }
          100% {
            opacity: 1;
            background-color: var(--color-blue-400);
          }
        }

        .blue-matrix-loader .form1 .blue-matrix-square:nth-child(1) {
          animation-delay: 0.2s;
        }

        .blue-matrix-loader .form1 .blue-matrix-square:nth-child(2) {
          animation-delay: 0.4s;
        }

        .blue-matrix-loader .form2 .blue-matrix-square:nth-child(2) {
          animation-delay: 0.6s;
        }

        .blue-matrix-loader .form2 .blue-matrix-square:nth-child(1) {
          animation-delay: 0.8s;
        }
      `}</style>
      <div className="blue-matrix-loader select-none">
        <div className="form1">
          <div className="blue-matrix-square" />
          <div className="blue-matrix-square" />
        </div>
        <div className="form2">
          <div className="blue-matrix-square" />
          <div className="blue-matrix-square" />
        </div>
      </div>
    </div>
  );
}

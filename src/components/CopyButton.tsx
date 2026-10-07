import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export interface CopyButtonProps {
  text: string | (() => string);
  className?: string;
  iconClassName?: string;
  label?: string;
  copiedLabel?: string;
  children?: React.ReactNode;
  onCopySuccess?: (text: string) => void;
  resetDelay?: number;
}

export function CopyButton({
  text,
  className = '',
  iconClassName = 'size-3.5',
  label,
  copiedLabel,
  onCopySuccess,
  resetDelay = 1500,
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopySuccess,
    resetDelay,
  });

  const isCopied = state === 'done';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      className={`group/copy inline-flex shrink-0 items-center justify-center transition-all duration-150 active:scale-[0.96] outline-none cursor-pointer ${
        isCopied ? 'scale-[1.03]' : ''
      } ${className}`}
      aria-label={label || 'Copy to clipboard'}
    >
      <span
        className={`inline-flex items-center gap-1.5 transition-all duration-150 ${
          isCopied ? 'text-white' : ''
        }`}
      >
        {isCopied ? (
          <Check className={`${iconClassName} text-white transition-transform duration-150 scale-105`} />
        ) : (
          <Copy className={`${iconClassName} transition-transform duration-150 group-hover/copy:scale-105`} />
        )}
        {(label || copiedLabel) && (
          <span className="text-xs font-medium">
            {isCopied ? (copiedLabel || 'Copied') : label}
          </span>
        )}
      </span>
    </button>
  );
}

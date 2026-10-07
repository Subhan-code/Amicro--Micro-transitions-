import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';

interface SponsorSuccessModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  sponsorshipId?: string | null;
  paymentId?: string | null;
  isSimulated?: boolean;
  onClose: () => void;
  onActivationSuccess?: (sponsorship: any) => void;
}

type VerificationStatus = 'checking' | 'active' | 'pending' | 'failed';

export function SponsorSuccessModal({
  theme,
  isOpen,
  sponsorshipId,
  paymentId,
  isSimulated,
  onClose,
  onActivationSuccess,
}: SponsorSuccessModalProps) {
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  const [status, setStatus] = useState<VerificationStatus>('checking');
  const [details, setDetails] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkStatus = async () => {
    try {
      const queryParam = sponsorshipId
        ? `sponsorship_id=${encodeURIComponent(sponsorshipId)}`
        : `payment_id=${encodeURIComponent(paymentId || '')}`;
      const simulatedParam = isSimulated ? '&simulated=true' : '';

      const res = await fetch(`/api/checkout-status?${queryParam}${simulatedParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ACTIVE' && data.payment_success) {
          setStatus('active');
          setDetails(data);
          triggerHaptic('success');
          onActivationSuccess?.(data);
          return true;
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          triggerHaptic('error');
          return true;
        }
      }
    } catch (err) {
      console.warn('Error verifying checkout status:', err);
    }
    return false;
  };

  useEffect(() => {
    if (!isOpen || (!sponsorshipId && !paymentId)) return;

    setStatus('checking');
    setPollCount(0);

    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 10; // Poll for ~15 seconds

    const poll = async () => {
      const isComplete = await checkStatus();
      if (!isComplete && isMounted) {
        attempts += 1;
        setPollCount(attempts);
        if (attempts < maxAttempts) {
          pollTimerRef.current = setTimeout(poll, 1500);
        } else {
          setStatus('pending');
        }
      }
    };

    poll();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [isOpen, sponsorshipId, paymentId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className={`relative w-full max-w-[480px] rounded-3xl border p-6 sm:p-7 text-center shadow-2xl overflow-hidden select-none ${
            isDark
              ? 'bg-[#121214] border-white/[0.12] text-white'
              : 'bg-white border-zinc-200 text-zinc-950'
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {status === 'checking' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="size-12 rounded-2xl bg-zinc-800/50 border border-white/10 flex items-center justify-center mb-4">
                <RefreshCw className="size-6 text-zinc-400 animate-spin" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Confirming payment...</h3>
              <p className={`text-xs sm:text-sm mt-1.5 max-w-[280px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Verifying your transaction with Dodo Payments server-side.
              </p>
            </div>
          )}

          {status === 'active' && (
            <div className="py-2 flex flex-col items-center justify-center">
              {/* Green Spring Checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-500 shadow-sm"
              >
                <Check className="size-7 stroke-[2.5]" />
              </motion.div>

              <h3 className="text-2xl font-bold tracking-tight">
                Your sponsorship is live.
              </h3>

              <p className={`text-sm mt-1.5 leading-relaxed max-w-[340px] ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Your ad has been successfully activated across Amicro.
              </p>

              {/* Sponsor Card Preview Badge */}
              {details && (
                <div
                  className={`w-full mt-5 p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                    isDark
                      ? 'bg-zinc-950/70 border-white/10 text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold truncate">
                        {details.companyName || 'Sponsor'}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        Active
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {details.description || 'Live placement on Amicro'}
                    </p>
                  </div>

                  {details.siteUrl && (
                    <a
                      href={details.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-mono flex items-center gap-1 shrink-0 no-underline ${
                        isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      <span>Visit</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  onClose();
                  // Smoothly scroll to the sponsor section or placement
                  const elem = document.getElementById('sponsors') || document.getElementById('sponsorship-tiers');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold text-sm tracking-tight transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-md'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm'
                }`}
              >
                View Your Live Placement
              </button>
            </div>
          )}

          {status === 'pending' && (
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-500">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Payment Processing</h3>
              <p className={`text-xs sm:text-sm mt-1.5 max-w-[320px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Your payment was received and the confirmation webhook is finalizing. Your ad will appear shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  checkStatus();
                }}
                className={`mt-5 py-2.5 px-5 rounded-xl text-xs font-semibold tracking-tight border cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 border-white/10 hover:border-white/25 text-white'
                    : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400 text-black'
                }`}
              >
                Refresh Status
              </button>
            </div>
          )}

          {status === 'failed' && (
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3 text-rose-500">
                <X className="size-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Payment Incomplete</h3>
              <p className={`text-xs sm:text-sm mt-1.5 max-w-[320px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Payment was not completed. Your slot reservation has not been charged.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className={`mt-5 py-2.5 px-5 rounded-xl text-xs font-semibold tracking-tight cursor-pointer ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

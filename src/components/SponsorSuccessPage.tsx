import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Upload,
  ArrowLeft,
  RotateCcw,
  Clock,
  Trash2,
  Mail,
} from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';

interface SponsorSuccessPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  onNavigateSponsors: () => void;
  showToast?: (message: string) => void;
}

interface VerificationResult {
  valid: boolean;
  alreadySubmitted?: boolean;
  paymentNotCompleted?: boolean;
  checkoutId?: string;
  sponsorshipId?: string;
  tier?: string;
  status?: string;
  paymentStatus?: string;
  name?: string;
  company?: string;
  website?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  customerEmail?: string;
  customerName?: string;
  error?: string;
}

export function SponsorSuccessPage({
  theme,
  onNavigateHome,
  onNavigateSponsors,
  showToast,
}: SponsorSuccessPageProps) {
  const isDark = theme === 'dark';
  const { trigger: triggerHaptic } = useWebHaptics();

  const [checkoutId, setCheckoutId] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paymentNotCompleted, setPaymentNotCompleted] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [twitterUrl, setTwitterUrl] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');

  // Form status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    company: string;
    website: string;
    email: string;
    logoUrl: string;
    description: string;
    twitterUrl?: string;
    githubUrl?: string;
    status: string;
    tier: string;
  } | null>(null);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 1. Verify checkout server-side
  const verifyCheckout = async (id: string) => {
    setVerifying(true);
    setErrorMessage('');
    setPaymentNotCompleted(false);
    setSubmitError('');

    try {
      const res = await fetch(`/api/sponsor/verify?checkout_id=${encodeURIComponent(id)}`);
      const data: VerificationResult = await res.json();

      if (res.ok && data.valid) {
        setVerificationResult(data);

        // If already submitted, show submitted state immediately
        if (data.alreadySubmitted) {
          setSubmittedData({
            name: data.name || '',
            company: data.company || '',
            website: data.website || '',
            email: data.email || '',
            logoUrl: data.logoUrl || '',
            description: data.description || '',
            twitterUrl: data.twitterUrl,
            githubUrl: data.githubUrl,
            status: data.status || 'pending_review',
            tier: data.tier || 'silver',
          });
        } else {
          // Pre-fill email and name from checkout if available
          if (data.customerName && data.customerName !== 'Sponsor') {
            setName(data.customerName);
            setCompany(data.customerName);
          }
          if (data.customerEmail) {
            setEmail(data.customerEmail);
          }
        }
      } else {
        if (data.paymentNotCompleted || res.status === 402) {
          setPaymentNotCompleted(true);
        }
        setErrorMessage(
          data.error || "We couldn't verify your sponsorship payment."
        );
      }
    } catch (err) {
      console.error('Verification error:', err);
      setErrorMessage("We couldn't verify your sponsorship payment.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('checkout_id') || params.get('session_id') || '';
    setCheckoutId(id);

    if (id) {
      verifyCheckout(id);
    } else {
      setVerifying(false);
      setErrorMessage('Missing checkout_id parameter in URL.');
    }
  }, []);

  // Handle Logo Upload with security validations
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      triggerHaptic('error');
      setFieldErrors(prev => ({ ...prev, logo: 'Please upload a PNG, JPG, WebP, or SVG image.' }));
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      triggerHaptic('error');
      setFieldErrors(prev => ({ ...prev, logo: 'Logo file size must be under 2MB.' }));
      return;
    }

    setUploadedFileName(file.name);
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy.logo;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      let dataUri = event.target?.result as string;

      // Basic SVG sanitization: remove potential script tags
      if (file.type === 'image/svg+xml' && typeof dataUri === 'string') {
        try {
          const base64Prefix = 'data:image/svg+xml;base64,';
          if (dataUri.startsWith(base64Prefix)) {
            const rawSvg = atob(dataUri.replace(base64Prefix, ''));
            if (rawSvg.includes('<script') || /on\w+=/i.test(rawSvg)) {
              triggerHaptic('error');
              setFieldErrors(prev => ({ ...prev, logo: 'SVG contains prohibited executable scripts.' }));
              return;
            }
          }
        } catch {
          // If decoding fails, fall back to safe handling
        }
      }

      setLogoUrl(dataUri);
      triggerHaptic('light');
    };
    reader.readAsDataURL(file);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full Name is required.';
    }

    if (!company.trim()) {
      errors.company = 'Company or Project Name is required.';
    }

    if (!website.trim()) {
      errors.website = 'Website URL is required.';
    } else {
      try {
        const urlToCheck = website.startsWith('http://') || website.startsWith('https://')
          ? website
          : `https://${website}`;
        const parsed = new URL(urlToCheck);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          errors.website = 'Website must use http or https.';
        }
      } catch {
        errors.website = 'Please enter a valid website URL (e.g. https://example.com).';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!logoUrl) {
      errors.logo = 'Please upload your sponsor logo.';
    }

    if (description.length > 250) {
      errors.description = 'Description must not exceed 250 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      triggerHaptic('error');
      return;
    }

    setSubmitting(true);
    triggerHaptic('medium');

    try {
      const res = await fetch('/api/sponsor/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkout_id: checkoutId,
          name: name.trim(),
          company: company.trim(),
          website: website.trim(),
          email: email.trim().toLowerCase(),
          logo_url: logoUrl,
          description: description.trim(),
          twitter_url: twitterUrl.trim() || undefined,
          github_url: githubUrl.trim() || undefined,
          placement: verificationResult?.tier || 'silver',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit sponsorship information.');
      }

      setSubmittedData({
        name: name.trim(),
        company: company.trim(),
        website: website.trim(),
        email: email.trim().toLowerCase(),
        logoUrl,
        description: description.trim(),
        twitterUrl: twitterUrl.trim(),
        githubUrl: githubUrl.trim(),
        status: 'pending_review',
        tier: verificationResult?.tier || 'silver',
      });

      triggerHaptic('success');
      showToast?.('Sponsorship submitted for review!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      triggerHaptic('error');
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full min-h-dvh pb-28 pt-8 sm:pt-14 font-sans select-none transition-colors ${
        isDark ? 'bg-black text-neutral-50' : 'bg-[#FAFAFA] text-neutral-900'
      }`}
    >
      <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onNavigateSponsors}
            className={`inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${
              isDark ? 'text-white/40 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sponsors</span>
          </button>
        </div>

        {/* 1. STATE: Verifying Sponsorship */}
        {verifying && (
          <div
            className={`w-full rounded-[16px] p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors ${
              isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] border border-white/[0.04]'
                : 'bg-white border border-neutral-200 outline outline-neutral-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
            <h2
              className={`text-[20px] sm:text-[22px] leading-7 font-semibold tracking-[-0.5px] m-0 ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}
            >
              Verifying your sponsorship...
            </h2>
            <p
              className={`mt-2 text-[14px] leading-relaxed max-w-sm m-0 ${
                isDark ? 'text-white/40' : 'text-neutral-500'
              }`}
            >
              Connecting with Polar to securely authenticate your checkout payment and entitlement.
            </p>
          </div>
        )}

        {/* 2. STATE: Payment Not Completed */}
        {!verifying && paymentNotCompleted && !submittedData && (
          <div
            className={`w-full rounded-[16px] p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-colors ${
              isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] border border-white/[0.04]'
                : 'bg-white border border-neutral-200 outline outline-neutral-200'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Payment Incomplete</span>
            </div>
            <h2
              className={`text-[22px] sm:text-[26px] leading-8 font-semibold tracking-[-0.6px] m-0 ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}
            >
              Your sponsorship payment has not been completed.
            </h2>
            <p
              className={`mt-2.5 text-[14px] leading-relaxed max-w-md m-0 ${
                isDark ? 'text-white/50' : 'text-neutral-600'
              }`}
            >
              We were unable to confirm a successful payment for this checkout session. If your transaction is still processing, please wait a moment and retry.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => verifyCheckout(checkoutId)}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 select-none ${
                  isDark
                    ? 'bg-neutral-50 text-black hover:bg-neutral-300'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Verification</span>
              </button>
              <button
                type="button"
                onClick={onNavigateSponsors}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-100'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                }`}
              >
                <span>Back to Sponsors</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. STATE: Invalid Checkout */}
        {!verifying && !paymentNotCompleted && errorMessage && !submittedData && (
          <div
            className={`w-full rounded-[16px] p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-colors ${
              isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] border border-white/[0.04]'
                : 'bg-white border border-neutral-200 outline outline-neutral-200'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Verification Error</span>
            </div>
            <h2
              className={`text-[22px] sm:text-[26px] leading-8 font-semibold tracking-[-0.6px] m-0 ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}
            >
              We couldn't verify your sponsorship payment.
            </h2>
            <p
              className={`mt-2.5 text-[14px] leading-relaxed max-w-md m-0 ${
                isDark ? 'text-white/50' : 'text-neutral-600'
              }`}
            >
              {errorMessage}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => verifyCheckout(checkoutId)}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 select-none ${
                  isDark
                    ? 'bg-neutral-50 text-black hover:bg-neutral-300'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <a
                href="mailto:subhanprsnl@gmail.com?subject=Amicro%20Sponsorship%20Verification%20Support"
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-100'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </a>
              <button
                type="button"
                onClick={onNavigateSponsors}
                className={`text-[13px] underline underline-offset-4 px-2 py-1 transition-colors border-0 bg-transparent cursor-pointer ${
                  isDark ? 'text-white/40 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Back to Sponsors
              </button>
            </div>
          </div>
        )}

        {/* 4. STATE: Success & Already Submitted (Pending Review Confirmation) */}
        {!verifying && submittedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-[16px] p-6 sm:p-9 transition-colors ${
              isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] border border-white/[0.04]'
                : 'bg-white border border-neutral-200 outline outline-neutral-200'
            }`}
          >
            {/* Header info */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Status: Pending Review</span>
              </div>
              <h1
                className={`text-[28px] sm:text-[34px] leading-[34px] sm:leading-[40px] font-bold tracking-tighter m-0 ${
                  isDark ? 'text-neutral-50' : 'text-neutral-900'
                }`}
              >
                You're all set
              </h1>
              <p
                className={`mt-2 text-[14px] sm:text-[15px] leading-relaxed max-w-md m-0 ${
                  isDark ? 'text-white/60' : 'text-neutral-600'
                }`}
              >
                Thanks for sponsoring Amicro. We've received your information and will review your sponsor placement shortly.
              </p>
            </div>

            {/* Native Amicro Sponsor Card Live Preview */}
            <div className="w-full mb-6">
              <div
                className={`text-[12px] font-semibold uppercase tracking-wider mb-2.5 text-center ${
                  isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
              >
                Placement Preview
              </div>

              {/* Exact Amicro Silver Slot Card Preview */}
              <div className="w-full flex justify-center">
                <div className="w-full sm:w-[220px]">
                  <a
                    href={submittedData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic('light')}
                    className={`relative w-full rounded-[16px] min-h-[90px] sm:min-h-[96px] flex items-center justify-center p-3.5 no-underline transition-colors ${
                      isDark
                        ? 'bg-white/[0.06] hover:bg-white/[0.09] outline -outline-offset-1 outline-white/[0.03]'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-200/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2.5 my-auto">
                      {submittedData.logoUrl ? (
                        <img
                          src={submittedData.logoUrl}
                          alt={submittedData.company}
                          className="w-7 h-7 rounded-lg object-contain bg-black/10 shrink-0"
                        />
                      ) : (
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDark ? 'bg-white/10 text-white' : 'bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          {submittedData.company.charAt(0)}
                        </span>
                      )}
                      <span
                        className={`text-[13.5px] font-bold tracking-tight truncate max-w-[140px] ${
                          isDark ? 'text-neutral-100' : 'text-neutral-900'
                        }`}
                      >
                        {submittedData.company}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Submitted Metadata Summary */}
            <div
              className={`rounded-[12px] p-4 text-[13px] flex flex-col gap-2.5 mb-6 ${
                isDark ? 'bg-white/[0.02] border border-white/[0.05]' : 'bg-neutral-50 border border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={isDark ? 'text-white/40' : 'text-neutral-500'}>Website:</span>
                <a
                  href={submittedData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 font-medium hover:underline truncate max-w-[280px] ${
                    isDark ? 'text-neutral-200' : 'text-neutral-800'
                  }`}
                >
                  <span className="truncate">{submittedData.website}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                </a>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={isDark ? 'text-white/40' : 'text-neutral-500'}>Contact Email:</span>
                <span className={`font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  {submittedData.email}
                </span>
              </div>
              {submittedData.description && (
                <div className="pt-2 border-t border-white/[0.04]">
                  <span className={`block text-[12px] mb-1 ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>
                    Description:
                  </span>
                  <p className={`m-0 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {submittedData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onNavigateHome}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center cursor-pointer border-0 select-none ${
                  isDark
                    ? 'bg-neutral-50 text-black hover:bg-neutral-300'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <span>Back to Home</span>
              </button>
              <button
                type="button"
                onClick={onNavigateSponsors}
                className={`h-10 rounded-full px-5 text-sm font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-100'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                }`}
              >
                <span>View Sponsors</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. STATE: Sponsor Information Form (Payment verified & not yet submitted) */}
        {!verifying && !errorMessage && !paymentNotCompleted && !submittedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-[16px] p-6 sm:p-9 transition-colors ${
              isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] border border-white/[0.04]'
                : 'bg-white border border-neutral-200 outline outline-neutral-200'
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Verified via Polar</span>
              </div>
              <h1
                className={`text-[28px] sm:text-[34px] leading-[34px] sm:leading-[40px] font-bold tracking-tighter m-0 ${
                  isDark ? 'text-neutral-50' : 'text-neutral-900'
                }`}
              >
                Complete your sponsorship
              </h1>
              <p
                className={`mt-2 text-[14px] sm:text-[15px] leading-relaxed max-w-lg m-0 ${
                  isDark ? 'text-white/50' : 'text-neutral-600'
                }`}
              >
                Thanks for supporting Amicro. Add your details below so we can set up your sponsor placement.
              </p>
            </div>

            {/* Submission Error Banner */}
            {submitError && (
              <div className="mb-6 p-3.5 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              {/* Full Name */}
              <div>
                <label
                  className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                    isDark ? 'text-white/60' : 'text-neutral-700'
                  }`}
                >
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors(p => ({ ...p, name: '' }));
                  }}
                  placeholder="e.g. Alex Rivera"
                  className={`w-full h-11 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                      : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                  } ${fieldErrors.name ? 'border-red-400' : ''}`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.name}</p>
                )}
              </div>

              {/* Company / Project Name */}
              <div>
                <label
                  className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                    isDark ? 'text-white/60' : 'text-neutral-700'
                  }`}
                >
                  Company / Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (fieldErrors.company) setFieldErrors(p => ({ ...p, company: '' }));
                  }}
                  placeholder="e.g. Acme DevTools"
                  className={`w-full h-11 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                      : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                  } ${fieldErrors.company ? 'border-red-400' : ''}`}
                />
                {fieldErrors.company && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.company}</p>
                )}
              </div>

              {/* Website URL */}
              <div>
                <label
                  className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                    isDark ? 'text-white/60' : 'text-neutral-700'
                  }`}
                >
                  Website URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (fieldErrors.website) setFieldErrors(p => ({ ...p, website: '' }));
                  }}
                  placeholder="https://example.com"
                  className={`w-full h-11 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                      : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                  } ${fieldErrors.website ? 'border-red-400' : ''}`}
                />
                {fieldErrors.website && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.website}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label
                  className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                    isDark ? 'text-white/60' : 'text-neutral-700'
                  }`}
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: '' }));
                  }}
                  placeholder="sponsor@example.com"
                  className={`w-full h-11 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                      : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                  } ${fieldErrors.email ? 'border-red-400' : ''}`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.email}</p>
                )}
              </div>

              {/* Logo Upload - Native Amicro Slot Style */}
              <div>
                <label
                  className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                    isDark ? 'text-white/60' : 'text-neutral-700'
                  }`}
                >
                  Logo <span className="text-red-400">*</span>
                </label>

                {!logoUrl ? (
                  <label
                    className={`relative w-full rounded-[14px] min-h-[96px] border border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-colors text-center ${
                      isDark
                        ? 'border-white/10 hover:border-white/25 bg-white/[0.02]'
                        : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
                    } ${fieldErrors.logo ? 'border-red-400' : ''}`}
                  >
                    <Upload
                      className={`w-5 h-5 mb-1.5 ${
                        isDark ? 'text-white/40' : 'text-neutral-400'
                      }`}
                    />
                    <span
                      className={`text-[13px] font-medium ${
                        isDark ? 'text-neutral-200' : 'text-neutral-800'
                      }`}
                    >
                      Click to choose logo file
                    </span>
                    <span
                      className={`text-[11px] mt-0.5 ${
                        isDark ? 'text-white/30' : 'text-neutral-500'
                      }`}
                    >
                      PNG, JPG, WebP, or SVG (max 2MB)
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div
                    className={`flex items-center justify-between p-3 rounded-[12px] border ${
                      isDark
                        ? 'bg-white/[0.03] border-white/10'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={logoUrl}
                        alt="Preview"
                        className="w-8 h-8 rounded-lg object-contain bg-black/30 p-1 border border-white/10 shrink-0"
                      />
                      <span
                        className={`text-xs truncate max-w-[200px] ${
                          isDark ? 'text-neutral-200' : 'text-neutral-800'
                        }`}
                      >
                        {uploadedFileName || 'Logo ready'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('');
                        setUploadedFileName('');
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer border-0 bg-transparent"
                      title="Remove logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {fieldErrors.logo && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.logo}</p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className={`text-[13px] leading-[18px] font-medium select-none ${
                      isDark ? 'text-white/60' : 'text-neutral-700'
                    }`}
                  >
                    Short Description <span className={`text-xs ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>(Optional)</span>
                  </label>
                  <span
                    className={`text-[11px] ${
                      description.length > 250
                        ? 'text-red-400'
                        : isDark
                        ? 'text-white/30'
                        : 'text-neutral-400'
                    }`}
                  >
                    {description.length}/250
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="One sentence describing your tool or product..."
                  className={`w-full px-3.5 py-2.5 rounded-[10px] text-sm font-normal outline-none resize-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                      : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                  }`}
                />
              </div>

              {/* Social URLs (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* X / Twitter */}
                <div>
                  <label
                    className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                      isDark ? 'text-white/60' : 'text-neutral-700'
                    }`}
                  >
                    X / Twitter <span className={`text-xs ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/username"
                    className={`w-full h-10 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                      isDark
                        ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                        : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                    }`}
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label
                    className={`block text-[13px] leading-[18px] font-medium mb-1.5 select-none ${
                      isDark ? 'text-white/60' : 'text-neutral-700'
                    }`}
                  >
                    GitHub <span className={`text-xs ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/org"
                    className={`w-full h-10 px-3.5 rounded-[10px] text-sm font-normal outline-none transition-colors ${
                      isDark
                        ? 'bg-white/[0.04] border border-white/[0.08] focus:border-white/30 text-neutral-100 placeholder:text-white/20'
                        : 'bg-neutral-50 border border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder:text-neutral-400'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full h-11 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 select-none ${
                    isDark
                      ? 'bg-neutral-50 text-black hover:bg-neutral-300 disabled:opacity-50'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      <span>Saving your details...</span>
                    </>
                  ) : (
                    <span>Complete Sponsorship</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

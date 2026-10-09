import React, { useState, useEffect } from 'react';
import { useWebHaptics } from '../hooks/useWebHaptics';

interface SponsorOnboardingPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  onNavigateSponsors: () => void;
  showToast?: (message: string) => void;
}

interface VerificationData {
  valid: boolean;
  checkoutId?: string;
  sponsorshipId?: string;
  tier?: 'diamond' | 'gold' | 'silver';
  price?: number;
  customerEmail?: string;
  customerName?: string;
  alreadyClaimed?: boolean;
  placement?: string;
  error?: string;
}

export function SponsorOnboardingPage({
  onNavigateHome,
  onNavigateSponsors,
  showToast,
}: SponsorOnboardingPageProps) {
  const { trigger: triggerHaptic } = useWebHaptics();

  // Verification state
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [status, setStatus] = useState<'verifying' | 'verified' | 'invalid' | 'missing'>('verifying');
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form inputs
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoMode, setLogoMode] = useState<'upload' | 'url'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [placement, setPlacement] = useState('diamond');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Read checkout_id from URL and verify with server
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('checkout_id') || params.get('session_id') || '';
    setCheckoutId(id);

    if (!id) {
      setStatus('missing');
      return;
    }

    async function verifyCheckout() {
      setStatus('verifying');
      try {
        const res = await fetch(`/api/polar/verify?checkout_id=${encodeURIComponent(id)}`);
        const data: VerificationData = await res.json();

        if (res.ok && data.valid) {
          if (data.alreadyClaimed) {
            setStatus('invalid');
            setErrorMessage('This sponsorship checkout has already been claimed and activated.');
            return;
          }
          setVerificationData(data);
          setStatus('verified');
          if (data.customerName && data.customerName !== 'Sponsor') {
            setCompanyName(data.customerName);
          }
          if (data.customerEmail) {
            setEmail(data.customerEmail);
          }
          if (data.tier) {
            setPlacement(data.tier);
          }
        } else {
          setStatus('invalid');
          setErrorMessage(data.error || 'This checkout session is invalid, expired, or unpaid.');
        }
      } catch (err) {
        console.error('Failed to verify checkout:', err);
        setStatus('invalid');
        setErrorMessage('Could not connect to the verification server. Please try again.');
      }
    }

    verifyCheckout();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      triggerHaptic('error');
      alert('Logo image must be under 500KB.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setLogoUrl(dataUri);
      triggerHaptic('light');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      triggerHaptic('error');
      alert('Please provide your company or product name.');
      return;
    }
    if (!description.trim()) {
      triggerHaptic('error');
      alert('Please provide a short description or tagline.');
      return;
    }
    if (!siteUrl.trim()) {
      triggerHaptic('error');
      alert('Please provide your website link.');
      return;
    }
    if (!email.trim()) {
      triggerHaptic('error');
      alert('Please provide a contact email.');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    try {
      const response = await fetch('/api/polar/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId,
          companyName: companyName.trim(),
          description: description.trim(),
          siteUrl: siteUrl.trim(),
          logoUrl: logoUrl.trim() || undefined,
          email: email.trim().toLowerCase(),
          placement: placement || verificationData?.tier || 'diamond',
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit sponsor details.');
      }

      setIsSuccess(true);
      triggerHaptic('success');
      showToast?.('Sponsorship details activated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      triggerHaptic('error');
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tier = verificationData?.tier || 'silver';
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const tierPrice = verificationData?.price || (tier === 'diamond' ? 250 : tier === 'gold' ? 150 : 99);

  return (
    <div className="w-full min-h-dvh bg-black text-neutral-50 font-sans">
      <div className="max-w-[560px] mx-auto px-4 pt-24 pb-20">
        {/* Back link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onNavigateSponsors}
            className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
          >
            Sponsors
          </button>
        </div>

        {/* Loading / Verifying State */}
        {status === 'verifying' && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Your placement.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Verifying checkout with Polar...
            </p>
          </div>
        )}

        {/* Missing Checkout ID State */}
        {status === 'missing' && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Access restricted.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              This link requires a verified Polar checkout.
            </p>
            <button
              type="button"
              onClick={onNavigateSponsors}
              className="mt-8 h-10 rounded-full px-6 bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0"
            >
              Back to Sponsors
            </button>
          </div>
        )}

        {/* Invalid Checkout ID State */}
        {status === 'invalid' && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Verification failed.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              {errorMessage || 'Could not verify an active checkout session.'}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="h-10 rounded-full px-6 bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={onNavigateSponsors}
                className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
              >
                Back to Sponsors
              </button>
            </div>
          </div>
        )}

        {/* Already Claimed State */}
        {status === 'verified' && verificationData?.alreadyClaimed && !isSuccess && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Already active.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              This checkout session has already been claimed and published.
            </p>
            <button
              type="button"
              onClick={onNavigateSponsors}
              className="mt-8 h-10 rounded-full px-6 bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0"
            >
              View on Sponsors
            </button>
          </div>
        )}

        {/* Success Screen after Claiming */}
        {isSuccess && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Placement published.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Your details have been published to the site.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={onNavigateSponsors}
                className="h-10 rounded-full px-6 bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0"
              >
                View on Sponsors
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
              >
                Home
              </button>
            </div>
          </div>
        )}

        {/* Active Verified Form: Collect Details */}
        {status === 'verified' && !verificationData?.alreadyClaimed && !isSuccess && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Your placement.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Add the name and logo that will show on the site.
            </p>
            <p className="mt-2 text-[14px] leading-[20px] text-white/40 m-0">
              {capitalizedTier} · ${tierPrice} paid · Payment verified
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              {/* Company */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Supabase, Raycast, Vercel"
                  maxLength={60}
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
              </div>

              {/* Tagline */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[14px] leading-[20px] font-medium text-white/50">
                    Tagline
                  </label>
                  <span className="text-white/30 text-xs font-normal">
                    {description.length}/120
                  </span>
                </div>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Build in a weekend, scale to billions."
                  maxLength={120}
                  className="w-full rounded-[10px] bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 resize-none transition-colors"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  required
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
              </div>

              {/* Logo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[14px] leading-[20px] font-medium text-white/50">
                    Logo
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setLogoMode('upload')}
                      className={`text-xs transition-colors cursor-pointer border-0 bg-transparent p-0 ${
                        logoMode === 'upload' ? 'text-neutral-50 font-medium' : 'text-white/35 hover:text-white/60'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('url')}
                      className={`text-xs transition-colors cursor-pointer border-0 bg-transparent p-0 ${
                        logoMode === 'url' ? 'text-neutral-50 font-medium' : 'text-white/35 hover:text-white/60'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {logoMode === 'upload' ? (
                  <label className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-white/50 flex items-center justify-between cursor-pointer focus-within:bg-white/[0.07] transition-colors">
                    <span className="truncate text-sm text-neutral-50">
                      {uploadedFileName || 'Choose logo'}
                    </span>
                    {uploadedFileName ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoUrl('');
                          setUploadedFileName(null);
                        }}
                        className="text-xs text-white/30 hover:text-white cursor-pointer border-0 bg-transparent ml-2"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-xs text-white/30">PNG, JPG, SVG</span>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://yourcompany.com/logo.png"
                    className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                  />
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@yourcompany.com"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 h-10 w-full rounded-full bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

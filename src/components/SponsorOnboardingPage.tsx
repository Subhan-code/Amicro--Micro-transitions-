import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ShieldCheck,
  Lock,
  Globe,
  Upload,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Trash2,
} from 'lucide-react';
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
  theme,
  onNavigateHome,
  onNavigateSponsors,
  showToast,
}: SponsorOnboardingPageProps) {
  const isDark = theme === 'dark';
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
  const [createdSponsorshipId, setCreatedSponsorshipId] = useState('');

  // 1. Read checkout_id from URL and verify with server
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
      alert('Creative image must be under 500KB.');
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
      setCreatedSponsorshipId(resData.sponsorshipId);
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

  const tier = verificationData?.tier || 'diamond';
  const tierPrice = verificationData?.price || (tier === 'diamond' ? 250 : tier === 'gold' ? 150 : 99);

  return (
    <div className={`min-h-[85vh] w-full py-12 px-4 sm:px-6 flex items-center justify-center font-sans ${
      isDark ? 'text-zinc-100' : 'text-zinc-900'
    }`}>
      <div className="w-full max-w-[840px] mx-auto">
        
        {/* Loading / Verifying State */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
            <h2 className="text-xl font-semibold tracking-tight mb-2">Verifying Polar Checkout Session</h2>
            <p className="text-sm text-zinc-400 max-w-sm">
              Connecting to Polar to verify your payment status and tier entitlement...
            </p>
          </div>
        )}

        {/* Missing Checkout ID State */}
        {status === 'missing' && (
          <div className="flex flex-col items-center justify-center text-center p-10 sm:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Access Restricted</h2>
            <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              This onboarding portal is exclusively for verified sponsors who completed a Polar checkout.
              Please select a tier on our sponsors page to get started.
            </p>
            <button
              onClick={onNavigateSponsors}
              className="px-6 py-3 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Explore Sponsorship Tiers
            </button>
          </div>
        )}

        {/* Invalid Checkout ID State */}
        {status === 'invalid' && (
          <div className="flex flex-col items-center justify-center text-center p-10 sm:p-12 rounded-3xl border border-red-500/20 bg-red-950/10 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Checkout Verification Failed</h2>
            <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              {errorMessage || 'We could not verify an active, paid Polar checkout session for this identifier.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateSponsors}
                className="px-6 py-2.5 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Back to Sponsors
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full font-medium text-sm bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Already Claimed State */}
        {status === 'verified' && verificationData?.alreadyClaimed && !isSuccess && (
          <div className="flex flex-col items-center justify-center text-center p-10 sm:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Sponsorship Already Active</h2>
            <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              This checkout session has already been claimed and published to the Amicro network.
            </p>
            <button
              onClick={onNavigateSponsors}
              className="px-6 py-3 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
            >
              View on Sponsors Page
            </button>
          </div>
        )}

        {/* Success Screen after Claiming */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center text-center p-10 sm:p-12 rounded-3xl border border-emerald-500/20 bg-emerald-950/15 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">You're Officially Live!</h2>
            <p className="text-sm text-zinc-300 max-w-md mb-8 leading-relaxed">
              Your brand placement has been successfully registered and published to Amicro.
              Developers and designers across the ecosystem can now discover your product.
            </p>

            {/* Live Preview Card */}
            <div className="w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#121215] text-left mb-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={companyName} className="w-10 h-10 rounded-xl object-contain bg-black/20 p-1 border border-white/10" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                    {companyName.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-base text-white">{companyName}</h4>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    {tier} Sponsor
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{description}</p>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                <span>Visit {new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`).hostname}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateSponsors}
                className="px-7 py-3 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
              >
                View on Sponsors Showcase
              </button>
              <button
                onClick={onNavigateHome}
                className="px-7 py-3 rounded-full font-medium text-sm bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Active Verified Form: Collect Details */}
        {status === 'verified' && !verificationData?.alreadyClaimed && !isSuccess && (
          <div className="flex flex-col gap-6">
            
            {/* Header Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Payment Verified via Polar</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome to Amicro Sponsors
                </h1>
                <p className="text-sm text-zinc-400 mt-1 max-w-lg">
                  Complete your brand details below to publish your ad placement immediately.
                </p>
              </div>

              {/* Tier Badge */}
              <div className="shrink-0 p-4 rounded-2xl border border-white/10 bg-black/40 text-center sm:text-right">
                <span className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">
                  Purchased Tier
                </span>
                <span className="text-xl sm:text-2xl font-black capitalize text-white tracking-tight">
                  {tier}
                </span>
                <span className="text-xs text-emerald-400 font-mono block font-semibold">
                  ${tierPrice} Paid
                </span>
              </div>
            </div>

            {/* Form + Real-Time Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input Columns */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-7">
                
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Company / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Supabase, Raycast, Vercel"
                    maxLength={60}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Tagline / Description *
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {description.length}/120
                    </span>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Build in a weekend, scale to billions."
                    maxLength={120}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Website URL *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Creative / Logo */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Brand Logo / Creative
                    </label>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setLogoMode('upload')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                          logoMode === 'upload' ? 'bg-white/20 text-white' : 'text-zinc-400'
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoMode('url')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                          logoMode === 'url' ? 'bg-white/20 text-white' : 'text-zinc-400'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {logoMode === 'upload' ? (
                    <div className="flex items-center gap-3">
                      <label className="flex-1 border-2 border-dashed border-white/15 hover:border-white/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20 group">
                        <Upload className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors mb-1" />
                        <span className="text-xs text-zinc-300">
                          {uploadedFileName ? uploadedFileName : 'Click or drop logo image (max 500KB)'}
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoUrl('');
                            setUploadedFileName(null);
                          }}
                          className="p-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Remove logo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://yourcompany.com/logo.png"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  )}
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Contact / Notification Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@yourcompany.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Publish Sponsorship</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                      Live Placement Preview
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-zinc-300">
                      Real-time
                    </span>
                  </div>

                  {/* Card rendering */}
                  <div className="rounded-2xl border border-white/10 bg-[#0e0e11] p-6 text-center flex flex-col items-center justify-between min-h-[220px] shadow-xl">
                    <div className="flex flex-col items-center justify-center my-auto py-2">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={companyName || 'Logo'}
                          className="w-12 h-12 rounded-xl object-contain bg-black/30 border border-white/10 mb-3 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center font-bold text-xl text-blue-400 mb-3">
                          {companyName ? companyName.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}

                      <span className="text-[18px] font-bold text-white tracking-tight">
                        {companyName || 'Your Brand Name'}
                      </span>
                      <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-2 max-w-[220px] mt-1">
                        {description || 'Your product value proposition appears here.'}
                      </p>
                    </div>

                    <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="capitalize">{tier} Sponsor</span>
                      <span className="text-blue-400">amicro.dev</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 text-center mt-3">
                    Your ad will appear across the catalog, showcase grids, and GitHub repository.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

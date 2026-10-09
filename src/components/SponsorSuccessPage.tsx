import React, { useState, useEffect } from 'react';
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
  onNavigateHome,
  onNavigateSponsors,
  showToast,
}: SponsorSuccessPageProps) {
  const { trigger: triggerHaptic } = useWebHaptics();

  const [checkoutId, setCheckoutId] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paymentNotCompleted, setPaymentNotCompleted] = useState<boolean>(false);

  // Form Fields (Order: Name, Company, Website, Email, Logo, Description, X, GitHub)
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoMode, setLogoMode] = useState<'upload' | 'url'>('upload');
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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
        setErrorMessage(data.error || "We couldn't verify your sponsorship payment.");
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      triggerHaptic('error');
      setFieldErrors((prev) => ({ ...prev, logo: 'Please upload a PNG, JPG, WebP, or SVG image.' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      triggerHaptic('error');
      setFieldErrors((prev) => ({ ...prev, logo: 'Logo file size must be under 2MB.' }));
      return;
    }

    setUploadedFileName(file.name);
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.logo;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setLogoUrl(dataUri);
      triggerHaptic('light');
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Full Name is required.';
    if (!company.trim()) errors.company = 'Company is required.';
    if (!website.trim()) {
      errors.website = 'Website is required.';
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
        errors.website = 'Please enter a valid website URL.';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!logoUrl) {
      errors.logo = 'Please choose a logo.';
    }

    if (description.length > 250) {
      errors.description = 'Description must not exceed 250 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const tier = verificationResult?.tier || 'silver';
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const tierPrice = tier === 'diamond' ? 250 : tier === 'gold' ? 150 : 99;

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

        {/* Verifying State */}
        {verifying && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Complete your sponsorship.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Verifying your sponsorship payment...
            </p>
          </div>
        )}

        {/* Payment Incomplete State */}
        {!verifying && paymentNotCompleted && !submittedData && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Payment incomplete.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              We could not confirm a successful payment for this checkout session.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => verifyCheckout(checkoutId)}
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

        {/* Verification Error State */}
        {!verifying && !paymentNotCompleted && errorMessage && !submittedData && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Verification error.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              {errorMessage}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => verifyCheckout(checkoutId)}
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

        {/* Submitted State / Pending Review */}
        {!verifying && submittedData && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              You're all set.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Thanks for sponsoring Amicro. We've received your details and will review your placement shortly.
            </p>

            <div className="mt-8 space-y-3 border-t border-white/[0.04] pt-6">
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-white/40">Company</span>
                <span className="text-neutral-200 font-medium">{submittedData.company}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-white/40">Website</span>
                <a
                  href={submittedData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-200 hover:text-white truncate max-w-[280px]"
                >
                  {submittedData.website}
                </a>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-white/40">Contact Email</span>
                <span className="text-neutral-200">{submittedData.email}</span>
              </div>
              {submittedData.description && (
                <div className="pt-2">
                  <span className="block text-white/40 text-sm mb-1">Description</span>
                  <p className="text-sm text-neutral-300 m-0 leading-relaxed">
                    {submittedData.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={onNavigateHome}
                className="h-10 rounded-full px-6 bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0"
              >
                Back to Home
              </button>
              <button
                type="button"
                onClick={onNavigateSponsors}
                className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
              >
                View Sponsors
              </button>
            </div>
          </div>
        )}

        {/* Sponsor Information Form */}
        {!verifying && !errorMessage && !paymentNotCompleted && !submittedData && (
          <div>
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
              Complete your sponsorship.
            </h1>
            <p className="mt-2 text-[16px] leading-[24px] font-medium text-white/50 m-0">
              Add your details so the placement can go up.
            </p>
            <p className="mt-2 text-[14px] leading-[20px] text-white/40 m-0">
              {capitalizedTier} · ${tierPrice} paid · Payment verified
            </p>

            {submitError && (
              <p className="mt-4 text-xs text-red-400 m-0">{submitError}</p>
            )}

            {/* Form Fields: Name, Company, Website, Email, Logo, Description, X, GitHub */}
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              {/* 1. Name */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }));
                  }}
                  placeholder="e.g. Alex Rivera"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.name}</p>
                )}
              </div>

              {/* 2. Company */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (fieldErrors.company) setFieldErrors((p) => ({ ...p, company: '' }));
                  }}
                  placeholder="e.g. Acme DevTools"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
                {fieldErrors.company && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.company}</p>
                )}
              </div>

              {/* 3. Website */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (fieldErrors.website) setFieldErrors((p) => ({ ...p, website: '' }));
                  }}
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
                {fieldErrors.website && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.website}</p>
                )}
              </div>

              {/* 4. Email */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                  }}
                  placeholder="sponsor@example.com"
                  className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.email}</p>
                )}
              </div>

              {/* 5. Logo */}
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
                          setUploadedFileName('');
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
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      if (fieldErrors.logo) setFieldErrors((p) => ({ ...p, logo: '' }));
                    }}
                    placeholder="https://example.com/logo.png"
                    className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                  />
                )}
                {fieldErrors.logo && (
                  <p className="mt-1 text-xs text-red-400 m-0">{fieldErrors.logo}</p>
                )}
              </div>

              {/* 6. Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[14px] leading-[20px] font-medium text-white/50">
                    Description <span className="text-white/30 font-normal">Optional</span>
                  </label>
                  <span className="text-white/30 text-xs font-normal">
                    {description.length}/250
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="One sentence describing your product..."
                  className="w-full rounded-[10px] bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 resize-none transition-colors"
                />
              </div>

              {/* 7 & 8. X and GitHub (same row from sm) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                    X <span className="text-white/30 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/username"
                    className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
                    GitHub <span className="text-white/30 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/org"
                    className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-8 h-10 w-full rounded-full bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Complete'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

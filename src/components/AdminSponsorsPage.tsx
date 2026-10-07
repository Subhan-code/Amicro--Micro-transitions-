import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  Lock,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';

interface AdminSponsorsPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  showToast?: (message: string) => void;
}

interface AdminSponsorItem {
  id: string;
  name?: string | null;
  company?: string | null;
  company_name: string;
  website?: string | null;
  site_url: string;
  email: string;
  logo_url?: string | null;
  description: string;
  twitter_url?: string | null;
  github_url?: string | null;
  payment_status: string;
  status: string;
  ad_status?: string;
  checkout_id?: string | null;
  polar_checkout_id?: string | null;
  tier: string;
  price: number;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
}

export function AdminSponsorsPage({
  theme,
  onNavigateHome,
  showToast,
}: AdminSponsorsPageProps) {
  const isDark = theme === 'dark';
  const { trigger: triggerHaptic } = useWebHaptics();

  // Authentication
  const [adminKey, setAdminKey] = useState<string>(() => {
    return localStorage.getItem('amicro_admin_key') || '';
  });
  const [keyInput, setKeyInput] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Data & Tabs
  const [sponsors, setSponsors] = useState<AdminSponsorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchSponsors = async (keyToUse: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/sponsors', {
        headers: {
          'x-admin-key': keyToUse,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Invalid admin key. Please enter the correct secret key.');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load sponsorships');
      }

      const data = await res.json();
      setSponsors(data.sponsors || []);
      setIsAuthenticated(true);
      localStorage.setItem('amicro_admin_key', keyToUse);
    } catch (err: unknown) {
      console.error('Admin fetch error:', err);
      setAuthError('Could not connect to the admin API endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchSponsors(adminKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    fetchSponsors(keyInput.trim());
  };

  const handleAction = async (sponsorshipId: string, action: 'approve' | 'reject') => {
    setActionLoadingId(sponsorshipId);
    triggerHaptic('medium');

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          sponsorshipId,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} sponsorship`);
      }

      // Update state locally
      setSponsors((prev) =>
        prev.map((s) => {
          if (s.id === sponsorshipId) {
            return {
              ...s,
              status: action === 'approve' ? 'approved' : 'rejected',
              ad_status: action === 'approve' ? 'ACTIVE' : 'CANCELLED',
              approved_at: action === 'approve' ? new Date().toISOString() : s.approved_at,
            };
          }
          return s;
        })
      );

      triggerHaptic('success');
      showToast?.(`Sponsorship ${action === 'approve' ? 'approved & live' : 'rejected'} successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      triggerHaptic('error');
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter sponsors
  const pendingCount = sponsors.filter(
    (s) => s.status === 'pending_review' || (s.status !== 'approved' && s.status !== 'rejected')
  ).length;

  const filteredSponsors = sponsors.filter((s) => {
    const isPending =
      s.status === 'pending_review' || (s.status !== 'approved' && s.status !== 'rejected');
    const isApproved = s.status === 'approved';

    if (activeTab === 'pending' && !isPending) return false;
    if (activeTab === 'approved' && !isApproved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (s.name || '').toLowerCase().includes(q);
      const companyMatch = (s.company || s.company_name || '').toLowerCase().includes(q);
      const emailMatch = (s.email || '').toLowerCase().includes(q);
      const checkMatch = (s.checkout_id || s.polar_checkout_id || '').toLowerCase().includes(q);
      return nameMatch || companyMatch || emailMatch || checkMatch;
    }

    return true;
  });

  return (
    <div
      className={`min-h-[90vh] w-full py-12 px-4 sm:px-6 lg:px-8 font-sans ${
        isDark ? 'text-zinc-100' : 'text-zinc-900'
      }`}
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Amicro Portal
              </span>
              <span className="text-white/20">/</span>
              <span className="text-xs font-medium text-white/40">Review Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sponsor Review Queue
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => fetchSponsors(adminKey)}
                disabled={loading}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 hover:bg-white/5 text-white/70 hover:text-white'
                    : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                }`}
                title="Refresh sponsors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onNavigateHome}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/5 text-white/60 hover:text-white'
                  : 'border-neutral-300 hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              Back to Site
            </button>
          </div>
        </div>

        {/* Auth Gate if not authenticated */}
        {!isAuthenticated ? (
          <div
            className={`max-w-md mx-auto p-8 rounded-3xl border text-center ${
              isDark
                ? 'bg-[#141312] border-white/10 shadow-2xl'
                : 'bg-white border-neutral-200 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">Admin Authentication</h2>
            <p className={`text-xs mb-6 ${isDark ? 'text-white/45' : 'text-neutral-500'}`}>
              Enter the admin secret key to access the sponsor onboarding queue and approval actions.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="password"
                required
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter ADMIN_SECRET_KEY..."
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all ${
                  isDark
                    ? 'bg-white/[0.03] border-white/15 focus:border-white/40 text-white placeholder-white/20'
                    : 'bg-neutral-50 border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder-neutral-400'
                }`}
              />
              {authError && <p className="text-xs text-red-400 text-left">{authError}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-neutral-900 text-white hover:bg-black'
                }`}
              >
                {loading ? 'Authenticating...' : 'Unlock Review Panel'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Filter Bar & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'pending'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>Pending Review</span>
                  {pendingCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        activeTab === 'pending' ? 'bg-amber-400 text-black' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  All ({sponsors.length})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, company, email..."
                  className={`w-full pl-9 pr-3 py-2 rounded-full text-xs border outline-none transition-all ${
                    isDark
                      ? 'bg-white/[0.03] border-white/10 focus:border-white/25 text-white placeholder-white/20'
                      : 'bg-neutral-50 border-neutral-200 focus:border-neutral-400 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
              </div>
            </div>

            {/* Sponsors List */}
            {filteredSponsors.length === 0 ? (
              <div
                className={`p-12 rounded-3xl border text-center ${
                  isDark ? 'bg-[#141312] border-white/10' : 'bg-white border-neutral-200'
                }`}
              >
                <CheckCircle2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Queue is Empty</h3>
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>
                  No sponsorships found under the current tab.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredSponsors.map((item) => {
                  const isPending =
                    item.status === 'pending_review' ||
                    (item.status !== 'approved' && item.status !== 'rejected');
                  const isApproved = item.status === 'approved';
                  const isRejected = item.status === 'rejected';

                  return (
                    <div
                      key={item.id}
                      className={`p-6 rounded-[20px] border transition-all text-left ${
                        isDark
                          ? 'bg-[#141312] border-white/[0.08] hover:border-white/15'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Left Details */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Logo */}
                          {item.logo_url ? (
                            <img
                              src={item.logo_url}
                              alt={item.company || item.company_name}
                              className="w-14 h-14 rounded-2xl object-contain bg-black/20 p-1.5 border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl shrink-0">
                              {(item.company || item.company_name).charAt(0)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {/* Tier Badge */}
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white">
                                {item.tier} Sponsor
                              </span>

                              {/* Sponsorship Status Badge */}
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300">
                                  <Clock className="w-3 h-3" />
                                  Pending Review
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                                  <Check className="w-3 h-3" />
                                  Approved & Live
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 border border-red-500/25 text-red-300">
                                  <X className="w-3 h-3" />
                                  Rejected
                                </span>
                              )}

                              {/* Payment Status */}
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/5 text-emerald-400">
                                Payment: {item.payment_status}
                              </span>
                            </div>

                            {/* Name & Company */}
                            <h3 className="font-bold text-xl tracking-tight text-white mb-0.5">
                              {item.company || item.company_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 mb-3">
                              {item.name && (
                                <span>Contact: <strong className="text-white/80">{item.name}</strong></span>
                              )}
                              <span>•</span>
                              <a
                                href={item.website || item.site_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:text-white underline underline-offset-2"
                              >
                                {item.website || item.site_url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <span>•</span>
                              <a href={`mailto:${item.email}`} className="hover:text-white underline underline-offset-2">
                                {item.email}
                              </a>
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-2xl bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                                {item.description}
                              </p>
                            )}

                            {/* Social Links & Meta */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
                              {item.twitter_url && (
                                <a
                                  href={item.twitter_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-white flex items-center gap-1"
                                >
                                  <span>X:</span>
                                  <span className="underline underline-offset-2">{item.twitter_url}</span>
                                </a>
                              )}
                              {item.github_url && (
                                <a
                                  href={item.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-white flex items-center gap-1"
                                >
                                  <span>GitHub:</span>
                                  <span className="underline underline-offset-2">{item.github_url}</span>
                                </a>
                              )}
                              <span>Polar ID: <code className="text-white/60">{item.checkout_id || item.polar_checkout_id || 'N/A'}</code></span>
                              <span>Submitted: {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex sm:flex-col items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleAction(item.id, 'approve')}
                                disabled={actionLoadingId === item.id}
                                className="w-full px-5 py-2.5 rounded-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(item.id, 'reject')}
                                disabled={actionLoadingId === item.id}
                                className="w-full px-5 py-2.5 rounded-full text-xs font-medium border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handleAction(item.id, 'reject')}
                              disabled={actionLoadingId === item.id}
                              className="px-4 py-2 rounded-full text-xs font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              Revoke Approval
                            </button>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleAction(item.id, 'approve')}
                              disabled={actionLoadingId === item.id}
                              className="px-4 py-2 rounded-full text-xs font-medium text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

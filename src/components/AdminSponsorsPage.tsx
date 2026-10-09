import React, { useState, useEffect } from 'react';
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
  onNavigateHome,
  showToast,
}: AdminSponsorsPageProps) {
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
        setAuthError('Invalid admin key.');
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
      showToast?.(`Sponsorship ${action === 'approve' ? 'approved' : 'rejected'}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      triggerHaptic('error');
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

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
    <div className="w-full min-h-dvh bg-black text-neutral-50 font-sans">
      <div className="max-w-[720px] mx-auto px-4 pt-24 pb-20">
        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-[40px] leading-[48px] font-bold tracking-tighter m-0">
            Review
          </h1>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => fetchSponsors(adminKey)}
                disabled={loading}
                className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 disabled:opacity-40"
              >
                {loading ? 'Refreshing' : 'Refresh'}
              </button>
            )}
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
            >
              Site
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="mt-12 max-w-[360px]">
            <label className="block text-[14px] leading-[20px] font-medium text-white/50 mb-1.5">
              Secret key
            </label>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="password"
                required
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter secret key..."
                className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
              />
              {authError && <p className="text-xs text-red-400 m-0">{authError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-full bg-neutral-50 text-black text-sm font-medium hover:bg-neutral-300 transition-colors cursor-pointer border-0 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Unlock'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Tabs: 16px under title */}
            <div className="mt-4 flex items-center gap-6">
              {(['pending', 'approved', 'all'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const label = tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Approved' : 'All';
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-1 text-sm font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${
                      isActive ? 'text-neutral-50' : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/40" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search: mt-6 */}
            <div className="mt-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-11 w-full rounded-[10px] bg-white/[0.04] px-3.5 text-sm text-neutral-50 placeholder:text-white/25 outline-none focus:bg-white/[0.07] border-0 transition-colors"
              />
            </div>

            {/* Empty State */}
            {filteredSponsors.length === 0 ? (
              <div className="mt-16 text-white/40 text-sm">
                <p className="m-0">Nothing in this queue.</p>
                <p className="m-0 mt-1">Approved and pending sponsors will show here.</p>
              </div>
            ) : (
              <div className="mt-6">
                {filteredSponsors.map((item) => {
                  const isPending =
                    item.status === 'pending_review' ||
                    (item.status !== 'approved' && item.status !== 'rejected');
                  const isApproved = item.status === 'approved';
                  const isRejected = item.status === 'rejected';

                  const displayName =
                    item.company || item.company_name || item.name || 'Unnamed Sponsor';
                  const displayTier = item.tier.charAt(0).toUpperCase() + item.tier.slice(1);

                  return (
                    <div
                      key={item.id}
                      className="py-4 border-t border-white/[0.04] flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[16px] leading-[22px] font-medium text-neutral-50 truncate">
                          {displayName}
                        </div>
                        <div className="text-[14px] leading-[20px] text-white/40 truncate">
                          {displayTier} · {item.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAction(item.id, 'approve')}
                              disabled={actionLoadingId === item.id}
                              className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 disabled:opacity-40"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction(item.id, 'reject')}
                              disabled={actionLoadingId === item.id}
                              className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer border-0 bg-transparent p-0 disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'reject')}
                            disabled={actionLoadingId === item.id}
                            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer border-0 bg-transparent p-0 disabled:opacity-40"
                          >
                            Reject
                          </button>
                        )}
                        {isRejected && (
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'approve')}
                            disabled={actionLoadingId === item.id}
                            className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 disabled:opacity-40"
                          >
                            Approve
                          </button>
                        )}
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

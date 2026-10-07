import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export type SponsorshipPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed' | 'PENDING_PAYMENT' | 'PAID' | 'FAILED' | 'CANCELLED';
export type SponsorshipAdStatus = 'pending_review' | 'approved' | 'rejected' | 'cancelled' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type SponsorshipTier = 'diamond' | 'gold' | 'silver';

export interface SponsorshipRecord {
  id: string;
  placement: string;
  tier: SponsorshipTier;
  checkout_id?: string | null;
  polar_checkout_id?: string | null;
  polar_order_id?: string | null;
  polar_product_id?: string | null;
  payment_status: SponsorshipPaymentStatus;
  status?: 'pending_review' | 'approved' | 'rejected' | 'cancelled' | string;
  ad_status?: SponsorshipAdStatus;
  name?: string | null;
  company?: string | null;
  company_name: string;
  website?: string | null;
  site_url: string;
  email: string;
  logo_url?: string | null;
  logo_type?: string | null;
  description: string;
  twitter_url?: string | null;
  github_url?: string | null;
  price: number;
  currency: string;
  dodo_payment_id?: string | null;
  dodo_checkout_id?: string | null;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
}

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false },
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  return null;
}

// Local fallback store file path
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'sponsorships.json');

function loadLocalStore(): Record<string, SponsorshipRecord> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.warn('Could not read local sponsorships store:', err);
  }
  return {};
}

function saveLocalStore(store: Record<string, SponsorshipRecord>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write local sponsorships store to disk:', err);
  }
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

function checkProductionSupabase(supabase: SupabaseClient | null): void {
  if (isProduction() && !supabase) {
    throw new Error(
      'Supabase is not configured in production. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }
}

/**
 * Create a new sponsorship record
 */
export async function createSponsorshipRecord(
  record: SponsorshipRecord
): Promise<SponsorshipRecord> {
  const supabase = getSupabase();
  checkProductionSupabase(supabase);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .insert(record)
        .select()
        .single();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase insert error in production: ${error.message}`);
        }
        console.warn('Supabase insert failed in dev, falling back to local store:', error.message);
      } else if (data) {
        return data as SponsorshipRecord;
      }
    } catch (err) {
      if (isProduction()) throw err;
      console.warn('Supabase insert exception in dev, using local store:', err);
    }
  }

  // Local fallback (development only)
  const store = loadLocalStore();
  store[record.id] = record;
  saveLocalStore(store);
  return record;
}

/**
 * Get sponsorship by internal ID
 */
export async function getSponsorshipById(id: string): Promise<SponsorshipRecord | null> {
  const supabase = getSupabase();
  checkProductionSupabase(supabase);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase select error in production: ${error.message}`);
        }
        console.warn('Supabase select error in dev:', error.message);
      } else if (data) {
        return data as SponsorshipRecord;
      }
    } catch (err) {
      if (isProduction()) throw err;
      console.warn('Supabase select by id error in dev:', err);
    }
  }

  const store = loadLocalStore();
  return store[id] || null;
}

/**
 * Get sponsorship by Dodo payment ID or checkout ID
 */
export async function getSponsorshipByPaymentId(
  paymentId: string
): Promise<SponsorshipRecord | null> {
  const supabase = getSupabase();
  checkProductionSupabase(supabase);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .or(`dodo_payment_id.eq.${paymentId},dodo_checkout_id.eq.${paymentId}`)
        .maybeSingle();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase query error in production: ${error.message}`);
        }
        console.warn('Supabase select by paymentId error in dev:', error.message);
      } else if (data) {
        return data as SponsorshipRecord;
      }
    } catch (err) {
      if (isProduction()) throw err;
      console.warn('Supabase select by paymentId error in dev:', err);
    }
  }

  const store = loadLocalStore();
  for (const s of Object.values(store)) {
    if (s.dodo_payment_id === paymentId || s.dodo_checkout_id === paymentId) {
      return s;
    }
  }
  return null;
}

/**
 * Update an existing sponsorship record
 */
export async function updateSponsorshipRecord(
  id: string,
  updates: Partial<SponsorshipRecord>
): Promise<SponsorshipRecord | null> {
  const updatedRecord: Partial<SponsorshipRecord> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  checkProductionSupabase(supabase);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .update(updatedRecord)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase update error in production: ${error.message}`);
        }
        console.warn('Supabase update failed in dev, falling back to local store:', error.message);
      } else if (data) {
        return data as SponsorshipRecord;
      }
    } catch (err) {
      if (isProduction()) throw err;
      console.warn('Supabase update exception in dev, using local store:', err);
    }
  }

  const store = loadLocalStore();
  if (store[id]) {
    store[id] = { ...store[id], ...updatedRecord } as SponsorshipRecord;
    saveLocalStore(store);
    return store[id];
  }
  return null;
}

/**
 * Fetch all ACTIVE sponsorships that are currently within their valid date window
 */
/**
 * Fetch all APPROVED / ACTIVE sponsorships that are currently within their valid date window.
 * Strictly filters out 'pending_review', 'rejected', and 'cancelled' sponsorships.
 */
export async function getActiveSponsorships(): Promise<SponsorshipRecord[]> {
  const now = new Date().toISOString();
  const supabase = getSupabase();
  checkProductionSupabase(supabase);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .or(`status.eq.approved,and(status.is.null,ad_status.eq.ACTIVE)`)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback query if status column doesn't exist yet in Supabase
        const fallback = await supabase
          .from('sponsorships')
          .select('*')
          .eq('ad_status', 'ACTIVE')
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('created_at', { ascending: false });

        if (fallback.data) {
          return (fallback.data as SponsorshipRecord[]).filter(
            (r) => r.status !== 'pending_review' && r.status !== 'rejected' && r.status !== 'cancelled'
          );
        }
        if (isProduction()) {
          throw new Error(`Supabase fetch error in production: ${error.message}`);
        }
        console.warn('Supabase active sponsorships fetch failed in dev:', error.message);
      } else if (data) {
        return (data as SponsorshipRecord[]).filter(
          (r) => r.status !== 'pending_review' && r.status !== 'rejected' && r.status !== 'cancelled'
        );
      }
    } catch (err) {
      if (isProduction()) throw err;
      console.warn('Supabase query error in dev:', err);
    }
  }

  const store = loadLocalStore();
  const active: SponsorshipRecord[] = [];
  const currentTime = Date.now();

  for (const record of Object.values(store)) {
    const isApproved =
      (record.status === 'approved' || (!record.status && record.ad_status === 'ACTIVE')) &&
      record.status !== 'pending_review' &&
      record.status !== 'rejected' &&
      record.status !== 'cancelled';

    if (isApproved) {
      const startsAt = record.starts_at ? new Date(record.starts_at).getTime() : 0;
      const expiresAt = record.expires_at ? new Date(record.expires_at).getTime() : Infinity;

      if (currentTime >= startsAt && currentTime < expiresAt) {
        active.push(record);
      }
    }
  }

  return active;
}

/**
 * Check if a placement slot is already occupied by another ACTIVE sponsorship
 */
export async function isPlacementOccupied(
  placement: string,
  excludeSponsorshipId?: string
): Promise<boolean> {
  const active = await getActiveSponsorships();
  return active.some(
    (item) =>
      item.placement === placement &&
      (!excludeSponsorshipId || item.id !== excludeSponsorshipId)
  );
}

/**
 * Find sponsorship by Polar Checkout ID (supports both checkout_id and polar_checkout_id)
 */
export async function getSponsorshipByPolarCheckout(
  checkoutId: string
): Promise<SponsorshipRecord | null> {
  return getSponsorshipByCheckoutId(checkoutId);
}

/**
 * Find sponsorship by checkout ID
 */
export async function getSponsorshipByCheckoutId(
  checkoutId: string
): Promise<SponsorshipRecord | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .or(`polar_checkout_id.eq.${checkoutId},checkout_id.eq.${checkoutId}`)
        .maybeSingle();

      if (!error && data) {
        return data as SponsorshipRecord;
      }
    } catch (err) {
      console.warn('Supabase query error:', err);
    }
  }

  const store = loadLocalStore();
  for (const record of Object.values(store)) {
    if (
      record.checkout_id === checkoutId ||
      record.polar_checkout_id === checkoutId ||
      record.id === checkoutId
    ) {
      return record;
    }
  }
  return null;
}

/**
 * Fetch all sponsorship records (for Admin / Review Flow)
 */
export async function getAllSponsorships(): Promise<SponsorshipRecord[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as SponsorshipRecord[];
      }
    } catch (err) {
      console.warn('Supabase getAllSponsorships error:', err);
    }
  }

  const store = loadLocalStore();
  const all = Object.values(store);
  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return all;
}


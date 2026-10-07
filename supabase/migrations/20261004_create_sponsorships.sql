-- Amicro Sponsorships Table Migration
-- Run this in your Supabase SQL Editor to initialize the sponsorships table.

CREATE TABLE IF NOT EXISTS sponsorships (
  id TEXT PRIMARY KEY,
  placement TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('diamond', 'gold', 'silver')),
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  site_url TEXT NOT NULL,
  logo_url TEXT,
  logo_type TEXT,
  email TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' 
    CHECK (payment_status IN ('PENDING_PAYMENT', 'PAID', 'FAILED', 'CANCELLED')),
  ad_status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (ad_status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED')),
  dodo_payment_id TEXT,
  dodo_checkout_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON sponsorships(ad_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_placement ON sponsorships(placement);
CREATE INDEX IF NOT EXISTS idx_sponsorships_dodo_payment ON sponsorships(dodo_payment_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_expires ON sponsorships(expires_at);

-- Row Level Security (RLS)
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read of active sponsorships within valid date range
CREATE POLICY "Public can view active sponsorships"
  ON sponsorships FOR SELECT
  USING (
    ad_status = 'ACTIVE' 
    AND (starts_at IS NULL OR starts_at <= NOW()) 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Policy: Allow service role full access for API serverless functions
CREATE POLICY "Service role full access"
  ON sponsorships FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

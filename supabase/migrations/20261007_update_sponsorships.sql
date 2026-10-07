-- Migration: Add Polar Checkout & Post-Payment Onboarding columns to sponsorships table
-- Safe for existing databases and fresh setups

-- 1. Add onboarding and Polar fields
ALTER TABLE IF EXISTS sponsorships
  ADD COLUMN IF NOT EXISTS checkout_id TEXT,
  ADD COLUMN IF NOT EXISTS polar_order_id TEXT,
  ADD COLUMN IF NOT EXISTS polar_product_id TEXT,
  ADD COLUMN IF NOT EXISTS polar_checkout_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 2. Ensure checkout_id is unique to prevent duplicate sponsorship records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_sponsorships_checkout_id'
  ) THEN
    ALTER TABLE sponsorships
      ADD CONSTRAINT uq_sponsorships_checkout_id UNIQUE (checkout_id);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_sponsorships_checkout_id ON sponsorships(checkout_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status_pending ON sponsorships(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_approved_at ON sponsorships(approved_at);

-- 4. Update RLS policy to allow public viewing only for approved sponsors
DROP POLICY IF EXISTS "Public can view active sponsorships" ON sponsorships;
CREATE POLICY "Public can view active sponsorships"
  ON sponsorships FOR SELECT
  USING (
    (status = 'approved' OR (ad_status = 'ACTIVE' AND status != 'pending_review'))
    AND (starts_at IS NULL OR starts_at <= NOW()) 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

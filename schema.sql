-- schema.sql
-- Tables for coupons and usage tracking.

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('FLAT', 'PERCENT')),
  discount_value NUMERIC NOT NULL,
  max_discount_amount NUMERIC,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  usage_limit_per_user INT,
  eligibility JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  coupon_code VARCHAR(100) NOT NULL,
  usage_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, coupon_code)
);

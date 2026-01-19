// db.js
// Small wrapper for pg Pool so other modules can run queries.
// Keep DB connection logic in one place.

const { Pool } = require('pg');
require('dotenv').config();

// If USE_MOCK_DB=true we provide a tiny in-memory mock DB that supports
// the specific queries used by the app (listing, inserting coupons and usage).
if (process.env.USE_MOCK_DB === 'true') {
  console.warn('Using in-memory MOCK DB (USE_MOCK_DB=true)');

  const coupons = [];
  const couponUsage = []; // { user_id, coupon_code, usage_count, updated_at }

  const now = () => new Date().toISOString();

  function normalizeRow(row) {
    // mimic DB row shape
    return Object.assign({ created_at: now(), updated_at: now() }, row);
  }

  async function query(text, params) {
    const t = (text || '').trim().toUpperCase();

    // Simple routing based on SQL patterns used in models
    if (t.startsWith('SELECT * FROM COUPONS WHERE CODE')) {
      const code = params[0];
      const row = coupons.find(c => c.code === code) || null;
      return { rows: row ? [row] : [] };
    }

    if (t.startsWith('SELECT * FROM COUPONS ORDER BY')) {
      // return copy sorted by created_at desc
      const rows = coupons.slice().sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
      return { rows };
    }

    if (t.startsWith('INSERT INTO COUPONS')) {
      const [code, description, discountType, discountValue, maxDiscountAmount, startDate, endDate, usageLimitPerUser, eligibility] = params;
      const row = normalizeRow({ code, description, discount_type: discountType, discount_value: discountValue, max_discount_amount: maxDiscountAmount, start_date: startDate, end_date: endDate, usage_limit_per_user: usageLimitPerUser, eligibility });
      coupons.push(row);
      return { rows: [row] };
    }

    if (t.startsWith('SELECT USAGE_COUNT FROM COUPON_USAGE')) {
      const [userId, code] = params;
      const rec = couponUsage.find(r => r.user_id === userId && r.coupon_code === code);
      return { rows: rec ? [{ usage_count: rec.usage_count }] : [] };
    }

    if (t.startsWith('UPDATE COUPON_USAGE')) {
      const [userId, code] = params;
      const rec = couponUsage.find(r => r.user_id === userId && r.coupon_code === code);
      if (rec) {
        rec.usage_count += 1;
        rec.updated_at = now();
        return { rows: [rec] };
      }
      return { rows: [] };
    }

    if (t.startsWith('INSERT INTO COUPON_USAGE')) {
      const [userId, code] = params;
      const rec = { user_id: userId, coupon_code: code, usage_count: 1, updated_at: now() };
      couponUsage.push(rec);
      return { rows: [rec] };
    }

    // Fallback: return empty result to avoid crashes in unsupported queries
    console.warn('MOCK DB received unsupported query:', text);
    return { rows: [] };
  }

  module.exports = {
    query,
    pool: null
  };
  return;
}

// Real Postgres pool (used when not mocking)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

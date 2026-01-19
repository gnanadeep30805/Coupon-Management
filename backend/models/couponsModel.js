// models/couponsModel.js
// Functions that talk to the database. Keep SQL in one place so it's testable.

const db = require('../db');

function normalizeCouponRow(row) {
  if (!row) return row;
  if (row.eligibility) {
    if (typeof row.eligibility === 'string') {
      try {
        row.eligibility = JSON.parse(row.eligibility);
      } catch (err) {
        console.warn('Failed to parse eligibility JSON from DB row, defaulting to {}', err);
        row.eligibility = {};
      }
    }
  } else {
    row.eligibility = {};
  }
  return row;
}

/**
 * insertCoupon
 * Insert a coupon row and return the inserted row.
 */
async function insertCoupon(coupon) {
  const {
    code, description, discountType, discountValue,
    maxDiscountAmount, startDate, endDate, usageLimitPerUser, eligibility
  } = coupon;

  const text = `
    INSERT INTO coupons
      (code, description, discount_type, discount_value, max_discount_amount, start_date, end_date, usage_limit_per_user, eligibility)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *;
  `;
  const values = [
    code, description || null, discountType, discountValue,
    maxDiscountAmount || null, startDate, endDate,
    usageLimitPerUser || null, eligibility || {}
  ];

  const result = await db.query(text, values);
  return normalizeCouponRow(result.rows[0]);
}

/**
 * getAllCoupons
 * Fetch all coupons. Simple listing for admin/demo pages.
 */
async function getAllCoupons() {
  const result = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
  return result.rows.map(row => normalizeCouponRow(row));
}

/**
 * getCouponByCode
 * Retrieve a single coupon by code.
 */
async function getCouponByCode(code) {
  const result = await db.query('SELECT * FROM coupons WHERE code = $1', [code]);
  return normalizeCouponRow(result.rows[0]);
}

/**
 * getUsageCount
 * Return how many times a user used a coupon (0 if none).
 */
async function getUsageCount(userId, code) {
  const result = await db.query('SELECT usage_count FROM coupon_usage WHERE user_id = $1 AND coupon_code = $2', [userId, code]);
  if (!result.rows.length) return 0;
  return result.rows[0].usage_count;
}

/**
 * incrementUsage
 * Increase usage count for a (userId, code) pair. Insert if not exists.
 */
async function incrementUsage(userId, code) {
  // Try updating first
  const updateRes = await db.query(`
    UPDATE coupon_usage
      SET usage_count = usage_count + 1, updated_at = NOW()
    WHERE user_id = $1 AND coupon_code = $2
    RETURNING *;
  `, [userId, code]);

  if (updateRes.rows.length) return updateRes.rows[0];

  // Not present, insert new record
  const insertRes = await db.query(`
    INSERT INTO coupon_usage (user_id, coupon_code, usage_count, updated_at)
    VALUES ($1, $2, 1, NOW()) RETURNING *;
  `, [userId, code]);

  return insertRes.rows[0];
}

module.exports = {
  insertCoupon,
  getAllCoupons,
  getCouponByCode,
  getUsageCount,
  incrementUsage
};

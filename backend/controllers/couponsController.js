// controllers/couponsController.js
// Controller keeps request handling logic readable and explains business rules in comments.

const model = require('../models/couponsModel');
const { createCouponSchema, bestCouponSchema } = require('../validators/validators');

/**
 * createCoupon
 * Validate the request, insert coupon into DB,
 * and return the created coupon. Handle unique code gracefully.
 */
async function createCoupon(req, res, next) {
  try {
    // Validate payload; Joi will enforce types and return helpful messages.
    const { error, value } = createCouponSchema.validate(req.body, { convert: true });
    if (error) {
      // Make validation messages easy to read
      const messages = error.details.map(d => d.message).join('; ');
      return res.status(400).json({ error: messages });
    }

    // Insert into DB & return the created record
    try {
      const created = await model.insertCoupon({
        code: value.code,
        description: value.description,
        discountType: value.discountType,
        discountValue: value.discountValue,
        maxDiscountAmount: value.maxDiscountAmount,
        startDate: value.startDate,
        endDate: value.endDate,
        usageLimitPerUser: value.usageLimitPerUser,
        eligibility: value.eligibility
      });

      return res.status(201).json({ coupon: created });
    } catch (dbErr) {
      // Handle duplicate code (unique constraint)
      if (dbErr.code === '23505') {
        return res.status(409).json({ error: 'Coupon code already exists' });
      }
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
}

/**
 * listCoupons
 * Return all coupons for display on admin UI.
 */
async function listCoupons(req, res, next) {
  try {
    const coupons = await model.getAllCoupons();
    res.json({ coupons });
  } catch (err) {
    next(err);
  }
}

/**
 * Helper: computeCartValue
 * Sum unitPrice * quantity for all items.
 */
function computeCartValue(cart) {
  return cart.items.reduce((sum, it) => sum + (Number(it.unitPrice) * Number(it.quantity)), 0);
}

/**
 * Helper: checkEligibility
 * Evaluate eligibility JSON against the user and cart.
 * Return { ok: true } or { ok: false, reason: '...' }.
 *
 * Keep checks defensive and simple so business logic is easy to reason about.
 */
function checkEligibility(eligibility, user, cart) {
  if (!eligibility || Object.keys(eligibility).length === 0) return { ok: true };

  // User rules
  if (eligibility.allowedUserTiers && eligibility.allowedUserTiers.length && !eligibility.allowedUserTiers.includes(user.userTier)) {
    return { ok: false, reason: 'User tier not allowed' };
  }

  if (typeof eligibility.minLifetimeSpend === 'number' && user.lifetimeSpend < eligibility.minLifetimeSpend) {
    return { ok: false, reason: 'Lifetime spend below required threshold' };
  }

  if (typeof eligibility.minOrdersPlaced === 'number' && user.ordersPlaced < eligibility.minOrdersPlaced) {
    return { ok: false, reason: 'Not enough past orders' };
  }

  if (eligibility.firstOrderOnly && user.ordersPlaced > 0) {
    return { ok: false, reason: 'Not a first-time buyer' };
  }

  if (eligibility.allowedCountries && eligibility.allowedCountries.length && !eligibility.allowedCountries.includes(user.country)) {
    return { ok: false, reason: 'Country not allowed' };
  }

  // Cart rules
  const cartValue = computeCartValue(cart);
  if (typeof eligibility.minCartValue === 'number' && cartValue < eligibility.minCartValue) {
    return { ok: false, reason: 'Cart value too low' };
  }

  if (eligibility.applicableCategories && eligibility.applicableCategories.length) {
    const matches = cart.items.some(it => eligibility.applicableCategories.includes(it.category));
    if (!matches) return { ok: false, reason: 'No applicable categories in cart' };
  }

  if (eligibility.excludedCategories && eligibility.excludedCategories.length) {
    const found = cart.items.some(it => eligibility.excludedCategories.includes(it.category));
    if (found) return { ok: false, reason: 'Cart contains excluded categories' };
  }

  if (typeof eligibility.minItemsCount === 'number') {
    const totalItems = cart.items.reduce((s, it) => s + Number(it.quantity), 0);
    if (totalItems < eligibility.minItemsCount) return { ok: false, reason: 'Not enough items in cart' };
  }

  return { ok: true };
}

/**
 * computeDiscountForCoupon
 * Given coupon DB row and cartValue, calculate the discount amount.
 * For percent coupons, cap by max_discount_amount if provided.
 */
function computeDiscountForCoupon(couponRow, cartValue) {
  if (couponRow.discount_type === 'FLAT') {
    return Number(couponRow.discount_value);
  }
  // PERCENT
  const percent = Number(couponRow.discount_value);
  let discount = (percent / 100.0) * cartValue;
  if (couponRow.max_discount_amount !== null && couponRow.max_discount_amount !== undefined) {
    discount = Math.min(discount, Number(couponRow.max_discount_amount));
  }
  return discount;
}

/**
 * bestCoupon
 * Validate request, load coupons, filter and compute discounts,
 * apply deterministic tie-breakers and return the winner.
 */
async function bestCoupon(req, res, next) {
  try {
    // Validate input payload
    const { error, value } = bestCouponSchema.validate(req.body, { convert: true });
    if (error) {
      const messages = error.details.map(d => d.message).join('; ');
      return res.status(400).json({ error: messages });
    }

    const { user, cart } = value;
    const coupons = await model.getAllCoupons();
    const now = new Date();

    const candidates = [];

    // Evaluate coupons one-by-one. We continue on errors so one bad coupon doesn't fail the request.
    for (const c of coupons) {
      try {
        // Date check: coupon must be active now
        const start = new Date(c.start_date);
        const end = new Date(c.end_date);
        if (start > now || end < now) continue;

        // Usage limit per user
        if (c.usage_limit_per_user) {
          const used = await model.getUsageCount(user.userId, c.code);
          if (used >= c.usage_limit_per_user) continue;
        }

        // Eligibility checks
        const eligibility = c.eligibility || {};
        const ev = checkEligibility(eligibility, user, cart);
        if (!ev.ok) continue;

        // Discount calculation
        const cartValue = computeCartValue(cart);
        const discount = computeDiscountForCoupon(c, cartValue);

        // No point in coupons that give zero or negative discount
        if (!(discount > 0)) continue;

        candidates.push({
          coupon: c,
          discount: Number(discount)
        });
      } catch (innerErr) {
        // Log and skip problematic coupon rows
        console.error('Error evaluating coupon', c.code, innerErr);
        continue;
      }
    }

    // If no candidate found, return explicit null
    if (candidates.length === 0) {
      return res.json({ bestCoupon: null, discount: 0 });
    }

    // Sort according to rules:
    // 1) Highest discount
    // 2) If tie -> earliest end_date
    // 3) If still tie -> lexicographically smaller code
    candidates.sort((a, b) => {
      if (b.discount !== a.discount) return b.discount - a.discount;
      const aEnd = new Date(a.coupon.end_date), bEnd = new Date(b.coupon.end_date);
      if (aEnd.getTime() !== bEnd.getTime()) return aEnd - bEnd;
      return a.coupon.code.localeCompare(b.coupon.code);
    });

    const winner = candidates[0];

    // Return a clean object to the client (no internal DB fields needed)
    return res.json({
      bestCoupon: {
        code: winner.coupon.code,
        description: winner.coupon.description,
        discountType: winner.coupon.discount_type,
        discountValue: winner.coupon.discount_value,
        maxDiscountAmount: winner.coupon.max_discount_amount,
        startDate: winner.coupon.start_date,
        endDate: winner.coupon.end_date,
        eligibility: winner.coupon.eligibility
      },
      discount: winner.discount
    });
  } catch (err) {
    next(err);
  }
}

/**
 * markCouponUsed
 * Small helper for demo flows: increment usage for a user/coupon.
 * Useful to test usage limits.
 */
async function markCouponUsed(req, res, next) {
  try {
    const { code } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required in the body' });

    const coupon = await model.getCouponByCode(code);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    const record = await model.incrementUsage(userId, code);
    res.json({ usage: record });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCoupon,
  listCoupons,
  bestCoupon,
  markCouponUsed
};

// validators/validators.js
// Joi schemas for request validation. This keeps controller code readable.

const Joi = require('joi');

// Eligibility schema (all fields optional)
const eligibilitySchema = Joi.object({
  allowedUserTiers: Joi.array().items(Joi.string()).optional(),
  minLifetimeSpend: Joi.number().min(0).optional(),
  minOrdersPlaced: Joi.number().integer().min(0).optional(),
  firstOrderOnly: Joi.boolean().optional(),
  allowedCountries: Joi.array().items(Joi.string()).optional(),
  minCartValue: Joi.number().min(0).optional(),
  applicableCategories: Joi.array().items(Joi.string()).optional(),
  excludedCategories: Joi.array().items(Joi.string()).optional(),
  minItemsCount: Joi.number().integer().min(0).optional()
}).optional();

// Schema for creating a coupon
const createCouponSchema = Joi.object({
  code: Joi.string().max(100).required(),
  description: Joi.string().allow('').optional(),
  discountType: Joi.string().valid('FLAT', 'PERCENT').required(),
  discountValue: Joi.number().positive().required(),
  maxDiscountAmount: Joi.number().positive().optional().allow(null),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  usageLimitPerUser: Joi.number().integer().min(1).optional().allow(null),
  eligibility: eligibilitySchema
});

// Schema for best-coupon request
const bestCouponSchema = Joi.object({
  user: Joi.object({
    userId: Joi.string().required(),
    userTier: Joi.string().required(),
    country: Joi.string().required(),
    lifetimeSpend: Joi.number().min(0).required(),
    ordersPlaced: Joi.number().integer().min(0).required()
  }).required(),
  cart: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        category: Joi.string().required(),
        unitPrice: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).required()
  }).required()
});

module.exports = {
  createCouponSchema,
  bestCouponSchema
};

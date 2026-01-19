// routes/coupons.js
// Define the API routes for coupons. Keep routes thin; controllers handle logic.

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponsController');

// Create a new coupon
router.post('/', ctrl.createCoupon);

// List all coupons
router.get('/', ctrl.listCoupons);

// Determine best coupon for a user + cart
router.post('/best', ctrl.bestCoupon);

// Mark a coupon used by a user (demo/testing helper)
router.post('/use/:code', ctrl.markCouponUsed);

module.exports = router;

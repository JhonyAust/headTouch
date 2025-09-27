// routes/couponRoutes.js
const express = require("express");
const {
    createCoupon,
    validateCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
} = require("../../controllers/admin/coupon-controller");

const router = express.Router();

// Admin
router.post("/create", createCoupon);
router.get("/all", getAllCoupons);
router.put("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);

// User
router.post("/validate", validateCoupon);

module.exports = router;
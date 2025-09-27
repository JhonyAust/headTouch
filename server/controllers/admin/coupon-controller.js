const Coupon = require("../../models/Coupon");

// Admin - create coupon
const createCoupon = async(req, res) => {
    try {
        const { name, code, discountPercentage, expiryDate } = req.body;
        const coupon = new Coupon({ name, code, discountPercentage, expiryDate });
        await coupon.save();
        res.json({ success: true, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// User - validate coupon
const validateCoupon = async(req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon" });
        }

        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return res.status(400).json({ success: false, message: "Coupon expired" });
        }

        res.json({ success: true, discount: coupon.discountPercentage, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAllCoupons = async(req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateCoupon = async(req, res) => {
    try {
        const { id } = req.params;
        const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteCoupon = async(req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 👇 Export with CommonJS
module.exports = {
    createCoupon,
    validateCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
};
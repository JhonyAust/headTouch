const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date }, // optional
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
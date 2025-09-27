const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Summer Sale"
    code: { type: String, required: true, unique: true }, // e.g. "SUMMER20"
    discountPercentage: { type: Number, required: true }, // e.g. 20
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date }, // optional
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
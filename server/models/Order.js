const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    cartItems: [{
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
        size: String,
    }, ],
    addressInfo: {
        name: String,
        addressId: String,
        address: String,
        city: String,
        pincode: String,
        phone: String,
        notes: String,
    },
    couponCode: { type: String, default: null },
    discountPercentage: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    orderStatus: String, // e.g. 'confirmed', 'pending'
    paymentMethod: String, // e.g. 'cash_on_delivery'
    paymentStatus: String, // e.g. 'paid', 'unpaid'
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
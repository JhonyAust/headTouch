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
        addressId: String,
        address: String,
        city: String,
        pincode: String,
        phone: String,
        notes: String,
    },
    orderStatus: String, // e.g. 'confirmed', 'pending'
    paymentMethod: String, // e.g. 'cash_on_delivery'
    paymentStatus: String, // e.g. 'paid', 'unpaid'
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
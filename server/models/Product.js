const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    images: [String],
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    sizes: [ // ✅ multiple sizes with stock
        {
            value: { type: String, required: true },
            stock: { type: Number, default: 1 },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
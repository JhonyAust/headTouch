const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async(req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } =
        req.body;

        // Validation checks
        if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
            return res.status(400).json({
                success: false,
                message: "⚠️ All fields are required to submit a review",
            });
        }

        if (reviewValue < 1 || reviewValue > 5) {
            return res.status(400).json({
                success: false,
                message: "⭐ Please provide a rating between 1 and 5 stars",
            });
        }

        // Check if user has purchased the product
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
        });

        if (!order) {
            return res.status(403).json({
                success: false,
                message: "🛍️ You need to purchase this product before leaving a review",
            });
        }

        // Check for existing review
        const checkExistingReview = await ProductReview.findOne({
            productId,
            userId,
        });

        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: "✍️ You've already reviewed this product. You can only review once!",
            });
        }

        // Create new review
        const newReview = new ProductReview({
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue,
        });

        await newReview.save();

        // Update product average review
        const reviews = await ProductReview.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview =
            reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
            totalReviewsLength;

        await Product.findByIdAndUpdate(productId, { averageReview });

        res.status(201).json({
            success: true,
            message: "🎉 Review submitted successfully! Thank you for your feedback",
            data: newReview,
        });
    } catch (e) {
        console.error("Error in addProductReview:", e);
        res.status(500).json({
            success: false,
            message: "❌ Something went wrong while submitting your review. Please try again later",
        });
    }
};

const getProductReviews = async(req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const reviews = await ProductReview.find({ productId });

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (e) {
        console.error("Error in getProductReviews:", e);
        res.status(500).json({
            success: false,
            message: "❌ Failed to load reviews. Please refresh the page",
        });
    }
};

module.exports = { addProductReview, getProductReviews };
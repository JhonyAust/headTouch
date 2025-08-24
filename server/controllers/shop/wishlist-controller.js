const Wishlist = require("../../models/WishList");

exports.toggleWishlist = async(req, res) => {
    const { userId, productId } = req.body;

    // 🛡️ Add guard against undefined or invalid IDs
    if (!userId || !productId ||
        typeof userId !== 'string' || typeof productId !== 'string' ||
        userId.length !== 24 || productId.length !== 24
    ) {
        return res.status(400).json({ error: "Valid userId and productId are required." });
    }

    try {
        let wishlist = await Wishlist.findOne({ user: userId });
        console.log("Wishlist before", wishlist);

        if (!wishlist || wishlist == null) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId],
            });
            console.log("Wishlist", wishlist);
        } else {
            const index = wishlist.products.indexOf(productId);
            console.log("Index", index);
            if (index > -1) {
                wishlist.products.splice(index, 1);
            } else {
                wishlist.products.push(productId);
            }
            await wishlist.save();
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist updated successfully",
            products: wishlist.products,

        });
    } catch (error) {
        console.error("Toggle wishlist error:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

exports.getUserWishlist = async(req, res) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

        if (!wishlist) {
            return res.status(200).json({ products: [] }); // Return empty array if no wishlist
        }

        res.status(200).json({ products: wishlist.products });
    } catch (error) {
        console.error("Fetch wishlist error:", error);
        res.status(500).json({ error: "Server error while fetching wishlist" });
    }
};
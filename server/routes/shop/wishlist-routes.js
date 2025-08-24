const express = require("express");
const router = express.Router();
const { toggleWishlist, getUserWishlist } = require("../../controllers/shop/wishlist-controller");

router.post("/toggle", toggleWishlist);
router.get("/:userId", getUserWishlist); // ✅ Get wishlist by user ID

module.exports = router;
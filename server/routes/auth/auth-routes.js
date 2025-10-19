// routes/auth/auth-routes.js
const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
    googleLogin,
    forgotPassword,
    verifyResetToken,
    resetPassword,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Existing routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "Authenticated user!",
        user,
    });
});

// 🔐 NEW: Forgot Password routes
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
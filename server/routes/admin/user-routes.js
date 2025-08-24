const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  adminMiddleware,
} = require("../../controllers/auth/auth-controller"); 

const { getAllUsers,getWeeklyUserStats } = require("../../controllers/admin/user-controller");

// Protected admin route
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
// routes/admin/user-routes.js
router.get("/stats/weekly", authMiddleware, adminMiddleware, getWeeklyUserStats);


module.exports = router;

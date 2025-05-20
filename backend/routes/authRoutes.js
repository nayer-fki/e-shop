const express = require("express");
const router = express.Router();
const { login, logout, register, getUserDetails } = require("../handlers/authHandler");

// Utility function to wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Login Route
router.post("/login", asyncHandler(login));

// Logout Route
router.post("/logout", asyncHandler(logout));

// Register Route
router.post("/register", asyncHandler(register));

// Get Current User Route (/me)
router.get("/me", asyncHandler(getUserDetails));

module.exports = router;

const express = require("express");
const router = express.Router();
const { login, logout, register, getUserDetails } = require("../handlers/authHandler"); // Import getUserDetails function

// Login Route
router.post("/login", login);

// Logout Route
router.post("/logout", logout);

// Register Route
router.post("/register", register);

// Get Current User Route (/me)
router.get("/me", getUserDetails);

module.exports = router;  // Export the router

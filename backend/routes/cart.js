const express = require("express");
const router = express.Router();
const cartHandler = require("../handlers/cart");

// Existing routes
router.post("/add", cartHandler.addToCart);
router.delete("/remove/:email/:productId", cartHandler.removeFromCart);
router.get("/:userId", cartHandler.getCart);

// New route for getting a cart by email
router.get("/email/:email", cartHandler.getCartByEmail);

module.exports = router;

const express = require("express");
const router = express.Router();
const wishlistHandler = require("../handlers/wishlist");

router.post("/add", wishlistHandler.addToWishList);
router.delete("/remove/:email/:productId", wishlistHandler.removeFromWishList);
router.get("/:userId", wishlistHandler.getWishList);

module.exports = router;

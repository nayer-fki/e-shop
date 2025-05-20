const WishList = require("../db/wishlist");
const User = require("../db/user");
exports.addToWishList = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        let wishlist = await WishList.findOne({ userId });
        if (!wishlist) {
            wishlist = new WishList({ userId, products: [] });
        }

        const exists = wishlist.products.find(p => p.productId.toString() === productId);
        if (!exists) {
            wishlist.products.push({ productId });
            await wishlist.save();
        }

        res.status(200).send(wishlist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.removeFromWishList = async (req, res) => {
    const { email, productId } = req.params;  // Extract email and productId from request parameters

    try {
        const user = await User.findOne({ email });  // Find user by email
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const wishlist = await WishList.findOne({ userId: user._id });  // Find wishlist by user's ID
        if (!wishlist) {
            return res.status(404).send({ message: "Wishlist not found" });
        }

        // Remove the product from the wishlist
        wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
        await wishlist.save();  // Save updated wishlist

        res.status(200).send(wishlist);  // Return updated wishlist
    } catch (error) {
        res.status(500).send({ error: error.message });  // Handle errors
    }
};

exports.getWishList = async (req, res) => {
    const { userId } = req.params;

    try {
        const wishlist = await WishList.findOne({ userId }).populate("products.productId");
        if (!wishlist) {
            return res.status(404).send({ message: "Wishlist is empty" });
        }

        res.status(200).send(wishlist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

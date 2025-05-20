const Cart = require("../db/cart");
const User = require("../db/user"); // Import your User model
const Product = require('../db/product');

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { email, productId } = req.params;   // Extract email and productId from params

    try {
        // Find the user's document by email
        const user = await User.findOne({ email });  
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Find the user's cart using the userId from the user document
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        // Filter the products array to remove the product with the given productId
        cart.products = cart.products.filter(product => product.productId.toString() !== productId);

        // Save the updated cart back to the database
        await cart.save();

        // Send back the updated cart
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId");
        if (!cart) {
            return res.status(404).send({ message: "Cart is empty" });
        }

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// Backend: Get cart by email


exports.getCartByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Find cart by userId and populate productId with Product details
    const cart = await Cart.findOne({ userId: user._id })
      .populate('products.productId'); // Populate productId with details from Product model

    if (!cart || cart.products.length === 0) {
      return res.status(404).send({ message: 'Cart is empty' });
    }

    // Successfully found and populated cart
    res.status(200).send(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send({ error: error.message });
  }
};



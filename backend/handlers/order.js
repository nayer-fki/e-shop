// Assuming you are working with Order, Cart, and User models as you showed before
const mongoose = require('mongoose'); 
const Order = require("../db/order");
const Cart = require("../db/cart");
const User = require("../db/user"); // Assuming User model exists for email look-up
const Product = require("../db/product"); 




// Function to create an order based on email
exports.createOrder = async (req, res) => {
    const { email } = req.body;  // Get email from request body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const cart = await Cart.findOne({ userId: user._id }).populate("products.productId");
        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ message: "Cart is empty" });
        }

        const order = new Order({
            userId: user._id,
            products: cart.products.map(item => ({
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
            })),
            totalPrice: cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0),
            status: "pending",
            orderDate: new Date().toISOString(),
        });

        await order.save();
        await Cart.deleteOne({ userId: user._id });

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// Function to create an order based on userId
exports.createOrderFromUserId = async (req, res) => {
    const { userId } = req.body;  // Get userId from request body
    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Find the cart associated with the userId
        const cart = await Cart.findOne({ userId: user._id }).populate("products.productId");
        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ message: "Cart is empty" });
        }

        // Create an order from the cart products
        const order = new Order({
            userId: user._id,
            products: cart.products.map(item => ({
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
            })),
            totalPrice: cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0),
            status: "pending",
            orderDate: new Date().toISOString(),
        });

        // Save the order to the database
        await order.save();

        // Optionally, clear the user's cart after creating the order
        await Cart.deleteOne({ userId: user._id });

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};





// Function to fetch all orders
exports.getOrders = async (req, res) => {
    try {
        // Retrieve all orders from the Order collection and sort by orderDate (latest first)
        const orders = await Order.find().sort({ orderDate: -1 });

        // If no orders found, return a message
        if (orders.length === 0) {
            return res.status(404).send({ message: "No orders found" });
        }

        // Return the fetched orders
        res.status(200).send(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ error: error.message });
    }
};

// Fetch user's orders by email
exports.getOrdersemail = async (req, res) => {
    const { email } = req.params;  // Get email from request parameters
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const orders = await Order.find({ userId: user._id }).populate("products.productId");
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update order status function (For Admin use)
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Get orderId from URL params
    const { status } = req.body;    // Get status from request body
  
    try {
      // Find the order by orderId and update its status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }  // Return the updated order
      );
  
      if (!updatedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }
  
      // Return the updated order details
      res.status(200).send(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send({ error: error.message });
    }
};

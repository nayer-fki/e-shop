const express = require("express");
const router = express.Router();
const orderHandler = require("../handlers/order");

// Create a new order
router.post("/create", orderHandler.createOrder);

router.post("/creates", orderHandler.createOrderFromUserId);



// Get orders by email
router.get("/:userId", orderHandler.getOrdersemail);

// Fetch all orders (Admin access, view all orders)
router.get("", orderHandler.getOrders);

// Update order status (For Admin use)
router.put("/:orderId/status", orderHandler.updateOrderStatus);


module.exports = router;

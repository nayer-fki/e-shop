const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Order Schema
const orderSchema = new Schema({
    userId: { type: String, required: true }, // Changed to string to match the TypeScript interface
    products: [
        {
            name: { type: String, required: true }, // Product name
            price: { type: Number, required: true }, // Product price
            quantity: { type: Number, required: true }, // Product quantity
        }
    ],
    totalPrice: { type: Number, required: true }, // Total price of the order
    status: { type: String, required: true, default: "pending" }, // Order status (e.g., 'pending', 'confirmed')
    orderDate: { type: String, default: () => new Date().toISOString() }, // Order creation date as a string
});

// Create the Order model using the schema
const Order = mongoose.model("Order", orderSchema);

// Export the model
module.exports = Order;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Import routes
const categoryRouter = require("./routes/category");
const brandRouter = require("./routes/brand");
const productRouter = require("./routes/product");
const uploadRoutes = require('./routes/upload');
const userRouter = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); 
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const wishlistRouter = require("./routes/wishlist");


// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/e-comm-store-db");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Exit the process with failure
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRouter);
app.use('/upload', uploadRoutes);
app.use("/users", userRouter);
app.use("/auth", authRoutes); 
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/wishlist", wishlistRouter);



// Home route
app.get("/", (req, res) => {
    res.send("Server running");
});

// Start server
const startServer = async () => {
    await connectDB(); // Ensure DB connection before starting the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer();

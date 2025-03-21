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
const userRouter = require("./routes/userRoutes"); // Import user routes
const authRoutes = require("./routes/authRoutes");

// Database connection
const conncetdb = async () => {
    await mongoose.connect("mongodb://localhost:27017", { dbName: "e-comm-store-db" });
    console.log("MongoDB connected");
};

conncetdb().catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRouter);
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/upload', uploadRoutes);
app.use("/users", userRouter);
app.use("/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

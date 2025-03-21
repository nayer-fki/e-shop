const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: String,
});

const Category = mongoose.model("Category", categorySchema);  // Ensure the model is registered as "Category"
module.exports = Category;

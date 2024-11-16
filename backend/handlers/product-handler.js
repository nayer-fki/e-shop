const Product = require("./../db/product"); // Import the product model
const mongoose = require("mongoose"); // Add mongoose import

// Add a new product
async function addProduct(model) {
    // Validate that model.name exists and is a string
    if (!model.name || typeof model.name !== "string") {
        throw new Error("Product name is required and should be a non-empty string");
    }

    if (!model.price || isNaN(model.price)) {
        throw new Error("Price is required and should be a valid number");
    }

    if (!model.categoryId) {
        throw new Error("Category ID is required");
    }

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name: model.name.trim() });

    if (existingProduct) {
        // If product already exists, return an error message
        throw new Error("Product with the same name already exists");
    }

    // Create a new instance of the Product model with the provided data
    let product = new Product({
        name: model.name.trim(),
        shortDescription: model.shortDescription,
        description: model.description,
        price: mongoose.Types.Decimal128.fromString(model.price.toString()), // Convert price to Decimal128
        discount: model.discount,
        images: model.images,
        categoryId: model.categoryId,
    });

    try {
        // Save the product in the database
        await product.save();
        return product.toObject(); // Return the saved product object
    } catch (err) {
        // Handle any errors (e.g., database issues)
        throw new Error("Error creating product: " + err.message);
    }
}

// Get all products
async function getProducts() {
    try {
        let products = await Product.find().populate("categoryId"); // Populate category information
        return products.map((p) => ({
            ...p.toObject(),
            price: p.price.toString(), // Convert Decimal128 to string for display
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

// Get product by ID
async function getProductById(id) {
    try {
        let product = await Product.findById(id).populate("categoryId");
        if (!product) throw new Error("Product not found");
        return {
            ...product.toObject(),
            price: product.price.toString(), // Convert Decimal128 to string for display
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

// Update product by ID
async function updateProduct(id, model) {
    // Validate ID format using Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }

    try {
        if (model.price) {
            // Convert price to Decimal128 if provided
            model.price = mongoose.Types.Decimal128.fromString(model.price.toString());
        }

        // Find and update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id }, // Find product by ID
            model, // Update data
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            throw new Error("Product not found");
        }

        return {
            ...updatedProduct.toObject(),
            price: updatedProduct.price.toString(), // Convert Decimal128 to string for display
        };
    } catch (err) {
        console.error("Error during update:", err);
        throw new Error("Error updating product: " + err.message);
    }
}

// Delete product by ID
async function deleteProduct(id) {
    try {
        const deleteResult = await Product.deleteOne({ _id: id });
        if (deleteResult.deletedCount === 0) {
            throw new Error("Product not found");
        }
        return deleteResult; // Return the deletion result
    } catch (err) {
        console.error("Error deleting product:", err);
        throw new Error("Error deleting product");
    }
}

module.exports = { addProduct, updateProduct, deleteProduct, getProducts, getProductById };

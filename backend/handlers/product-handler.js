const Product = require("./../db/product"); // Import Product model
const Category = require("./../db/category"); // Import Category model
const mongoose = require("mongoose"); // Mongoose

// Helper function for price validation
function validatePrice(price) {
    if (isNaN(price) || Number(price) <= 0) {
        throw new Error("Price is required and should be a valid number greater than 0.");
    }
    return mongoose.Types.Decimal128.fromString(price.toString());
}

// Helper function for URL validation
function validateImageUrl(url, index) {
    if (typeof url !== "string" || !url.startsWith("http")) {
        throw new Error(`Invalid image URL at index ${index}. URLs must start with 'http'.`);
    }
}

// Add a new product
async function addProduct(model) {
    try {
        // Validate required fields
        if (!model.name || typeof model.name !== "string" || !model.name.trim()) {
            throw new Error("Product name is required and should be a non-empty string.");
        }

        // Validate price
        const price = validatePrice(model.price);

        // Validate the category ID
        if (!model.categoryId || typeof model.categoryId !== "string") {
            throw new Error("Category ID is required and should be a valid string.");
        }

        // Validate optional discount
        if (model.discount !== undefined && (isNaN(model.discount) || model.discount < 0 || model.discount > 100)) {
            throw new Error("Discount, if provided, should be a valid number between 0 and 100.");
        }

        // Validate images
        if (model.images && !Array.isArray(model.images)) {
            throw new Error("Images should be an array of strings.");
        }

        if (model.images) {
            model.images.forEach((image, i) => validateImageUrl(image, i));
        }

        // Create the new product
        const newProduct = new Product({
            name: model.name.trim(),
            shortDescription: model.shortDescription?.trim() || null,
            description: model.description?.trim() || null,
            price: price, // Use the validated and converted price
            discount: model.discount || 0,
            images: model.images || [], // Use validated image URLs
            categoryId: model.categoryId.trim(),
        });

        // Save the product to the database
        await newProduct.save();
        return newProduct; // Return the saved product
    } catch (err) {
        throw new Error(`Error creating product: ${err.message}`);
    }
}

// Get all products
async function getProducts() {
    try {
        let products = await Product.find().populate("categoryId"); // Populate the categoryId field
        return products.map((p) => ({
            ...p.toObject(),
            price: p.price.toString(), // Convert price to string for easier display
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Error fetching products");
    }
}

// Update an existing product

async function updateProduct(id, model) {
    try {
        // Validate product ID format using Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid product ID format.");
        }

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Product not found.");
        }

        // Update fields if present in the model
        if (model.name) {
            product.name = model.name.trim(); // Trim spaces from the product name
        }
        if (model.shortDescription) {
            product.shortDescription = model.shortDescription.trim(); // Trim spaces from the short description
        }
        if (model.description) {
            product.description = model.description.trim(); // Trim spaces from the description
        }
        if (model.price !== undefined) {
            product.price = validatePrice(model.price); // Validate and update price
        }
        if (model.discount !== undefined) {
            // Validate discount if it's provided
            if (model.discount < 0 || model.discount > 100) {
                throw new Error("Discount must be between 0 and 100.");
            }
            product.discount = model.discount; // Update discount if valid
        }
        if (model.images) {
            // Ensure images are an array and validate each URL
            if (!Array.isArray(model.images)) {
                throw new Error("Images must be an array.");
            }
            model.images.forEach((url, i) => validateImageUrl(url, i)); // Validate each image URL
            product.images = model.images; // Update validated images
        }
        if (model.categoryId) {
            // Validate categoryId format before updating
            if (!mongoose.Types.ObjectId.isValid(model.categoryId)) {
                throw new Error("Invalid category ID format.");
            }
            product.categoryId = model.categoryId.trim(); // Update category ID
        }

        // Save the updated product to the database
        await product.save();
        return product; // Return the updated product
    } catch (err) {
        console.error(`Error updating product: ${err.message}`);
        throw new Error(err.message); // Re-throw error for route handler to manage
    }
}


// Delete product by ID
async function deleteProduct(id) {
    try {
        const deleteResult = await Product.deleteOne({ _id: id }); // Delete product by ID
        if (deleteResult.deletedCount === 0) {
            throw new Error("Product not found");
        }
        return deleteResult; // Return the deletion result
    } catch (err) {
        console.error("Error deleting product:", err); // Log errors
        throw new Error("Error deleting product");
    }
}

// Get a product by its ID
async function getProductById(id) {
    try {
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid product ID format.");
        }

        // Find the product by ID
        const product = await Product.findById(id).populate("categoryId"); // Populate categoryId for better information

        if (!product) {
            throw new Error("Product not found.");
        }

        // Return the product
        return {
            ...product.toObject(),
            price: product.price.toString(), // Convert price to string for display
        };
    } catch (err) {
        console.error(`Error fetching product by ID: ${err.message}`);
        throw new Error(err.message); // Return error message if product is not found
    }
}

// Export all functions
module.exports = { addProduct, updateProduct, deleteProduct, getProducts, getProductById };

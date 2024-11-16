const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getProducts, getProductById } = require("../handlers/product-handler"); // Import product handlers

// POST route - Add a new product
router.post("", async (req, res) => {
  let model = req.body;

  // Validate the input
  if (!model.name || typeof model.name !== "string" || model.name.trim().length === 0) {
    return res.status(400).send({ error: "Product name is required and should be a non-empty string" });
  }

  // Validate price
  if (!model.price || isNaN(model.price) || Number(model.price) <= 0) {
    return res.status(400).send({ error: "Price is required and should be a number greater than 0" });
  }

  try {
    const product = await addProduct(model); // Call the addProduct function
    res.status(201).send(product); // Send the created product as the response
  } catch (error) {
    res.status(500).send({ error: error.message }); // Send an error message if something goes wrong
  }
});

// GET route - Get all products
router.get("", async (req, res) => {
  try {
    let result = await getProducts();
    res.send(result);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});

// GET route - Get product by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let result = await getProductById(id);
    res.send(result);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});

// PUT route - Update product
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const model = req.body;

  // Validate price
  if (model.price && (isNaN(model.price) || Number(model.price) <= 0)) {
    return res.status(400).send({ error: "Price should be a number greater than 0" });
  }

  try {
    const updatedProduct = await updateProduct(id, model); // Use updateProduct function

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// DELETE route - Delete product by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // Validate ID format using Mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  try {
    const result = await deleteProduct(id); // Call the deleteProduct function

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting product", error: error.message });
  }
});

// Export the router, not the individual functions
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getProducts,getProductById } = require("../handlers/product-handler"); // Import product handlers

// POST route - Add new product
router.post("", async (req, res) => {
  const model = req.body;

  try {
      const product = await addProduct(model); // Call addProduct function
      res.status(201).send(product); // Return the created product
  } catch (error) {
      console.error('Error adding product:', error.message); // Log the error
      res.status(500).send({ error: error.message }); // Return error
  }
});

// GET route - Get all products
router.get("", async (req, res) => {
  try {
    let result = await getProducts();
    res.send(result); // Return the list of products
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});

// PUT route in product.js
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const model = req.body;

  try {
      const updatedProduct = await updateProduct(id, model); // Call the updateProduct function
      res.status(200).send({
          message: "Product updated successfully",
          product: updatedProduct,
      });
  } catch (error) {
      console.error("Error updating product:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).send({ message: error.message });
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
    const result = await deleteProduct(id); // Call deleteProduct function

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Error deleting product", error: error.message });
  }
});

// GET route - Get a product by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
      const product = await getProductById(id); // Call getProductById function
      res.send(product); // Return the found product
  } catch (error) {
      console.error("Error fetching product by ID:", error.message);
      res.status(404).send({ message: error.message }); // Return error if product not found
  }
});


module.exports = router;

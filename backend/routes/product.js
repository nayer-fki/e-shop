const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts,
  getProductById,
  getProductsByCategoryId,
  addComment,
  addRating,
  getCommentsForProduct,
  getRatingsForProduct
} = require("../handlers/product-handler"); // Import product handlers

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

// GET route - Get products by category ID
router.get("/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
      const products = await getProductsByCategoryId(categoryId); // Call getProductsByCategoryId function
      res.send(products); // Return products based on the category
  } catch (error) {
      console.error("Error fetching products by category ID:", error.message);
      res.status(404).send({ message: error.message }); // Return error if no products found
  }
});

// PUT route - Update product by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const model = req.body;

  try {
      const updatedProduct = await updateProduct(id, model); // Call updateProduct function
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

// Add Comment Route
router.post("/:id/comment", async (req, res) => {
  try {
      const { userName, comment, userId } = req.body;

      // Validation for userId, userName, and comment
      if (!userName || !comment || !userId) {
          return res.status(400).send({ message: "User ID, user name, and comment are required." });
      }

      // Call the addComment function from the handler
      const model = {
          productId: req.params.id,
          userId: userId, // Make sure you're sending userId from frontend
          userName: userName.trim(), // Clean up the input
          comment: comment.trim() // Clean up the input
      };

      // Add the comment using the function you imported
      const newComment = await addComment(model);
      res.status(201).send(newComment); // Send the newly created comment as the response
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});


// Add Rating Route
router.post("/:id/rating", async (req, res) => {
  try {
      const { userName, rating, userId } = req.body;

      // Validation for userId, userName, and rating
      if (!userName || rating === undefined || !userId) {
          return res.status(400).send({ message: "User ID, user name, and rating are required." });
      }

      if (rating < 1 || rating > 5) {
          return res.status(400).send({ message: "Rating must be between 1 and 5." });
      }

      // Call the addRating function from the handler
      const model = {
          productId: req.params.id,
          userId: userId, // userId should be included for storing and validation
          userName: userName.trim(), // Clean up the userName
          rating: rating
      };

      // Add the rating using the function you imported
      const newRating = await addRating(model);
      res.status(201).send(newRating); // Send the newly created rating as the response
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

// Get Comments for a Product
router.get("/:id/comments", async (req, res) => {
  try {
      const comments = await getCommentsForProduct(req.params.id); // Use the function imported from handlers
      res.status(200).send(comments);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

// Get Ratings for a Product
router.get("/:id/ratings", async (req, res) => {
  try {
      const ratings = await getRatingsForProduct(req.params.id); // Use the function imported from handlers
      res.status(200).send(ratings);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");  // Import mongoose
const router = express.Router();
const { addCategory, UpdateCategory , DeleteCategory ,getCategories, getCategoryById } = require("../handlers/categry-hander");  // Import addCategory and UpdateCategory



router.post("", async (req, res) => {
  let model = req.body;

  // Validate the input
  if (!model.name || typeof model.name !== 'string' || model.name.trim().length === 0) {
    return res.status(400).send({ error: "Category name is required and should be a non-empty string" });
  }

  try {
    const category = await addCategory(model);  // Call the addCategory function
    res.status(201).send(category);  // Send the created category as the response
  } catch (error) {
    res.status(500).send({ error: error.message });  // Send an error message if something goes wrong
  }
});





// GET route
router.get("", async (req, res) => {
  try {
      let result = await getCategories();
      res.send(result);
  } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});


router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
      let result = await getCategoryById(id);
      
      res.send(result);
  } catch (error) {
      console.error("Error fetching category:", error.message);
      res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});

// PUT route
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const model = req.body;

  try {
    const updatedCategory = await UpdateCategory(id, model);  // Use UpdateCategory function

    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Send the updated category in the response
    res.send({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    // Log and send error if something goes wrong
    res.status(500).send({ message: error.message });
  }
});

// router delete category
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // Validate ID format using Mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  try {
    const result = await DeleteCategory(id);  // Call the DeleteCategory function

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.send({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting category", error: error.message });
  }
});



module.exports = router;

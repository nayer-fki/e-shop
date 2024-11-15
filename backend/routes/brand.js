const express = require("express");
const mongoose = require("mongoose");  // Import mongoose
const router = express.Router();
const { addBrand, UpdateBrand , DeleteBrand ,getBrands, getBrandById } = require("../handlers/brand-handler");  // Import addbrand and Updatebrand




/// add brand 
router.post("", async (req, res) => {
  let model = req.body;

  try {
    const brand = await addBrand(model);
    res.send(brand);
  } catch (error) {
    console.error("Error adding brand:", error.message);  // Log error for debugging
    res.status(500).send({ message: error.message });
  }
});



// GET all brands
router.get("", async (req, res) => {
  try {
    let result = await getBrands();
    res.send(result);
  } catch (error) {
    console.error("Error fetching brands:", error.message);
    res.status(500).send({ message: error.message });
  }
});




// GET brand by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let result = await getBrandById(id);
    res.send(result);
  } catch (error) {
    console.error("Error fetching brand:", error.message);
    res.status(500).send({ message: error.message });
  }
});




// PUT route
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const model = req.body;

  try {
    const updatedBrand = await UpdateBrand(id, model);

    if (!updatedBrand) {
      return res.status(404).send({ message: "Brand not found" });
    }

    res.send({ message: "Brand updated successfully", brand: updatedBrand });
  } catch (error) {
    console.error("Error updating brand:", error.message);
    res.status(500).send({ message: error.message });
  }
});




// DELETE brand
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  try {
    const result = await DeleteBrand(id);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Brand not found" });
    }

    res.send({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error.message);
    res.status(500).send({ message: error.message });
  }
});




module.exports = router;

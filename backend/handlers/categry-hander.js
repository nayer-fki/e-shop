const Categoy = require("./../db/category");
const CategoryModel = require("./../db/category");  // Renamed to CategoryModel
const mongoose = require('mongoose');  // Add mongoose import



async function addCategory(model) {
    // Validate that model.name exists and is a string
    if (!model.name || typeof model.name !== 'string') {
      throw new Error("Category name is required and should be a non-empty string");
    }
  
    // Create a new instance of the Category model with the trimmed name
    let category = new CategoryModel({
      name: model.name.trim(),  // Apply trim only if model.name is a valid string
    });
  
    try {
      // Save the category in the database
      await category.save();
      return category.toObject();  // Return the saved category object
    } catch (err) {
      // Handle other errors (such as database issues)
      throw new Error("Error creating category");
    }
  }
  
  



// categories.js
async function getCategories() {
    try {
        let categories = await CategoryModel.find();
        return categories.map((c) => c.toObject());
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}


async function getCategoryById(id) {
    try {
        let category = await CategoryModel.findById(id);
        return category.toObject();
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

async function UpdateCategory(id, model) {
    // Validate ID format using Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }

    try {
        // Use async/await to find and update the category
        const updatedCategory = await CategoryModel.findOneAndUpdate(
            { _id: id },  // Find category by ID
            model,        // Update data
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            throw new Error("Category not found");
        }

        return updatedCategory;  // Return the updated category
    } catch (err) {
        // Log error and throw it up to be handled by the caller
        console.error("Error during update:", err);
        throw new Error("Error updating category: " + err.message);
    }
}


// function deleting categry
async function DeleteCategory(id) {
    const deleteCategory = await CategoryModel.deleteOne({ _id: id });
    return deleteCategory;  // Return the deletion result
  }

module.exports = { addCategory, UpdateCategory , DeleteCategory , getCategories ,getCategoryById};

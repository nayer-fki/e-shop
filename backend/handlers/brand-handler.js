const Brand = require('./../db/brand');
const mongoose = require('mongoose');


async function addBrand(model) {
    // Create a new instance of the brand model
    let brand = new Brand({
        name: model.name,
    });

    // Save the brand in the database
    try {
        await brand.save();
        return brand.toObject();  // Return the saved brand object
    } catch (err) {
        throw new Error("Error creating brand");  // Throw an error
    }
}


// brands 
async function getBrands() {
    try {
        let brands = await Brand.find(); // Find all brands

        // You may not need to call toObject(), just return the documents
        return brands;  
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
}



const getBrandById = async (id) => {
    const brand = await Brand.findById(id);
  
    if (!brand) {
      throw new Error("Brand not found");
    }
  
    return brand.toObject();  // Ensure brand is a Mongoose document
  };
  

async function UpdateBrand(id, model) {
    // Validate ID format using Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }

    try {
        // Use async/await to find and update the brand
        const updatedBrand = await Brand.findOneAndUpdate(
            { _id: id },  // Find brand by ID
            model,        // Update data
            { new: true } // Return the updated document
        );

        if (!updatedBrand) {
            throw new Error("Brand not found");
        }

        return updatedBrand;  // Return the updated brand
    } catch (err) {
        // Log error and throw it up to be handled by the caller
        console.error("Error during update:", err);
        throw new Error("Error updating brand: " + err.message);
    }
}


// function deleting categry
async function DeleteBrand(id) {
    const deleteBrand = await Brand.deleteOne({ _id: id });
    return deleteBrand;  // Return the deletion result
  }

module.exports = { addBrand, UpdateBrand, DeleteBrand, getBrands, getBrandById };


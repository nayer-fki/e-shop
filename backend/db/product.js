const mongoose = require("mongoose");  // Import mongoose
const Schema = mongoose.Schema;  // Import Schema from mongoose

const productSchema = new Schema({
  name: { type: String, required: true },
  shortDescription: { type: String },
  description: { type: String },
  price: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  discount: { type: Number },
  images: [{ type: String }],
  categoryId: { type: Schema.Types.ObjectId, ref: 'categories' }  // Reference to the 'categories' collection
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    discount: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }  // Reference to 'Category' model
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

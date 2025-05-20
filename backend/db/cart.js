const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Reference to Product model
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'A cart must contain a product']
  },
  varient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Varient'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A cart Item must belong to a user']
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: Number
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
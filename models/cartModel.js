const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'A cart must contain a product'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A cart Item must belong to a user'],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: Number,
    createdAt:  {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// cartSchema.pre(/^find/, function (next) {

// });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

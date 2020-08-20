const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.pre('findOne', function (next) {
  this.populate({
    path: 'products',
    select: 'name coverImage tags sku',
  });
  next();
});



const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

const mongoose = require('mongoose');

const varientSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  values: [
    {
      combinations: [],
      price: Number,
      salePrice: Number,
      discountedPrice: {
        type: Number,
        validate: {
          validator: function(val) {
            return val < this.salePrice;
          },
          message: 'Discounted Price should be less than Sale Price '
        }
      }
    }
  ]
});

const Varient = mongoose.model('Varient', varientSchema);
module.exports = Varient;
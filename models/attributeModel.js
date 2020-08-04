const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'An attribute shuld belong to a product']
  },
  values: [],
  isVarient: {
    type: Boolean,
    default: false
  }
});

const Attribute = mongoose.model('Attribute', attributeSchema);
module.exports = Attribute;
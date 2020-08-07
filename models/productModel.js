const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  sku: String,
  type: {
    type: String,
    enum: ['simple', 'varient']
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  slug: String,
  shortDesc: String,
  longDesc: String,
  brand: {
    name: String,
    img: String
  },
  catagory: {
    type: String,
    required: [true, 'Product catagory is required']
  },
  price: {
    type: Number,
    required: [true, 'price is required']
  },
  discountedPrice: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discounted price should be less than Price'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be between 1 to 5'],
    max: [5, 'Rating must be between 1 to 5'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  coverImage: String,
  images: [String],
  vendor: {
    type: mongoose.Schema.ObjectId,
    role: 'Vendor'
  },
  shipping: {
    dimensions: {
      height: Number,
      length: Number,
      width: Number
    },
    weight: Number
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    replacement: '-',  
    remove: undefined, 
    lower: true,      
    strict: true
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
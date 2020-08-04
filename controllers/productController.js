const Product = require('../models/productModel');
const factoryHandler = require('./factoryHandler');

exports.topRatedProducts = (req, res, next) => {
  req.query.limit = '20';
  req.query.sort = '-ratingsAverage,price';
  next();
}

exports.getAllProducts = factoryHandler.getAll(Product);     
exports.createProduct = factoryHandler.createOne(Product);
exports.getOneProduct = factoryHandler.getOne(Product);
exports.updateProduct = factoryHandler.UpdateOne(Product);
exports.deleteProduct = factoryHandler.deleteOne(Product);

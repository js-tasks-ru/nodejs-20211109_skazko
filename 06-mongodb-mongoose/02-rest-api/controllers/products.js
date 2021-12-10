const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = (await Product.find({subcategory})).map(mapProduct);

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = (await Product.find({})).map(mapProduct);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    ctx.throw(400);
  }

  const product = await Product.findById(id);
  if (!product) {
    ctx.throw(404);
  } else {
    ctx.body = {product: mapProduct(product)};
  }
};


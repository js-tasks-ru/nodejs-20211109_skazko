const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  let products;

  if (query) {
    products = await Product
        .find(
            {$text: {$search: query}},
            {score: {$meta: 'textScore'}},
        )
        .sort( {score: {$meta: 'textScore'}} );
  } else {
    products = await Product.find({});
  }

  ctx.body = {products: products.map(mapProduct)};
};

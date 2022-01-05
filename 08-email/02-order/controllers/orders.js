const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const product = await Product.findById(ctx.request.body.product);
  const newOrder = await Order.create({
    product: product,
    user: ctx.user,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  await sendMail({
    to: ctx.user.email,
    subject: 'Заказ',
    locals: mapOrderConfirmation(newOrder, product),
    template: 'order-confirmation',
  });

  ctx.body = {order: newOrder._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product').exec();
  ctx.body = {orders: orders.map(mapOrder)};
};

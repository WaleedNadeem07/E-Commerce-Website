const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  numberOfProducts: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  products: {
    type: [String], // Array of product titles
    required: true,
  },
  userid: {
    type: String, // Assuming you are using the username as the userid
    required: true,
  },
  quantities: {
    type: [Number], // Array of quantities
    required: true,
  },
  prices: {
    type: [Number], // Array of prices
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

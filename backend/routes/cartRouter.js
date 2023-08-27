const express = require("express");
const Cart = require("../models/cartSchema");
const cartRouter = express.Router();
const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');

cartRouter.post('/save-order', async (req, res) => {
  try {
    const { date, orderNumber, numberOfProducts, price, products, quantities, prices, userid } = req.body;

    for (let i = 0; i < products.length; i++) {
      const productTitle = products[i];
      const orderedQuantity = quantities[i];
      
      // Find the product by its title in the database
      const product = await Product.findOne({ title: productTitle });
      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${productTitle}`,
        });
      }

      // Check if the ordered quantity is greater than the available quantity
      if (orderedQuantity > product.quantity) {
        return res.status(400).json({
          message: `Product quantity is less than the ordered quantity for product: ${productTitle}. Max quantity that can be ordered is ${product.quantity}`,
        });
      }
    }


    // Create a new order in the database with the userid
    const order = await Order.create({
      date,
      orderNumber,
      numberOfProducts,
      price,
      products,
      quantities,
      prices,
      userid,
    });

    for (let i = 0; i < products.length; i++) {
      const productTitle = products[i];
      const orderedQuantity = quantities[i];
      
      // Find the product by its title in the database
      const product = await Product.findOne({ title: productTitle });
      if (product) {
        // If the product is found, update its quantity by subtracting the ordered quantity
        product.quantity -= orderedQuantity;
        await product.save();
      }
    }

    console.log('Order:', order);

    res.status(200).json({
      message: "Order placed successfully!",
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Order Placement Failed!",
    });
  }
});

cartRouter.post('/get-orders', async (req, res) => {
    try {
      const { username } = req.body;
  
      // Find all orders in the database that have the provided username as the userid
      const orders = await Order.find({ userid: username });
  
      if (orders && orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.status(404).json({
          message: "No orders found for the provided username.",
        });
      }
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to fetch orders.",
      });
    }
});

module.exports = cartRouter;
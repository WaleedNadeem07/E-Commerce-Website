const express = require("express");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Provide the absolute path to the 'uploads' folder in the root directory
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Use the original file name as the new file name
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/create', upload.single('image'), async (req, res) => {
  try {
    console.log(req.body);
    const { title, price, quantity, category, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Create the new product object with the data received from the frontend
    const newProduct = {
      title,
      price,
      quantity,
      category,
      description,
      // Set the image path if an image is uploaded, otherwise set it to undefined
      image: image ? image : undefined,
      // Add more fields here if needed
    };

    // Insert the new product into the database
    const createdProduct = await Product.create(newProduct);

    res.status(200).json({
      message: "Product Inserted Successfully!",
      product: createdProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Product Insertion Failed!",
      error: error.message,
    });
  }
});

router.post('/update', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
      const { _id, title, price, quantity } = req.body;
      const image = req.file ? req.file.filename : undefined;
  
      // Construct the updatedProduct object with the new data received from the frontend
      const updatedProduct = {
        title,
        price,
        quantity,
        // If the image is uploaded, set it to the new image path, otherwise, keep the existing image path
        image: image ? image : req.body.image,
        // Add more fields here if needed
      };
  
      // Update the product in the database using the product ID (_id)
      const updatedProductInDB = await Product.findByIdAndUpdate(_id, updatedProduct, { new: true });
  
      if (!updatedProductInDB) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product updated successfully!",
        product: updatedProductInDB,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error updating product!",
        error: error.message,
      });
    }
  });

router.get('/get', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "message": "Error fetching products!",
            "error": error.message
        });
    }
});

router.get('/get-orders', async (req, res) => {
    try {
        const products = await Order.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "message": "Error fetching products!",
            "error": error.message
        });
    }
});

router.post('/remove', async (req, res) => {
    try {
      const productTitle = req.body.title;
      const deletedProduct = await Product.findOneAndDelete({ title: productTitle });
      if (deletedProduct) {
        res.status(200).json({
          message: "Product Deleted Successfully!",
          product: deletedProduct
        });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting product!",
        error: error.message
      });
    }
  });

router.get('/get/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ "message": "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "message": "Error fetching product!",
            "error": error.message
        });
    }
});

router.post('/send', async (req, res) => {
  try {
      const newProduct = await Product.create(req.body);
      res.status(200).json({
          "message": "Product Inserted Successfully!",
          "product": newProduct
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          "message": "Product Insertion Failed!",
          "error": error.message
      });
  }
});

module.exports = router;

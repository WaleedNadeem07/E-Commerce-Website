const { default: mongoose } = require("mongoose");

// schema 
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
    },

    category: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        default: 10,
    },

})


const Product = new mongoose.model("Product", productSchema);
module.exports = Product;

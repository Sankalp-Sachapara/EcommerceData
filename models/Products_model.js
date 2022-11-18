const mongoose = require("mongoose")


const productsSchema = new mongoose.Schema({
    Product_name : {
        type: String,
        required: true,
    },
    Product_category: { // change
        type: String,
        required: true,
    },
    Product_description: {
        type: String,
        required: true,
    },
    Product_price: { // change
        type: Number,
        required: true,
    },
    Quantity_available:{
        type: Number,
        required: true,
    },
    Category_Id:{
        type:String,
    },
    seller_Id:{
        type:String,
    },
    seller_name : {
        type: String,
        required: true,
    },
    Product_rating : {
        type: Number,
        min: 1,
        max:5,
    },


})

module.exports = mongoose.model('Products',productsSchema)
const mongoose = require("mongoose")


const productsSchema = new mongoose.Schema({
    Product_name : {
        type: String,
        
    },
    Product_category: { // change
        type: String,
        
    },
    Product_description: {
        type: String,
        
    },
    Product_price: { // change
        type: Number,
        
    },
    Quantity_available:{
        type: Number,
        
    },
    Category_Id:{
        type:String,
    },
    seller_Id:{
        type:String,
    },
    seller_name : {
        type: String,
        
    },
    Product_rating : {
        type: Number,
        min: 1,
        max:5,
    },


})

module.exports = mongoose.model('Products',productsSchema)
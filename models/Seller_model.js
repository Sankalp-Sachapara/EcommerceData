const mongoose = require("mongoose")


const sellerSchema = new mongoose.Schema({
    Seller_name : {
        type: String,
        required: true,
    },
    Seller_Address: { 
        type: {
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:String}, 
            Country: {type: String},
        },
        required: true,
    },
    Seller_Phone: {
        type: Number,
        required: true,
    },
    Seller_Products: { 
        type: { 
            Product_ID: {type:Number}, 
            Product_Name: {type:String} , 
            Product_quantity: {type:Number}, 
            Product_Price: {type:Number} 
        },
        required: true,
    },
})

module.exports = mongoose.model('Seller',sellerSchema)
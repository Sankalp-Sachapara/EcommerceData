const mongoose = require("mongoose")


const sellerProductschema = new mongoose.Schema({ 
    Product_ID: {type:Number}, 
    Product_Name: {type:String} , 
    Product_Quantity: {type:Number}, 
    Product_Price: {type:Number} 
})

const sellerSchema = new mongoose.Schema({
    Seller_name : {
        type: String,
        required: true,
    },
    Seller_Address: { 
        type: {
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:Number}, 
            Country: {type: String},
        },
        required: true,
    },
    Seller_Phone: {
        type: Number,
        required: true,
    },
    Seller_Products: [sellerProductschema],
})

module.exports = mongoose.model('Seller',sellerSchema)
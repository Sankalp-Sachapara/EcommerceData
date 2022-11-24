const mongoose = require("mongoose")

const buyerCartSchema= new mongoose.Schema({ 
    Product_ID: {type: Number}, 
    Product_Name: {type:String} , 
    Product_quantity: {type:Number}, 
    Product_Price: {type:Number} 
})

const buyerSchema = new mongoose.Schema({
    Buyer_name : {
        type: String,
        
    },
    Buyer_Email : {
        type: String,
    },
    Buyer_Password : {
        type: String,
    },
    Buyer_Delivery_Address: { 
        type: {
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:Number}, 
            Country: {type: String},
        },
        
    },
    Buyer_Phone: {
        type: Number,
        
    },
    Buyer_Cart: [buyerCartSchema]
})

module.exports = mongoose.model('Buyer',buyerSchema)
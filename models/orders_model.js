const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    product_id :{ type: String},
    product_name: { type: String},
    product_quantity_bought: {type: Number},
    product_total_price: {type: Number},
    product_seller_id: {type: String},
    
})

const orderSchema = new mongoose.Schema({
    buyer_ID:{
        type: String,
        
    },
    product_list:[productSchema],
   
    total_price:{
        type: Number,
        
    },
    order_status:{
        type: String
    },
    
    // payment_ID:{
    //     type: Number,
    //     required : true
    // },
    // transaction_ID:{
    //     type: Number,
    //     required : true
    // },
    
   
    // buyer_Delivery_Address: { 
    //     type: {
    //         address_line: {type: String} , 
    //         City: {type:String}, 
    //         Postal_Code: {type:String}, 
    //         Country: {type: String},
    //     },
    //     required: true,
    // },
    // order_time: { 
    //     type: Date, 
    //     required: true,
    // },
    // Transaction_status: {
    //     type: Boolean,
    // },
    // delivery_ID:{
    //     type: Number,
    //     required : true
    // },
    // delivery_time: { 
    //     type: Date, 
    //     required: true,
    // },
    // delivery_status: {
    //     type: Boolean,
    // },
    // cancellation_status: {
    //     type: Boolean,
    // },

})

module.exports = mongoose.model('Orders',orderSchema)
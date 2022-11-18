const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    order_name : {
        type: String,
        required : true

    },
    product_ID:{
        type: Number,
        required : true
    },
    product_name : {
        type: String,
        required : true

    },
    product_price:{
        type: Number,
        required : true
    },
    product_quantity_bought:{
        type: Number,
        required : true
    },
    total_amount:{
        type: Number,
        required : true
    },
    payment_ID:{
        type: Number,
        required : true
    },
    transaction_ID:{
        type: Number,
        required : true
    },
    buyer_ID:{
        type: Number,
        required : true
    },
    buyer_Delivery_Address: { 
        type: {
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:String}, 
            Country: {type: String},
        },
        required: true,
    },
    order_time: { 
        type: Date, 
        required: true,
    },
    Transaction_status: {
        type: Boolean,
    },
    delivery_ID:{
        type: Number,
        required : true
    },
    delivery_time: { 
        type: Date, 
        required: true,
    },
    delivery_status: {
        type: Boolean,
    },
    cancellation_status: {
        type: Boolean,
    },

})

module.exports = mongoose.model('orders',orderSchema)
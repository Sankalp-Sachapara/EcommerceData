const mongoose = require("mongoose")


const paymentSchema = new mongoose.Schema({
    Transaction_amount : {
        type: Number,
        required: true,
    },
    Payment_time: { 
        type: Date, 
        default: Date.now ,
        required: true,
    },
    Transaction_status: {
        type: Boolean,
    },
    Buyer_Id: { 
        type: String,
        required: true,
    },
    Transaction_Id: { 
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Payment',paymentSchema)
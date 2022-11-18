const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    Transaction_provider : {
        type: String,
        required: true,
    },
    Transaction_amount : {
        type: Number,
        required: true,
    },
    Transaction_status: {
        type: Boolean,
    },
    Transaction_time: { 
        type: Date, 
        default: Date.now ,
        required: true,
    },
})

module.exports = mongoose.model('Transaction',transactionSchema)
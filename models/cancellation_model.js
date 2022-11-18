const mongoose = require("mongoose")


const cancellationSchema = new mongoose.Schema({
    order_ID : {
        type: Number,
        required: true,
    },
    Transaction_ID : {
        type: Number,
        required: true,
    },
    cancellation_status: {
        type: Boolean,
    },
    refund_status: {
        type: Boolean,
    },
    refund_amount: {
        type: Boolean,
        required: true,
    },
})

module.exports = mongoose.model('Cancellation',cancellationSchema)

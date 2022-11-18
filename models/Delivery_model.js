const mongoose = require("mongoose")


const deliverySchema = new mongoose.Schema({
    Delivery_provider : {
        type: String,
        required: true,
    },
    Transaction_ID : {
        type: Number,
        required: true,
    },
    Delivery_status: {
        type: Boolean,
    },
    Delivery_time: { 
        type: Date, 
        required: true,
    },
})

module.exports = mongoose.model('Delivery',deliverySchema)
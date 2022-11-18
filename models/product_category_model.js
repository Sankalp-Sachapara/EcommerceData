const mongoose = require("mongoose")


const categorySchema = new mongoose.Schema({
    category_name : {
        type: String,
        required: true,
    },
    sub_category : {
        type: { Sub_name: {type: String}, Sub_Desc: {type: String}},
        
    },
    category_description: {
        type: String,
    },
})

module.exports = mongoose.model('Category',categorySchema)

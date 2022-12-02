const mongoose = require("mongoose")

const productratingschema= new mongoose.Schema({
    ID:{
        type: String
    },
    Product_ID:{
        type: String,
    },

    Product_rating:{
    type: Number,
    min: 1,
    max:5,
    default: null,
    },
    Product_description:{
        type: String,
        default: null,
    },
    
})

const productCategorySchema = new mongoose.Schema({
    category_name : {
        type: String,
        required: true,
    },
    sub_category : {
        type: { 
            Sub_name: {
                type: String
            }, 
            Sub_Desc: {
                type: String
            },
        },
    },
    category_description: {
        type: String,
    },
})

    

const productsSchema = new mongoose.Schema({
    Product_name : {
        type: String,
        
    },
    Product_category: [productCategorySchema],
    Product_description: {
        type: String,
        
    },
    Product_price: { // change
        type: Number,
        
    },
    Quantity_available:{
        type: Number,
        
    },
    seller_Id:{
        type:String,
    },
    seller_name : {
        type: String,
        
    },
    Product_rating : [productratingschema],
    
})

module.exports = mongoose.model('Products',productsSchema)
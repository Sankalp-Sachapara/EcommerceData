require("dotenv").config()
const express = require('express')
const SellerRoute = express.Router()
const Seller = require('../models/Seller_model')
const Products = require('../models/Products_model')
const Orders = require('../models/orders_model')
const bcrypt = require ('bcrypt')
const jwt = require("jsonwebtoken")


/**
 * @swagger
 *  components:
 *      schemas:
 *          Seller:
 *             type: object
 *             properties:
 *                 Seller_name:
 *                     type: string
 *                 Seller_Email:
 *                     type: string
 *                 Seller_Password:
 *                     type: string
 *                 Seller_Address:
 *                     type: object
 *                     properties:
 *                         address_line:
 *                             type: string 
 *                         City:
 *                             type: string
 *                         Postal_Code:
 *                             type: number
 *                         Country:
 *                             type: string
 *                 Seller_Phone:
 *                      type: number
 *          Order_id:
 *             type: object
 *             properties:
 *                 ID:
 *                     type: string
 *          Product:
 *             type: object
 *             properties:
 *                 Product_name:
 *                     type: string
 *                 Product_description:
 *                     type: string
 *                 Product_category:
 *                     type: object
 *                     properties:
 *                         category_name:
 *                             type: string
 *                         caterogy_description:
 *                             type: string 
 *                         sub_category:
 *                             type: object
 *                             properties:
 *                                 Sub_name:
 *                                     type: string
 *                                 Sub_Desc:
 *                                     type: string
 *                 Product_price:
 *                     type: number
 *                 Quantity_available:
 *                     type: number
 *          Orders:
 *             type: object
 *             properties:
 *                 Buyer_ID:
 *                     type: string
 *                 Product_list:
 *                     type: array
 *                     items:
 *                          type: object
 *                          properties:
 *                             Product_id:
 *                                 type: string
 *                             product_name:
 *                                 type: string
 *                             product_quantity_bought:
 *                                 type: number
 *                             product_total_price:
 *                                 type: number   
 *                             order_status:
 *                                 type: string 
 *                 total_price:
 *                     type: number            
 */


/**
 * @swagger
 * /seller/newUser:
 *  post:
 *      summary: Registering new user  
 *      description: Add the data in database warning while adding poducts array do not add "," on last object or there will be an error
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Seller'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

// creating one record
SellerRoute.post('/newUser', async (req,res) => {
    
    const seller = new Seller({
        Seller_name: req.body.Seller_name,
        Seller_Email: req.body.Seller_Email,
        Seller_Password: await bcrypt.hash(req.body.Seller_Password,10),
        Seller_Address: req.body.Seller_Address,
        Seller_Phone: req.body.Seller_Phone,
        // Seller_Products: req.body.Seller_Products
    })

    const newSeller = await seller.save()
    res.json(newSeller);
    
})

/**
 * @swagger
 * /seller/newProduct:
 *  post:
 *      summary: add the  new Product data in database  
 *      description: Add the  product data in database 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 


SellerRoute.post('/newProduct',verifyToken, async (req,res) => {
    // let seller = await Seller.findById()
    
    const product = new Products({
        Product_name: req.body.Product_name,
        Product_category: req.body.Product_category,
        Product_description: req.body.Product_description,
        Product_price: req.body.Product_price,
        Quantity_available: req.body.Quantity_available,
        seller_Id: res.current_user.seller_user._id,
        //res.current_user.seller_user._id // for current user access
        
    })

    const newProduct = await product.save()
    res.json(newProduct);
    
})
/**
 * @swagger
 * /seller/productOrders:
 *  get:
 *      summary: Product data which has been ordered  
 *      description: Product data which has been ordered
 *      responses:
 *          200:
 *              description: success fully displaying  data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Orders'
 * 
 */ 

SellerRoute.get('/productOrders',verifyToken, async (req,res) => {
    let products = await Orders.find({"products_list.product_id": res.current_user.seller_user._id})
    res.json(products)

})
/**
 * @swagger
 * /seller/acceptOrders:
 *  post:
 *      summary: for dispatching orders  
 *      description: Enter the order id and dispatch orders 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Order_id'
 *                      
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 
SellerRoute.post('/acceptOrders', verifyToken, async (req,res) =>{
    let order = await Orders.findOneAndUpdate({_id: req.body.ID},{order_status: "Dispatched"},{new: true})
    res.json(order)
})


/**
 * @swagger
 * /seller/deliverOrders:
 *  post:
 *      summary: for delivering orders  
 *      description: Enter the order id and deliver orders 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Order_id'
 *                      
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

SellerRoute.post('/deliverOrders', verifyToken, async (req,res) =>{
    let order = await Orders.findOneAndUpdate({_id: req.body.ID},{order_status: "Delivered"},{new: true})
    res.json(order)
})




async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    
    const bearer = bearerHeader.split(" ")[1];
    const tokendecoder = bearerHeader.split(" ");
    if(typeof bearerHeader !== 'undefined'){
                
        jwt.verify(bearer,process.env.SELLER_ACCESS_TOKEN_SECRET,(err,authdata) =>{
            if(err){
                res.json({result:err})
            }
            else{ 
                res.current_user = JSON.parse(Buffer.from(tokendecoder[1].split(".")[1], 'base64').toString());
                next()
            }
        })

    }
    else{
        res.send({"result":"token not provided"})
    }
}


module.exports = {SellerRoute}
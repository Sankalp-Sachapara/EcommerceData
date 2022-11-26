require("dotenv").config()
const express = require('express')
const BuyerRoute = express.Router()
const bcrypt = require ('bcrypt')
const Buyer = require('../models/Buyer_model')
const Orders = require('../models/orders_model')

const jwt = require("jsonwebtoken")




/**
 * @swagger
 *  components:
 *      schemas:
 *          Buyer:
 *             type: object
 *             properties:
 *                 Buyer_name:
 *                     type: string
 *                 Buyer_Email:
 *                     type: string
 *                 Buyer_Password:
 *                     type: string
 *                 Buyer_Delivery_Address:
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
 *                 Buyer_Phone:
 *                      type: number
 *          Product_id:
 *             type: object
 *             properties:
 *                 Product_ID:
 *                     type: string                 
 */





/**
 * @swagger
 * /buyer/newUser:
 *  post:
 *      summary: add the data in database  
 *      description: Add the data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Buyer'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

// creating one record
BuyerRoute.post('/newUser', async (req,res) => {
    
   
    const buyer = new Buyer({
        Buyer_name: req.body.Buyer_name,
        Buyer_Email: req.body.Buyer_Email,
        Buyer_Password: await bcrypt.hash(req.body.Buyer_Password,10),
        Buyer_Delivery_Address: req.body.Buyer_Delivery_Address,
        Buyer_Phone: req.body.Buyer_Phone,
        // Buyer_Cart: req.body.Buyer_Cart // array of objects only product id
    })

   
    const newBuyer = await buyer.save()
    res.json(newBuyer);
    
})

/**
 * @swagger
 * /buyer/AddtoCart:
 *  post:
 *      summary: add the data in database  
 *      description: Add the data in database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product_id'
 *      responses:
 *          200:
 *              description: Added Successfully             
 */ 



BuyerRoute.post('/AddtoCart', verifyToken,async (req,res) => {
    let buyer = await Buyer.findById(res.current_user.buyer_user._id)
    buyer.Buyer_Cart.push(req.body.Product_ID)

    const updatedbuyer = await buyer.save()
    res.json(updatedbuyer); //.Buyer_Cart
    
})

BuyerRoute.post("/Orders", verifyToken,async(req,res) =>{
    let buyer = await Buyer.findById(res.current_user.buyer_user._id)
    const order = new Orders({
        // product_ID: buyer.Buyer_Cart,
        Buyer_Email: req.body.Buyer_Email,
        Buyer_Password: await bcrypt.hash(req.body.Buyer_Password,10),
        Buyer_Delivery_Address: req.body.Buyer_Delivery_Address,
        Buyer_Phone: req.body.Buyer_Phone,
        // Buyer_Cart: req.body.Buyer_Cart // array of objects only product id
    })


})




/*************************************************************************************************/
async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(" ")[1];
    const tokendecoder = bearerHeader.split(" ");
    if(typeof bearerHeader !== 'undefined'){
                
        jwt.verify(bearer,process.env.BUYER_ACCESS_TOKEN_SECRET,(err,authdata) =>{
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

module.exports = {BuyerRoute}
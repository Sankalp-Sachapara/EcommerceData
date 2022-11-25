require("dotenv").config()
const express = require('express')
const BuyerRoute = express.Router()
const bcrypt = require ('bcrypt')
const Buyer = require('../models/Buyer_model')

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
 */


// getting all record

/**
 * @swagger
 * /buyer:
 *  get:
 *      summary: The get data from database  
 *      description: displaying all data from database
 *      responses:
 *          200:
 *              description: success fully displaying all data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Buyer'
 * 
 */ 
BuyerRoute.get('/', verifyToken, async (req,res) => { 
    const buyers =  await Buyer.find()
    res.json(buyers)
    
})




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
        // Buyer_Cart: req.body.Buyer_Cart
    })

   
    const newBuyer = await buyer.save()
    res.json(newBuyer);
    
})

/**
 * @swagger
 * /buyer/AddtoCart:
 *  get:
 *      summary: The get data from database  
 *      description: displaying all data from database
 *      responses:
 *          200:
 *              description: success fully displaying all data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Buyer'             
 */ 



BuyerRoute.get('/AddtoCart', verifyToken,async (req,res) => {
   
    
    res.json(Buyer);
    
})

// async function decodeToken(req,res,next){
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
                
//       const payload =  jwt.verify(bearerHeader,process.env.BUYER_ACCESS_TOKEN_SECRET,(err,authdata) =>{
//             if(err){
//                 res.json({result:err})
//             }
//             else{ 
//                  
//                 next()
//             }
//         })

//     }
//     else{
//         res.send({"result":"token not provided"})
//     }
// }



/*************************************************************************************************/
async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")[1];        
        jwt.verify(bearer,process.env.BUYER_ACCESS_TOKEN_SECRET,(err,authdata) =>{
            if(err){
                res.json({result:err})
            }
            else{ 
                next()
            }
        })

    }
    else{
        res.send({"result":"token not provided"})
    }
}

module.exports = {BuyerRoute}
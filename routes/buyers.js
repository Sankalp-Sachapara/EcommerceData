const express = require('express')
const BuyerRoute = express.Router()
const bcrypt = require ('bcrypt')
const Buyer = require('../models/Buyer_model')
const jwt = require("jsonwebtoken")

jwtkey = "password"

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
 *              description: success fullydisplaying all data from database
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
    // res.send("welcome")
})

/**
 * @swagger
 * /buyer/{id}:
 *  get:
 *      summary: The get specific id data from database  
 *      description: displaying all data from database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: fetch with id 
 *            schema:
 *              type: string
 *             
 *      responses:
 *          200:
 *              description: success fullydisplaying all data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Buyer'
 * 
 */ 

// getting one record
BuyerRoute.get('/:id', getById, async(req,res) => {
    res.json(res.buyer)  
})




/*******************************************************************************/

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

    jwt.sign({buyer}, jwtkey,(err,token)=>{
        res.json({token})
    })
    const newBuyer = await buyer.save()
    // res.json(newBuyer);
    
})
/*************************************************************************************************/








/**
 * @swagger
 * /buyer/{id}:
 *  put:
 *      summary: Update the data in database  
 *      description: updating the data in database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: fetch with id number
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Buyer'
 *      responses:
 *          200:
 *              description: updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Buyer'
 *              
 */


// updating one record
BuyerRoute.put('/:id',getById, async (req,res) => {
    res.buyer.Buyer_name = req.body.Buyer_name
    res.buyer.Buyer_Delivery_Address = req.body.Buyer_Delivery_Address,
    res.buyer.Buyer_Phone = req.body.Buyer_Phone,
    res.buyer.Buyer_Cart =req.body.Buyer_Cart
    
    // other patch to be added
    const updatedbuyer = await res.buyer.save()
    res.json(updatedbuyer)
    
})

/**
 * @swagger
 * /buyer/{id}:
 *  delete:
 *      summary: delete the data in database  
 *      description: for deleting the data in database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: fetch with id number
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Buyer'
 *      responses:
 *          200:
 *              description: deleted Successfully
 *              
 *              
 */

// deleting one record
BuyerRoute.delete('/:id',getById, async (req,res) => {
    res.buyer.remove()
    res.json("Deleted buyer")
    
})

async function getById(req,res,next){
    let buyer = await Buyer.findById(req.params.id)
    if(buyer == null){
        return res.json({message : 'no buyer'})
    }

    res.buyer = buyer
    next()
}

async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")[1];
        
        jwt.verify(bearer,process.env.ACCESS_TOKEN_SECRET,(err,authdata) =>{
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
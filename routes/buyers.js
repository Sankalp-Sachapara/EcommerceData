const express = require('express')
const BuyerRoute = express.Router()
const Buyer = require('../models/Buyer_model')

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
 *                              $ref: '../App.js/#/components/schemas/buyer_mod'
 * 
 */ 
BuyerRoute.get('/', async (req,res) => {
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
 *              type: String
 *             
 *      responses:
 *          200:
 *              description: success fullydisplaying all data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '../App.js/#/components/schemas/buyer_mod'
 * 
 */ 

// getting one record
BuyerRoute.get('/:id', getById, async(req,res) => {
    res.json(res.buyer)  
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
 *                      $ref: '../App.js/#/components/schemas/buyer_mod'
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */ 

// creating one record
BuyerRoute.post('/newUser', async (req,res) => {
    
   
    const buyer = new Buyer({
        Buyer_name: req.body.Buyer_name,
        Buyer_Delivery_Address: req.body.Buyer_Delivery_Address,
        Buyer_Phone: req.body.Buyer_Phone,
        Buyer_Cart: req.body.Buyer_Cart
    })

    const newBuyer = await buyer.save()
    res.json(newBuyer);
    
})

/**
 * @swagger
 * /buyer/{id}:
 *  patch:
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
 *                      $ref: '../App.js/#/components/schemas/buyer_mod'
 *      responses:
 *          200:
 *              description: updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '../App.js/#/components/schemas/buyer_mod'
 *              
 */

// updating one record
BuyerRoute.patch('/:id',getById, async (req,res) => {
    if(req.body.Buyer_name != null){
        res.buyer.Buyer_name = req.body.Buyer_name
    }
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
 *                      $ref: '../App.js/#/components/schemas/buyer_mod'
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

    res.buyer = Buyer
    next()
}

module.exports = {BuyerRoute}
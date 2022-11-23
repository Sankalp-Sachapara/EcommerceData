const express = require('express')
const SellerRoute = express.Router()
const Seller = require('../models/Seller_model')


/**
 * @swagger
 *  components:
 *      schemas:
 *          Seller:
 *             type: object
 *             properties:
 *                 Seller_name:
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
 *                 Seller_Products:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                             Product_ID:
 *                                 type: number
 *                             Product_Name:
 *                                 type: string
 *                             Product_Quantity:
 *                                 type: number
 *                             Product_Price:
 *                                 type: number 
 */


// getting all record

/**
 * @swagger
 * /seller:
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
 *                              $ref: '#/components/schemas/Seller'
 * 
 */ 
SellerRoute.get('/', async (req,res) => {
    const seller =  await Seller.find()
    res.json(seller)
    
})

/**
 * @swagger
 * /seller/{id}:
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
 *                              $ref: '#/components/schemas/Seller'
 * 
 */ 

// getting one record
SellerRoute.get('/:id', getById, async(req,res) => {
    res.json(res.seller)  
})

/**
 * @swagger
 * /seller/newUser:
 *  post:
 *      summary: add the data in database  
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
        Seller_Address: req.body.Seller_Address,
        Seller_Phone: req.body.Seller_Phone,
        Seller_Products: req.body.Seller_Products
    })

    const newSeller = await seller.save()
    res.json(newSeller);
    
})

/**
 * @swagger
 * /seller/{id}:
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
 *                      $ref: '#/components/schemas/Seller'
 *      responses:
 *          200:
 *              description: updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Seller'
 *              
 */

// updating one record
SellerRoute.put('/:id',getById, async (req,res) => {
    res.seller.Seller_name = req.body.Seller_name
    res.seller.Seller_Address = req.body.Seller_Address,
    res.seller.Seller_Phone = req.body.Seller_Phone,
    res.seller.Seller_Products =req.body.Seller_Products
    
    // other patch to be added
    const updatedSeller = await res.seller.save()
    res.json(updatedSeller)
    
})

/**
 * @swagger
 * /seller/{id}:
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
 *                      $ref: '#/components/schemas/Seller'
 *      responses:
 *          200:
 *              description: deleted Successfully
 *              
 *              
 */

// deleting one record
SellerRoute.delete('/:id',getById, async (req,res) => {
    res.seller.remove()
    res.json("Deleted seller")
    
})

async function getById(req,res,next){
    let seller = await Seller.findById(req.params.id)
    if(seller == null){
        return res.json({message : 'no seller'})
    }

    res.seller = seller
    next()
}

module.exports = {SellerRoute}
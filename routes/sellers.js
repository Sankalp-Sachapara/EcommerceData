require("dotenv").config()
const express = require('express')
const SellerRoute = express.Router()
const Seller = require('../models/Seller_model')
const Products = require('../models/Products_model')
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
 *          Product:
 *             type: object
 *             properties:
 *                 Product_name:
 *                     type: string
 *                 Product_description:
 *                     type: string
 *                 Product_price:
 *                     type: number
 *                 Product_rating:
 *                     type: number
 *                 Quantity_available:
 *                     type: number
 *            
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
SellerRoute.get('/',verifyToken,async (req,res) => {
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
SellerRoute.get('/:id', verifyToken, async(req,res) => {
    let seller = await Seller.findById(req.params.id)
    if(seller == null){
        return res.json({message : 'no seller'})
    }
    res.json(seller)  
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
        Seller_Email: req.body.Seller_Email,
        Seller_Password: await bcrypt.hash(req.body.Seller_Password,10),
        Seller_Address: req.body.Seller_Address,
        Seller_Phone: req.body.Seller_Phone,
        Seller_Products: req.body.Seller_Products
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
    
    const product = new Products({
        Product_name: req.body.Product_name,
        Product_category: req.body.Product_category,
        Product_description: req.body.Product_description,
        Product_price: req.body.Product_price,
        Quantity_available: req.body.Quantity_available,
        
    })

    const newProduct = await product.save()
    res.json(newProduct);
    
})




async function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")[1];        
        jwt.verify(bearer,process.env.SELLER_ACCESS_TOKEN_SECRET,(err,authdata) =>{
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


module.exports = {SellerRoute}
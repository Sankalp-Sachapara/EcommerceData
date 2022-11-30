require("dotenv").config()
const express = require('express')
const BuyerRoute = express.Router()
const bcrypt = require ('bcrypt')
const Buyer = require('../models/Buyer_model')
const Orders = require('../models/orders_model')
const Products = require('../models/Products_model')

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
 *          Order_id:
 *             type: object
 *             properties:
 *                 ID:
 *                     type: string 
 *          Product_id:
 *             type: object
 *             properties:
 *                 Product_ID:
 *                     type: string
 *                 Product_quantity:
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
 *                             product_seller_id:
 *                                 type: string
 *                             
 *                 total_price:
 *                     type: number
 *                 order_status:
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
    if (buyer.Buyer_Cart.findIndex( e =>
        {
            if(e.Product_ID == req.body.Product_ID)
            {
                e.Product_quantity += req.body.Product_quantity
            }
            
        }
        )){}
        else{
            buyer.Buyer_Cart.push(req.body)
        }
    
    const updatedbuyer = await buyer.save()
    res.json(updatedbuyer); 
    
})

/**
 * @swagger
 * /buyer/Orders:
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
 *                              $ref: '#/components/schemas/Orders'             
 */ 

BuyerRoute.get("/Orders", verifyToken,async(req,res) =>{
    let buyer = await Buyer.findById(res.current_user.buyer_user._id) // gets current users info
    let e = await Promise.all(buyer.Buyer_Cart.map(prodObj => Products.findById(prodObj.Product_ID))) // finds products info from the products in the buyers cart and place the found products in an array
    let d_product = e.map(prod => {
        const indi_price_total = buyer.Buyer_Cart.find(obj => obj.Product_ID == prod._id)       //restructuring the found products 
        product_quantity = indi_price_total.Product_quantity
        if (product_quantity <= prod.Quantity_available){
        product_price_quantity = indi_price_total.Product_quantity * prod.Product_price
        prod.Quantity_available -= product_quantity
            return {
                product_id : prod._id,
                product_name: prod.Product_name,
                product_quantity_bought: product_quantity,
                product_total_price: product_price_quantity,
                product_seller_id: prod.seller_Id,
                
            }
        }
        else{
            return "Not sufficent quantity available at the moment"
        }
    })
    
    total_productprice = d_product.reduce((a,b) => a + b['product_total_price'],0)  // total sum of all prices in restructered products array

    
    let order = new Orders({            // new order for Orders 
        buyer_ID:buyer._id,
        product_list: d_product,
        total_price: total_productprice,
        order_status: "Approved",
        
    })
    const neworder = await order.save()
    res.json(neworder)
    
})
/**
 * @swagger
 * /buyer/OrderStatus:
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
 *                              $ref: '#/components/schemas/Orders' 
*/
BuyerRoute.get("/OrderStatus", verifyToken,async(req,res) => {
    let order = await Orders.find({buyer_ID : res.current_user.buyer_user._id})
    res.json(order)
})

/**
 * @swagger
 * /buyer/cancelOrders:
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

BuyerRoute.post("/cancelOrders", verifyToken,async(req,res) => {
    let order = await Orders.findOneAndUpdate({_id: req.body.ID},{order_status: "Cancelled"},{new: true})
    res.json(order)
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
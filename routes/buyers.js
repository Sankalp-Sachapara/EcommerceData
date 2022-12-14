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
 *          Rating:
 *             type: object
 *             properties:
 *                 ID:
 *                     type: string
 *                 Product_ID:
 *                     type: string
 *                 Product_rating:
 *                     $ref: '#/components/parameters/limitParam'
 *                     
 *                 Product_description:
 *                     type: string 
 *          Product_S:
 *             type: object
 *             properties:
 *                 Product_name:
 *                     type: string
 *                 Product_description:
 *                     type: string
 *                 Product_price:
 *                     type: number
 *                 Quantity_available:
 *                     type: number
 *                 Product_rating:
 *                     $ref: '#/components/schemas/Rating' 
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
 *      parameters: 
 *        limitParam:       
 *           name: limit
 *           in: query
 *           description: Range of rating.
 *           required: false
 *           schema:
 *             type: integer
 *             format: int32
 *             minimum: 1
 *             maximum: 5              
 */


/**
 * @swagger
 * /buyer/newUser:
 *  post:
 *      summary: Registering new user   
 *      description: Add the new user data in database
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
 *      summary: Add the product to current buyers cart  
 *      description: Add the product data in current buyer's cart 
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
    let product = await Products.findById(req.body.Product_ID)
    if (product !== null){
    
    if(buyer.Buyer_Cart.length == 0){
        buyer.Buyer_Cart.push(req.body)
        const updatedbuyer = await buyer.save()
        res.json(updatedbuyer);
    }
    else{
    if (buyer.Buyer_Cart.findIndex( e =>
        {
            if(e.Product_ID == req.body.Product_ID)
            {
                e.Product_quantity += req.body.Product_quantity
            }
            else{
                buyer.Buyer_Cart.push(req.body)
                
            }
            
        }
        )){
            const updatedbuyer = await buyer.save()
            res.json(updatedbuyer); }
    else{
        res.json({result: "Incorrect Product Id PLease enter correct ID"})

    }
        
} 
}
else{
    res.json({result:" product not found"})
}
    
    
})

/**
 * @swagger
 * /buyer/Orders:
 *  get:
 *      summary: To place order  
 *      description: To place order call it and the current buyer cart will place its order
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
 *      summary: To know the status of the order placed  
 *      description: To know the status of the order placed
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
 * /buyer/ratingProduct:
 *  post:
 *      summary: for Rating the delivered product 
 *      description: for Rating the delivered product  
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Rating'
 *                      
 *      responses:
 *          200:
 *              description: Added Successfully
 *              
 */

BuyerRoute.post("/ratingProduct",verifyToken,async(req,res) => {
    let check_order = await Orders.findById(req.body.ID)
    let product = await Products.findById(req.body.Product_ID)
    
    if(check_order.order_status == "Delivered"){
        if (product != null || product != undefined){
            let B = req.body
            product.Product_rating.push(B)
            let updateproduct = await product.save()
            res.json(updateproduct)
        }
        else{
            res.json({result: "enter the correct product id"})
        }
        
    }
    else if(check_order.order_status == "Approved" || check_order.order_status == "Dispatched"){
        res.json({result: "Order has been not been delivered yet "})
    }
    else if(check_order.order_status == "Cancelled"){
        res.json({result: "Order Was Cancelled so cant rate the product "})
    }
    else{
        res.json({result: "Wrong id's entered, try again "})
    }
    

})

/**
 * @swagger
 * /buyer/cancelOrders:
 *  post:
 *      summary: To cancel a order  
 *      description: To cancel a order 
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
    let check_order = await Orders.findById(req.body.ID)
    if (check_order.order_status == "Approved" || check_order.order_status == "Dispatched"){
        let order = await Orders.findOneAndUpdate({_id: req.body.ID},{order_status: "Cancelled"},{new: true})
        res.json(order)
    }
    else if(check_order.order_status == "Delivered"){
        res.json({result: "Order has been Delivered cannot cancel now"})
    }

})

/**
 * @swagger
 * /buyer/searchProducts/{Product_name}:
 *  get:
 *      summary: For Searching a product  
 *      description: For Searching a product from product collection
 *      parameters:
 *          - name: Product_name
 *            in: query
 *            description: fetch with Product name
 *            schema:
 *              type: string
 *          - name: page
 *            in: query
 *            description: page number you want to go
 *            schema:
 *              type: number 
 *                      
 *      responses:
 *          200:
 *              description: updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product_S'
 *              
 */

BuyerRoute.get("/searchProducts/:Product_name", verifyToken,async(req,res) =>{
    let search = req.query.Product_name
    let page = 1
    if(req.query.page){
        page = req.query.page
    }
    let limit = 3
    
    let products = await Products.find({Product_name:{$regex:'.*' + search + '.*',$options:'i'}})
    .limit(limit * 1)
    .skip((page -1) * limit)
    .exec();

    let count = await Products.find({Product_name:{$regex:'.*' + search + '.*',$options:'i'}})
    .countDocuments();
    let totalPages = Math.ceil(count/limit)
    let currentPage = page
    res.json({
        SearchResult:products,
        TotalPages: totalPages,
        currentPage: parseInt(currentPage)})
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
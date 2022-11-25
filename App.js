require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const swaggerjsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const bodyParser = require("body-parser");
const bcrypt = require ('bcrypt')
const jwt = require("jsonwebtoken")

const {BuyerRoute} = require('./routes/buyers.js');
const Buyer = require('./models/Buyer_model')
const {SellerRoute} = require('./routes/sellers.js')
const Seller = require('./models/Seller_model')
const Products = require('./models/Products_model')

const port = process.env.PORT



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/Ecommerce')

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("connected to database"))

app.use(express.json())


const options ={
    definition:{
        openapi:'3.0.0',
        info:{
            title:"Ecommerce practice project",
            version:"1.0.0"
        },
       
        servers:[
            {
               url: 'http://localhost:3000/'
            }
        
            ],
        
        
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security:[
            {
                bearerAuth: [],
            },
        ],
        },  
        apis:['App.js','./routes/*.js'] //'./routes/*.js'
    }


const swaggerSpec = swaggerjsdocs(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))


app.use('/buyer',BuyerRoute)
app.use('/seller',SellerRoute)

var refreshTokens = []


/**
 * @swagger
 * /:
 *  get:
 *      summary: The get method 
 *      description: the description of get
 *      responses:
 *          200:
 *              description: To test get method
 */
app.get('/', async (req,res) => {
    res.send("welcome to site")
})


/**
 * @swagger
 *  components:
 *      schemas:
 *          Login:
 *             type: object
 *             properties:
 *                 Email:
 *                     type: string
 *                 Password:
 *                      type: string
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


/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login for Users  
 *      description: Login for User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: Login Successfully
 *              
 */ 


app.post('/login', async (req,res) => {
    
    let seller_user = await Seller.findOne({Seller_Email :req.body.Email})
    let buyer_user = await Buyer.findOne({Buyer_Email :req.body.Email})
    
    
    if (await bcrypt.compare(req.body.Password, buyer_user.Buyer_Password)) 
        {   
            
            
            //access token for buyer
            const accessToken = jwt.sign({buyer_user}, process.env.BUYER_ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
            //refresh token for seller
            const refreshToken = jwt.sign({buyer_user}, process.env.BUYER_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
            refreshTokens.push(refreshToken)
            res.json ({accessToken: accessToken, refreshToken: refreshToken})
        } 
    else if (await bcrypt.compare(req.body.Password, seller_user.Seller_Password)) {

            
            //access token for seller
            const accessToken = jwt.sign({seller_user}, process.env.SELLER_ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
            //refresh token for buyer
            const refreshToken = jwt.sign({seller_user}, process.env.SELLER_REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
            refreshTokens.push(refreshToken)
            res.json ({accessToken: accessToken, refreshToken: refreshToken})
        
            }
    else if (buyer_user == null || seller_user == null) 
    {
        
        res.status(404).send ("User does not exist!")
    }
    else {
    res.status(401).send("Password Incorrect!")
    }
   
})

/**
 * @swagger
 * /products:
 *  get:
 *      summary: The get product data from database  
 *      description: displaying all  product data from database
 *      responses:
 *          200:
 *              description: successfully  displaying all product data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 * 
 */ 

app.get('/products', async (req,res) => { 
    const p =  await Products.find()
    res.json(p)
    
})

/**
 * @swagger
 * /logout:
 *  delete:
 *      summary: logout  
 *      description: delete refresh token and the current user data
 *      responses:
 *          200:
 *              description: successfully  deleted
 *              
 * 
 */ 

app.delete("/logout", (req,res)=>{
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
    currentuser = currentuser.filter( (c) => c != req.body)
    res.status(204).send("Logged out!")
    })




app.listen(port, () => console.log("Server Started"))

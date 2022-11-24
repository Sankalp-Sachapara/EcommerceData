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

const port = process.env.PORT



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/Ecommerce')

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("connected to database"))

app.use(express.json())

// const buyer_schema =  m2s(Buyer)

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


function generateAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
    return accessToken
}
// refreshTokens
var refreshTokens = []
function generateRefreshToken(user) 
{
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}





app.use('/buyer',BuyerRoute)
app.use('/seller',SellerRoute)

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
app.get('/', (req,res) => {
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
    let buyer_user = await Buyer.findOne({Buyer_Email :req.body.Email})
    if (buyer_user == null) res.status(404).send ("User does not exist!")
    if (await bcrypt.compare(req.body.Password, buyer_user.Buyer_Password)) 
        {
            //access token
            const accessToken = generateAccessToken ({buyer_user})
            //refresh token
            const refreshToken = generateRefreshToken ({buyer_user})
            res.json ({accessToken: accessToken, refreshToken: refreshToken})
        } 
    else {
    res.status(401).send("Password Incorrect!")
    }
   
})
app.delete("/logout", (req,res)=>{
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!")
    })




app.listen(port, () => console.log("Server Started"))




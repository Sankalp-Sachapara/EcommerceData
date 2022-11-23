const express = require("express");
const mongoose = require("mongoose");
const swaggerjsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const bodyParser = require("body-parser");
const {BuyerRoute} = require('./routes/buyers.js');
const {SellerRoute} = require('./routes/sellers.js')





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
        
        },
        apis:['App.js','./routes/*.js'] //'./routes/*.js'
    }


const swaggerSpec = swaggerjsdocs(options)


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
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


app.listen(3000, () => console.log("Server Started"))




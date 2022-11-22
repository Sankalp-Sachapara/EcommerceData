// type: object
//  *                          properties:
//  *                              address_line: 
//  *                                  type: String 
//  *                              City: 
//  *                                  type:String 
//  *                              Postal_Code: 
//  *                                  type:Number 
//  *                              Country: 
//  *                                  type: String



// Buyer_Delivery_Address:
//  *                       $ref: '#/components/schema/address' 
//  *          address:
//  *              type: object
//  *              properties:
//  *                  address_line: 
//  *                      type: String 
//  *                  City: 
//  *                      type:String 
//  *                  Postal_Code: 
//  *                      type:Number 
//  *                  Country: 
//  *                      type: String
//  *                 



/************************************************************ */
//  *          Buyer:
//  *              type: object
//  *              properties:
//  *                  id:
//  *                      type: string
//  *                  Buyer_name:
//  *                      type: string
//  *                  Buyer_Delivery_Address:
//  *                      type: object
//  *                      properties:
//  *                          address_line:
//  *                              type: string 
//  *                          City:
//  *                              type: string
//  *                          Postal_Code:
//  *                              type: number
//  *                          Country:
//  *                              type: string
//  *                  Buyer_Cart:
//  *                      type: object
//  *                      properties:
//  *                          Product_ID:
//  *                              type: string
//  *                          Product_Name:
//  *                              type: string
//  *                          Product_Quantity:
//  *                              type: number
//  *                          Product_Price:
//  *                              type: number 


// "Buyer_name":{ "Sankalp"},
//     "Buyer_Delivery_Address":{
//       "address_line": "B/2429" , 
//       "City": "Bhavnagar", 
//       "Postal_Code": 364002, 
//       "Country":India,
//     },
//     "Buyer_Phone": {4561237891},
//     "Buyer_Cart": { 
//       "Product_ID": 1, 
//       "Product_Name": "Apple" , 
//       "Product_quantity": 5, 
//       "Product_Price": 10, 
//     },



//******************************************************************************/

// const buyer_schema =  m2s(Buyer)
// const options ={
//     definition:{
//         openapi:'3.0.0',
//         info:{
//             title:"Ecommerce practice project",
//             version:"1.0.0"
//         },
//         components: {   
//             schemas: buyer_schema},
//         servers:[
//             {
//                url: 'http://localhost:3000/'
//             }],
//         },
//         apis:['./App.js']
//     }


// const swaggerSpec = swaggerjsdocs(options)


// app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))


// console.log(buyer_schema.properties)

// /**
//  * @swagger
//  * /:
//  *  get:
//  *      summary: The get method 
//  *      description: the description of get
//  *      responses:
//  *          200:
//  *              description: To test get method
//  */
//  app.get('/', (req,res) => {
//     res.send("welcome to site")
// })

// // // getting all record
// // /**
// //  * @swagger
// //  *  components:
// //  *      schemas: buyer_schema
// //  *       
// //  */

// /**
//  * @swagger
//  * /buyer:
//  *  get:
//  *      summary: The get data from database  
//  *      description: displaying all data from database
//  *      responses:
//  *          200:
//  *              description: success fullydisplaying all data from database
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          items:
//  *                              $ref: '#/components/schemas'
//  * 
//  */ 
// app.get('/buyer', async (req,res) => {
//     const buyers =  await Buyer.find()
//     res.json(buyers)
//     // res.send("welcome")
// })

// /**
//  * @swagger
//  * /buyer/{id}:
//  *  get:
//  *      summary: The get specific id data from database  
//  *      description: displaying all data from database
//  *      parameters:
//  *          - in: path
//  *            name: id
//  *            required: true
//  *            description: fetch with id 
//  *            schema:
//  *              type: String
//  *             
//  *      responses:
//  *          200:
//  *              description: success fullydisplaying all data from database
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          items:
//  *                              $ref: '#/components/schemas'
//  * 
//  */ 

// // getting one record
// app.get('/buyer/:id', getById, async(req,res) => {
//     res.json(res.buyer)  
// })

// /**
//  * @swagger
//  * /buyer/newUser:
//  *  post:
//  *      summary:add the data in database  
//  *      description: Add the data in database
//  *      requestBody:
//  *          required: true
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      $ref: '#/components/schemas'
//  *      responses:
//  *          200:
//  *              description: Added Successfully
//  *              
//  */ 

// // creating one record
// app.post('/buyer/newUser', async (req,res) => {
    
   
//     const buyer = new Buyer({
//         Buyer_name: req.body.Buyer_name,
//         Buyer_Delivery_Address: req.body.Buyer_Delivery_Address,
//         Buyer_Phone: req.body.Buyer_Phone,
//         Buyer_Cart: req.body.Buyer_Cart
//     })

//     const newBuyer = await buyer.save()
//     res.json(newBuyer);
    
// })

// /**
//  * @swagger
//  * /buyer/{id}:
//  *  patch:
//  *      summary: Update the data in database  
//  *      description: Add the data in database
//  *      parameters:
//  *          - in: path
//  *            name: id
//  *            required: true
//  *            description: fetch with id number
//  *            schema:
//  *              type: string
//  *      requestBody:
//  *          required: true
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      $ref: '#/components/schemas'
//  *      responses:
//  *          200:
//  *              description: updated Successfully
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          items:
//  *                              $ref: '#/components/schemas'
//  *              
//  */

// // updating one record
// app.patch('/buyer/:id',getById, async (req,res) => {
//     if(req.body.Buyer_name != null){
//         res.buyer.Buyer_name = req.body.Buyer_name
//     }
//     // other patch to be added
//     const updatedbuyer = await res.buyer.save()
//     res.json(updatedbuyer)
    
// })

// /**
//  * @swagger
//  * /buyer/{id}:
//  *  delete:
//  *      summary: delete the data in database  
//  *      description: foe deleting the data in database
//  *      parameters:
//  *          - in: path
//  *            name: id
//  *            required: true
//  *            description: fetch with id number
//  *            schema:
//  *              type: string
//  *      requestBody:
//  *          required: true
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      $ref: '#/components/schemas'
//  *      responses:
//  *          200:
//  *              description: deleted Successfully
//  *              
//  *              
//  */

// // deleting one record
// app.delete('/buyer/:id',getById, async (req,res) => {
//     res.buyer.remove()
//     res.json("Deleted buyer")
    
// })

// async function getById(req,res,next){
//     let buyer = await Buyer.findById(req.params.id)
//     if(buyer == null){
//         return res.json({message : 'no buyer'})
//     }

//     res.buyer = Buyer
//     next()
// }

/********************************************************** */
// /**
//  * @swagger
//  * /:
//  *  get:
//  *      summary: The get method 
//  *      description: the description of get
//  *      responses:
//  *          200:
//  *              description: To test get method
//  */
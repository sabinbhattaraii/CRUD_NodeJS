const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const Product = require('./models/productModel');
require("dotenv").config();

// config for json and parser

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.set("view engine","ejs");

//routes
app.get('/',(req,res) => {
    res.send(`Hello CRUD NodeJS API`)
})

app.get('/blog',(req,res) => {
    res.send(`Hello CRUD NodeJS blog.This is my test`)
})

// get all product

app.get('/products/', async(req,res) => {
    try{
        const products = await Product.find({})
        res.status(200).json(products);
    }catch(error){
        console.log(error.message)
        res.status(500).json({message : error.message})
    }
})

// get specific product by id

app.get('/products/:id',async(req,res) =>{
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

// save product

app.post('/products',async(req,res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product);
    }catch(error){
        console.log(error.message)
        res.status(500).json({message : error.message})
    }
})

// update to edit product

app.put('/products/:id',async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        // we cannot find any product in database
        if(!product){
            return res.status(404).json({message:`The given ${id} does not exist in database`})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

// delete a product

app.delete('/product/:id',async(req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).json({message:`The given ${id} object is not found in database`})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


// upload images to file system using multer


const ejs = require('ejs');

const multer = require('multer'); // added multer to required


const storage = multer.diskStorage({
    destination : ( req , file , cb) => {
        cb(null,'Images')
    },
    filename : (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname));
    }
})          //created storage object

const upload = multer({ storage : storage }) // created middleware

// get the uplodaded file 

app.get("/upload",(req,res) => {
    res.render("upload");
})

//upload a single file 

app.post("/upload",upload.single("image"),(req,res) => {
    res.send("Image Uploaded");
})

// upload file to mongodb
const uploadRouter = require('./uploadRoute.js')

app.use("api/file",uploadRouter)

//mongoose 

mongoose.set("strictQuery",false)
mongoose.
connect('mongodb+srv://sabin123:sabin123@cluster0.6xnhi3r.mongodb.net/Crud_NodeApi?retryWrites=true&w=majority')
.then(()=> {
    console.log('Connected to MongoDb!!!!!')
    app.listen(3000,()=>{
        console.log(`CRUD NodeJs API app is running on port 3000`)
    })
}).catch((error) => {
    console.log(error)
})
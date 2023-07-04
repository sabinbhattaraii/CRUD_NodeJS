const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const Product = require('./models/productModel');

 app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

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
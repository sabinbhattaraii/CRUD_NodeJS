const Router = require('express')
const Product = require('../models/productModel.js')

const searchRouter = Router()

searchRouter.get("/product", async (req,res) => {
    const { keyword } = req.query;
    try {
        const product = await Product.find({
            $or : [
                { name : { $regex: keyword, $options: 'i'}},
            ],
        })
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = searchRouter
const Router = require('express')
const upload = require('./middleware/upload.js')
const createFile = require('./createfile.js')

const uploadRouter = Router();

uploadRouter
.post("/single",upload.upload.single("file"), createFile)


module.exports = uploadRouter 

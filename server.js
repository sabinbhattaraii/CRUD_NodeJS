const express = require('express');
const app = express();


//routes
app.get('/',(req,res) => {
    res.send(`Hello CRUD NodeJS API`)
})


app.listen(3000,()=>{
    console.log(`CRUD NodeJs API app is running on port 3000`)
})
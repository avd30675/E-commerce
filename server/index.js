const express=require("express");
const mongoose=require("mongoose");
const cors=require('cors');
const fileupload=require('express-fileupload');
const cookiesParser=require('cookie-parser');
const Userrouter=require('./routes/UserRouter');
const categoryRouter=require('./routes/categoryRouter');
const uploadsRouter=require('./routes/uploads');
const dotenv = require('dotenv');
const productRouter=require('./routes/Product')


dotenv.config();


const app=express()
const port = process.env.port||9000;

app.use(express.json({limit: '50mb'}))
app.use(cookiesParser())
app.use(cors())
app.use(fileupload({
    useTempFiles:true
}))




//user router
app.use('/user',Userrouter)
app.use('/api',categoryRouter);
app.use('/api',uploadsRouter);
app.use('/api',productRouter);  

//connect mangoDB
mongoose.connect(process.env.MONGODB_URI,
    {useNewUrlParser:true,useUnifiedTopology:true})
    .then(cilent =>{
        app.listen(port , function (){console.log('The server is running on ', port)} );
    })
.catch(err =>{throw err});
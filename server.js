
//code without auth and jwt 
const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Customers = require('./Schema');
const app = express();
const port = 5003;



async function run(){
    try{
        await mongoose.connect("mongodb://localhost:27017/customerDB");
        console.log("connected to Mongodb");
    }
    catch(error){
        console.log(error);
    }
}
    run();

app.use(express.json());
app.use(cors());

// POST endpoint for user login
app.post('/api/login', async(req,res)=>{
    try{
let {user_name, password}= req.body;

const users = await Customers.findOne({ user_name: user_name, password: password });

    if(users){
        res.send('you are logged in')//  frontend me data var se access hoga ye message
    }
    else{
        res.status(401).send('user information wrong') 
    
    }
}
    catch(error){
        console.log(error);
    }
   
 })
 // POST endpoint for adding a new customer (registration)
app.post('/api/register', async(req,res)=>{
    try{
    const { user_name, age, password, email } = req.body;

    // Check if the user already exists
    const existingUsers = await Customers.findOne({user_name:user_name})
    if(existingUsers){
         res.status(409).send("User already exists");
    }
    else {
        let newUser = new Customers({user_name, age, password, email })//Creating and saving a new customer
        await newUser.save(); 
        res.send("Customer added successfully");
    }
    }
    catch(error){
        console.log(error)
    }

   
})


        
   app.listen(port, ()=>{
    console.log("srver is running on",port)
   }) 

   

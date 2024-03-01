// connection
const mongoose = require('mongoose')
const connect = mongoose.connect("mongodb://localhost:27017/logindata")

connect.then(()=>{
    console.log('Database connected successfuly')
}).catch(()=>{
    console.log('cannot connect to database')
})

// schema
const LoginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

// models

const collection = new mongoose.model('users' , LoginSchema)

module.exports = collection
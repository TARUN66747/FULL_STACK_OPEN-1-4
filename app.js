const {MONGODB_URI,PORT} = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')


const app = express()

mongoose.connect(MONGODB_URI,{family:4})
.then(() =>{
    console.log('connected to mongoDB')
})
.catch((error)=>{
    console.log('error connecting to MongoDB:',error.message)
})

app.use(express.json())

app.use('/api/blogs',blogRouter)

module.exports = app 
const {MONGODB_URI,PORT} = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {TokenExtractor,userExtractor} = require('./utils/middleware')



const app = express()

mongoose.connect(MONGODB_URI,{family:4})
.then(() =>{
    console.log('connected to mongoDB')
})
.catch((error)=>{
    console.log('error connecting to MongoDB:',error.message)
})

app.use(express.json())
app.use(TokenExtractor)

app.use('/api/blogs',userExtractor,blogRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)


const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } 
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  else if (error.name === 'TokenExpiredError'){
    return response.status(401).json({error: 'token expired'})
  }

  next(error)
}
app.use(errorHandler)

module.exports = app 
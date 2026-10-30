const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {SECRET} =  require('./config')
const TokenExtractor = (request,response,next)=>{
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')){
        request.token = authorization.replace('Bearer ','')

    }else{
        request.token = null
    }
    next()
}

const userExtractor = async (request,response,next)=>{
    if(request.token){
        const decodedToken = jwt.verify(request.token,SECRET)
        if(decodedToken.id){
            request.user = await User.findById(decodedToken.id)
        }
    }
    next()
}

module.exports = {TokenExtractor,userExtractor}
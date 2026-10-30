const app = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer')){
        return authorization.replace('Bearer ','')
    }
    return null
}
 
app.get('/',(request,response)=>{
    Blog.find({}).populate('user').then(blogs =>{
        response.json(blogs)
    })
})
app.get('/:id',(request,response)=>{
    const id = request.params.id
    Blog.findById(id).populate('user').then(blog => {
        if(blog){
            response.json(blog)
        }else{
            response.status(404).end()
        }
    })
})

app.post('/', async (request, response, next) => {
    const body = request.body
   
    try {
         const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error : 'token invalid'})
    }


        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(400).json({ error: 'no user found to assign blog to' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id 
        })

        const savedBlog = await blog.save()

      
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})


app.delete('/:id',async (request,response)=>{
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

app.put('/:id', async (request,response)=>{
   const body = request.body

   
  const updatedBlog = await Blog.findById(request.params.id)
  if(!updatedBlog){
    response.status(404).end()
  }
  updatedBlog.likes = body.likes

  const savedBlog = await updatedBlog.save()
  response.json(savedBlog)
})

module.exports = app
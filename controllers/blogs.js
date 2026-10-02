const app = require('express').Router()
const Blog = require('../models/blog')

app.get('/',(request,response)=>{
    Blog.find({}).then(blogs =>{
        response.json(blogs)
    })
})
app.get('/:id',(request,response)=>{
    const id = request.params.id
    Blog.findById(id).then(blog => {
        if(blog){
            response.json(blog)
        }else{
            response.status(404).end()
        }
    })
})

app.post('/',(request,response)=>{
    const blog = new Blog(request.body)
    blog.save().then(result =>{
        response.status(201).json(result)
    })
})

app.delete('/:id',async (request,response)=>{
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

module.exports = app
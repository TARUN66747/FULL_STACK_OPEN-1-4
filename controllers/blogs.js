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

module.exports = app
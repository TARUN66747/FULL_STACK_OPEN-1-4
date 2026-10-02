const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "First Blog",
        author: 'Vansh',
       url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Vansh',
    url: 'http://example.com/2',
    likes: 10
  }
]

const nonExistingId = async () =>{
    const blog = new Blog({title: 'willremovethissoon', url: 'http://temp.com'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}
const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb
}
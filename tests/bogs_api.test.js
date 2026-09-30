const {test,after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const  assert  = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)
const initialBlogs = [
  {
    title: 'First blog',
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
beforeEach(async ()=>{
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs to be loaded', async ()=>{
     await api
     .get('/api/blogs')
     .expect(200)
     .expect('Content-Type', /application\/json/)
})

test('blogs have an id property instead fo _id',async ()=>{
    const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]

  assert.notStrictEqual(firstBlog.id, undefined)
})


after(async () =>{
    await mongoose.connection.close()
})
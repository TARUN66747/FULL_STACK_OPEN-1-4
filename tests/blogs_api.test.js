const {test,after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert  = require('node:assert')
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
test('blogs post feature check', async ()=>{
    const obj = {
    title: 'third blog',
    author: 'hiraChand',
    url: 'http://example.com/3',
    likes: 15
  }
    
  await api
  .post('/api/blogs')
  .send(obj)
  .expect(201)
  .expect('Content-Type', /application\/json/)
    
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length,initialBlogs.length+1)
     

  console.log("ACTUAL BLOGS IN DB:", response.body)
  const titles = response.body.map(r => r.title)
  assert(titles.includes('third blog'))
})

test('blog without likes default to 0 likes',async ()=>{
  const newBlog ={
    title: 'third blog',
    author: 'hiraChand',
    url: 'http://example.com/3',
    
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes,0)
})
test('blog with missing title or url', async () =>{
   const newBlog ={
    title: 'fourth blog',
    author: 'hiraChand',
    likes:5
  }
    api.post('/api/blogs').send(newBlog).expect(400)
  
 const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
  
})

after(async () =>{
    await mongoose.connection.close()
})
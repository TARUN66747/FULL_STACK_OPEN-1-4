const {test,after, beforeEach,describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert  = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { log } = require('node:console')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { request } = require('node:http')

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
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
 const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
  
})
describe('deletion of blog',() =>{
  test('succeds with status code 204 if it is valid id', async ()=>{
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()

    assert(blogsAtEnd.length,blogsAtStart.length-1)

  })
})

describe('update of a blog', ()=>{
  test('testing the likes update',async ()=>{
    const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
  likes: 82
}
   await api
   .put(`/api/blogs/${blogToUpdate.id}`)
   .send(updatedData)
   .expect(200)


   const respondedData = await Blog.findById(blogToUpdate.id)

   console.log(respondedData)

   assert.strictEqual(respondedData.likes,updatedData.likes)
  })

  
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if password is too short', async ()=>{
  const userAtStart = await helper.usersInDb()
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'ab'
  }

  const result = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect('Content-Type', /application\/json/)
 assert(result.body.error.includes('password length should be greater than 3 or atleast 3 characters long'))
 const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, userAtStart.length)
})
test('creation fails with proper statuscode and message ', async ()=>{
  const userAtStart = await helper.usersInDb()
  const newUser = {
      username: 'te', 
      name: 'Test User',
      password: 'validpassword'
    }
    const result = await api.post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username must be at least 3 characters long'))
    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length,userAtEnd.length)


})
})


after(async () =>{
    await mongoose.connection.close()
})


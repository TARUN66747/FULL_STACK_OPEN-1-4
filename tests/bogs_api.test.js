const {test,after} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { assert } = require('node:assert')

const api = supertest(app)

test('blogs to be loaded', async ()=>{
     await api
     .get('/api/blogs')
     .expect(200)
     .expect('Content-Type', /application\/json/)
})

after(async () =>{
    await mongoose.connection.close()
})
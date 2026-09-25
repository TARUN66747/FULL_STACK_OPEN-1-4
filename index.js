const {MONGODB_URI,PORT} = require('./utils/config')
const app = require('./app')


app.listen(PORT,()=>{
    console.log(`server runnig on port ${PORT}`)
})
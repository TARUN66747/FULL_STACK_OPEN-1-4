const _ = require('lodash');

const dummy = (blogs) =>{
    return 1

}

const totalLikes = (blogs) =>{
    const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)  
}

const favoriteBlog = (blogs) => {
 if(blogs.length === 0) return null

 return blogs.reduce((maxblog,currentBlog) =>{
    return currentBlog.likes > maxblog.likes ? currentBlog : maxblog
 })
    
}
const mostBlogs = (blogs) =>{
    if(blogs.length === 0) return null

    const counts = _.countBy(blogs,'author')

    const topAuthor = _.maxBy(Object.keys(counts),(author)=>counts[author])

    return{
        author : topAuthor,
        blogs : counts[topAuthor]
    }
}
module.exports = {dummy,totalLikes,favoriteBlog,mostBlogs}
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
module.exports = {dummy,totalLikes,favoriteBlog}
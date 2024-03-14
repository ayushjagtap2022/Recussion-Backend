const express = require('express');
const { delete_Blogs, save_Blog, blogDetails, like, findLikeLength, wishlistBlog, findWishlistedBlog, searchBlogs, findBlog } = require('../controllers/Blogs')
const { users_Mid, restrictTO, uploadFile } = require('../Middleware/userMiddleware');
const Router = express.Router();
Router.use(express.json());
const upload = uploadFile()
Router.get('/blogdetails', users_Mid, blogDetails)
Router.post('/saveblogs', users_Mid, restrictTO(["ADMIN", "MODERATOR"]), upload.single('file'), save_Blog);
Router.delete('/deleteblogs/:_id', users_Mid, restrictTO(["ADMIN", "MODERATOR"]), delete_Blogs)
Router.get('/like/:_id', users_Mid, like)
Router.get('/likelength/:_id', users_Mid, findLikeLength)
Router.get('/wishlist/:_id', users_Mid, wishlistBlog)
Router.get('/wishlistedblogs', users_Mid, findWishlistedBlog)
Router.get('/searchblogs/:_blogs', searchBlogs)
Router.get('/findblog/:_blog', findBlog)
module.exports = Router;

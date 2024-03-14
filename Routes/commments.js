const express = require('express');
const { addComment, displayComments, deleteComments } = require('../controllers/comments');
const { users_Mid } = require('../Middleware/userMiddleware');
const Router = express.Router();
Router.use(express.json())
Router.post('/comment/:_id', users_Mid, addComment)
Router.post('/deletecomment/:_id', users_Mid, deleteComments)
Router.get('/comment/:_id', users_Mid, displayComments)
module.exports = Router;

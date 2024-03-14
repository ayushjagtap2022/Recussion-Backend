const express = require('express')
const Router = express.Router()
const { Create_User, getall_Users, login_User, delete_User, updateBy_Admin } = require('../controllers/user')
const { users_Mid, validate_Registration, checkEmail, restrictTO } = require('../Middleware/userMiddleware');
Router.use(express.json())
Router.get('/getallusers', users_Mid, restrictTO(['ADMIN']), getall_Users)
Router.post('/createuser', validate_Registration, checkEmail, Create_User);
Router.post('/loginuser', login_User)
Router.delete('/deleteuser/:_id', users_Mid, restrictTO(['ADMIN']), delete_User)
Router.put('/updatebyadmin/:_id', users_Mid, restrictTO(['ADMIN']), validate_Registration, updateBy_Admin);
module.exports = Router;
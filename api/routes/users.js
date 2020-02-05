const express = require('express');
const routes = express.Router();

//Import Controller
const userController = require( '../controllers/user' );

//User Signup
routes.post('/signup/', userController.user_signup);

//User Signin
routes.post('/signin/', userController.user_signin);

// Get All Users
routes.get('/', userController.get_all_users);

//User Delete
routes.delete('/delete/:userId', userController.user_delete);

module.exports = routes;
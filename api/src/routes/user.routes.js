const express = require('express');
const usersController = require('../controllers/user.controllers.js').methods;

const router = express.Router();

router.get('/users', usersController.getUserDetails);

router.post('/register', usersController.insertUser);

router.post('/login', usersController.logIn);

//router.post('/logout', usersController.logOut);

module.exports = router;
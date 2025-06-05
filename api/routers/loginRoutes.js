const express = require('express');
const router = express.Router();
// const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController');

router.post('/subscribe', userController.subscribe)
router.post('/login', userController.login)

module.exports = router;

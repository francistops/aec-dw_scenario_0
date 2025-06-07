const express = require('express');
const router = express.Router();
exports.router = router;
// const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController');

router.post('/subscribe', userController.subscribe)
router.post('/login', userController.login)

router.delete('/delete-account', userController.deleteAccount)

module.exports = router;

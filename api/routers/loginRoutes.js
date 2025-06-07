const express = require('express');
const router = express.Router();
exports.router = router;

const authGuard = require('../middlewares/authGuard');
const userController = require('../controllers/userController');


router.post('/subscribe', userController.subscribe)
router.post('/login', userController.login)

router.post('/logout', authGuard.validateToken, userController.logout)
router.delete('/delete-account', authGuard.validateToken, userController.deleteAccount)

module.exports = router;

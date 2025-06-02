const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.getLogin);
router.post('/', loginController.sendLogin);
router.post('/debug', loginController.debugLogin);
// router.post('/debug/:id', loginController.debugDataLogin);

module.exports = router;

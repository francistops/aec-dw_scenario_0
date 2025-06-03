import { Router } from 'express';
import {
    subscribe,
    login,
    logout,
    deleteAccount
} from '../controllers/authController.js';

import { validateToken } from '../middlewares/authGuard.js';

const router = Router();

router.post('/subscribe', subscribe);
router.post('/login', login);

router.use(validateToken);

router.post('/logout', logout);
router.delete('/delete-accout', deleteAccount);

export default router;

// const router = express.Router();
// const authController = require('../controllers/authController');


// router.get('/', authController.getauth);
// router.post('/', authController.sendauth);
// router.post('/debug', authController.debugauth);
// router.post('/debug/:id', authController.debugDataauth);

// module.exports = router;

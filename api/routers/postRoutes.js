const express = require('express');
const router = express.Router();
const authGuard = require('../middlewares/authGuard');
const postController = require('../controllers/postController');



router.get('/:id', postController.getPostById);
router.post('/next', postController.getNextPosts);


router.get('/', authGuard.validateToken, postController.getAllPosts);
router.post('/', authGuard.validateToken, postController.createPost);
router.post('/:id', authGuard.validateToken, postController.updatePost);
router.post('/:id/publish', authGuard.validateToken, postController.publishPost);
router.delete('/:id', authGuard.validateToken, postController.deletePost);
module.exports = router;
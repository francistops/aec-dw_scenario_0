const express = require('express');
const router = express.Router();
const authGuard = require('../middlewares/authGuard');
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', authGuard.validateToken, postController.createPost);
router.post('/:id', authGuard.validateToken, postController.updatePost);
router.post('/:id/publish', authGuard.validateToken, postController.publishPost);
router.delete('/:id', authGuard.validateToken, postController.deletePost);
// J'ai mis le authguard ici pour pouvoir accéder comme guest aux post, il était dans server.js avant. Pour les users c'est correct vu que tu veux absoluement qu'un user soit connecté pour trouver les autres users
module.exports = router;
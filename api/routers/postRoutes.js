const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.post('/:id', postController.updatePost);
router.post('/:id/publish', postController.publishPost);
router.delete('/:id', postController.deletePost);

module.exports = router;
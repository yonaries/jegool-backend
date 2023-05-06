import express from 'express';
import PostController from './post.controller';

const router = express.Router();

router.post('/', PostController.createPost);
router.delete('/:id', PostController.deletePost);
router.put('/:id', PostController.updatePost);

export default router;
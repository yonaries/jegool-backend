import express from 'express';
import PostController from './post.controller';

const router = express.Router();

router.post('/', PostController.createPost);
router.delete('/:id', PostController.deletePost);

export default router;
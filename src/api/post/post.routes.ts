import express from "express";
import PostController from "./post.controller";

const router = express.Router();

router.post("/", PostController.createPost);
router.delete("/:id", PostController.deletePost);
router.put("/:id", PostController.updatePost);
router.get("/:id", PostController.getPostById);
router.get("/", PostController.getAllPosts);
router.get("/?pageId=:pageId", PostController.getPostsByPageId);
router.get("/filter", PostController.getPostsFilter);

export default router;

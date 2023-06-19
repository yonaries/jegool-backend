import express from "express";
import PostController from "./post.controller";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = express.Router();

router.post("/",verifyToken, PostController.createPost);
router.delete("/:id", verifyToken, PostController.deletePost);
router.put("/:id", verifyToken, PostController.updatePost);
router.get("/:id", verifyToken, PostController.getPostById);
router.get("/", verifyToken, PostController.getAllPosts);
router.get("/?pageId=:pageId", verifyToken, PostController.getPostsByPageId);
router.get("/filter", verifyToken, PostController.getPostsFilter);

export default router;

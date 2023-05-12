import express from "express";
import PageController from "./page.controller";

const router = express.Router();

router.post("/", PageController.createPage);
router.put("/:id", PageController.updatePage);
router.delete("/:id", PageController.deletePage);
router.get("/:id", PageController.getPageById);
router.get("/", PageController.getAllPages);
router.get("/:id/memberships", PageController.getPageMemberShips);
router.get("/:id/posts", PageController.getPagePosts);
router.get("/:id/projects", PageController.getPageProjects);

export default router;

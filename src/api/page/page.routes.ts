import express from "express";
import PageController from "./page.controller";

const router = express.Router();

router.post("/", PageController.createPage);
router.put("/:id", PageController.updatePage);
router.delete("/:id", PageController.deletePage);
router.get("/:id", PageController.getPageById);
router.get("/", PageController.getAllPages);

export default router;

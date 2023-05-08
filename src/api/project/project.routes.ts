import express from "express";
import ProjectController from "./project.controller";

const router = express.Router();

router.post("/", ProjectController.createProject);
router.get("/:id", ProjectController.getProjectById);
router.get("/", ProjectController.getProjects);

export default router;

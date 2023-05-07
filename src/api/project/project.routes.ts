import express from "express";
import ProjectController from "./project.controller";

const router = express.Router();

router.post("/", ProjectController.createProject);
router.get("/:id", ProjectController.getProjectById);
router.get("/?pageId=pageId", ProjectController.getProjectsByPageId);
router.get(
	"/?membershipId=membershipId",
	ProjectController.getProjectsByMembershipId,
);

export default router;

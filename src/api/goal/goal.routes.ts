import express from "express";
import GoalController from "./goal.controller";

const router = express.Router();

router.post("/", GoalController.createGoal);
router.get("/:id", GoalController.getGoalById);

export default router;

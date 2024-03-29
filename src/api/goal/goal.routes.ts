import express from "express";
import GoalController from "./goal.controller";

const router = express.Router();

router.post("/", GoalController.createGoal);
router.get("/:id", GoalController.getGoalById);
router.delete("/:id", GoalController.deleteGoalById);
router.put("/:id", GoalController.updateGoalById);

export default router;

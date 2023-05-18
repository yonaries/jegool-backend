import express from "express";
import GoalController from "./goal.controller";

const router = express.Router();

router.post("/", GoalController.createGoal);

export default router;

import { Request, Response } from "express";
import GoalServices from "./services";
import { PrismaError } from "../../errors/prisma.error";
import { validateGoal } from "./goal.validate";
import PageServices from "../page/services";

export default class GoalController {
 static async createGoal(req: Request, res: Response) {
  const goal = req.body;
  try {
   const { error } = validateGoal(goal);
   if (error) return res.status(400).json({ error: error.message });

   const page = await PageServices.getPageById(goal.pageId);
   if (!page) return res.status(404).json({ error: "Page not found" });

   const createdGoal = await GoalServices.createGoal(goal);
   return res.status(201).json({ goal: createdGoal });
  } catch (error) {
   PrismaError(res, Error);
  }
 }

 static async getGoalById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) return res.status(400).json({ error: "Goal Id Is Required" });

  try {
   const goal = await GoalServices.getGoalById(id);
   if (!goal) return res.status(404).json({ error: "Goal not found" });

   return res.status(200).json({ goal });
  } catch (error) {
   return PrismaError(res, Error);
  }
 }

 static async deleteGoalById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) return res.status(400).json({ error: "Goal Id Is Required" });

  try {
   const goal = await GoalServices.deleteGoalById(id);
   if (!goal) return res.status(404).json({ error: "Goal not found" });

   return res.status(200).json({ goal });
  } catch (error) {
   return PrismaError(res, Error);
  }
 }
}

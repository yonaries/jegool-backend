import { Goal, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGoal = async (goal: Goal) => {
 try {
  const createdGoal = await prisma.goal.create({
   data: goal,
   select: {
    id: true,
   },
  });

  return createdGoal;
 } catch (error) {
  throw error;
 }
};

export const getGoalById = async (id: string): Promise<Goal | null> => {
 try {
  const goal = await prisma.goal.findUnique({
   where: {
    id: id,
   },
  });

  return goal;
 } catch (error) {
  throw error;
 }
};

export const deleteGoalById = async (id: string): Promise<Goal> => {
 try {
  const goal = await prisma.goal.delete({
   where: {
    id: id,
   },
  });

  return goal;
 } catch (error) {
  throw error;
 }
};

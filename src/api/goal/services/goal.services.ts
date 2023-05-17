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

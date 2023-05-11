import { Benefit, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBenefit = async (benefit: Benefit) => {
 try {
  const createdBenefit = await prisma.benefit.create({
   data: benefit,
  });
  return createdBenefit;
 } catch (error) {
  throw error;
 }
};

export const getBenefitById = async (id: string) => {
 try {
  const benefit = prisma.benefit.findUniqueOrThrow({
   where: {
    id: id,
   },
   select: {
    id: true,
   },
  });
  return benefit;
 } catch (error) {
  throw error;
 }
};

export const getBenefits = async () => {
 try {
  const benefits = await prisma.benefit.findMany();
  return benefits;
 } catch (error) {
  throw error;
 }
};

export const getBenefitsByQuery = async (id: string) => {
 try {
  const benefits = await prisma.benefit.findMany({
   where: {
    membershipId: id,
   },
  });
  return benefits;
 } catch (error) {
  throw error;
 }
};

export const updateBenefit = async (id: string, benefit: Benefit) => {
 try {
  const updatedBenefit = await prisma.benefit.update({
   where: {
    id: id,
   },
   data: benefit,
   select: {
    id: true,
   },
  });
  return updatedBenefit;
 } catch (error) {
  throw error;
 }
};

export const deleteBenefit = async (id: string) => {
 try {
  const deletedBenefit = await prisma.benefit.delete({
   where: {
    id: id,
   },
   select: {
    id: true,
   },
  });
  return deletedBenefit;
 } catch (error) {
  throw error;
 }
};

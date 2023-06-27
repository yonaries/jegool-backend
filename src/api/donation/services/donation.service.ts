import { Donation, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDonation = async (data: Donation) => {
 try {
  const donation = await prisma.donation.create({
   data: data,
  });
  return donation;
 } catch (error) {
  throw error;
 }
};

export const updateDonation = async (id: string, data: Donation) => {
 try {
  const donation = await prisma.donation.update({
   where: {
    id,
   },
   data: data,
  });
  return donation;
 } catch (error) {
  throw error;
 }
};

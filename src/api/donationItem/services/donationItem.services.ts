import { PrismaClient } from "@prisma/client";
import { DonationItem } from "@prisma/client";

const prisma = new PrismaClient();

export const createDonationItem = async (donationItem: DonationItem): Promise<{ id: string }> => {
 try {
  const createdDonationItem = await prisma.donationItem.create({
   data: donationItem,
   select: {
    id: true,
   },
  });
  return createdDonationItem;
 } catch (error) {
  throw error;
 }
};

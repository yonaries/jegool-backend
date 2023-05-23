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

export const getDonationItemById = async (donationItemId: string): Promise<DonationItem | null> => {
 try {
  const donationItem = await prisma.donationItem.findUniqueOrThrow({
   where: {
    id: donationItemId,
   },
  });
  return donationItem;
 } catch (error) {
  throw error;
 }
};

export const deleteDonationItemById = async (donationItemId: string): Promise<DonationItem> => {
 try {
  const deletedDonationItem = await prisma.donationItem.delete({
   where: {
    id: donationItemId,
   },
  });
  return deletedDonationItem;
 } catch (error) {
  throw error;
 }
};

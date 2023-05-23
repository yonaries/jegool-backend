import { PrismaError } from "../../errors/prisma.error";
import { Request, Response } from "express";
import { validateDonationItem } from "./donationItem.validate";
import DonationItemServices from "./services";

export default class DonationItemController {
 static async createDonationItem(req: Request, res: Response) {
  const donationItem = req.body;
  try {
   const { error, value } = validateDonationItem(donationItem);
   if (error) return res.status(400).json({ error: error.message });

   const newDonationItem = await DonationItemServices.createDonationItem(value);
   return res.status(201).json({ donationItem: newDonationItem });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}

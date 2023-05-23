import { PrismaError } from "../../errors/prisma.error";
import { Request, Response } from "express";
import { validateDonationItem, validateDonationItemOnUpdate } from "./donationItem.validate";
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

 static async getDonationItemById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) return res.status(400).json({ error: "DonationItem Id Is Required" });

  try {
   const donationItem = await DonationItemServices.getDonationItemById(id);
   if (!donationItem) return res.status(404).json({ error: "DonationItem not found" });
   return res.status(200).json({ donationItem });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async deleteDonationItemById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) return res.status(400).json({ error: "DonationItem Id Is Required" });

  try {
   const deletedDonationItem = await DonationItemServices.deleteDonationItemById(id);
   if (!deletedDonationItem) return res.status(404).json({ error: "DonationItem not found" });
   return res.status(200).json({ donationItem: deletedDonationItem });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getDonationItems(req: Request, res: Response) {
  try {
   const donationItems = await DonationItemServices.getDonationItems();
   if (!donationItems) return res.status(404).json({ error: "DonationItems not found" });

   return res.status(200).json({ donationItems });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async updateDonationItemById(req: Request, res: Response) {
  const { id } = req.params;
  const donationItem = req.body;

  if (id.length === 0 || !id) return res.status(400).json({ error: "DonationItem Id Is Required" });

  try {
   const { error, value } = validateDonationItemOnUpdate(donationItem);
   if (error) return res.status(400).json({ error: error.message });

   const updatedDonationItem = await DonationItemServices.updateDonationItemById(id, value);

   return res.status(200).json({ donationItem: updatedDonationItem });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}

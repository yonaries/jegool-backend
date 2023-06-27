import { PrismaError } from "@/errors/prisma.error";
import DonationService from "./services";
import { Response, Request } from "express";
import ChapaController from "../chapa/chapa.controller";
import TransactionServices from "../transaction/services";
import { TransactionWithOnlyNeededFields } from "../transaction/transaction.type";
import BankAccountServices from "../bankAccount/services";
import { validateDonation } from "./donarion.validate";
import DonationItemServices from "../donationItem/services";
import { InitializeOptions } from "chapa-nodejs";

export default class DonationController {
 static async createDonation(req: Request, res: Response) {
  try {
   const donation = req.body;

   const { error } = validateDonation(donation);
   if (error) return res.status(400).json({ error: error.message });

   const bank = await BankAccountServices.getBankAccountByPageId(donation.pageId);
   if (!bank) return res.status(404).json({ error: "Page has no bank account" });

   const item = await DonationItemServices.getDonationItemById(donation.itemId);
   if (!item) return res.status(404).json({ error: "Donation item not found" });

   const price = item.price * donation.quantity;
   const transactionData: TransactionWithOnlyNeededFields = {
    amount: price,
    currency: "ETB",
    payee: donation.pageId,
    payer: donation.donorName,
    remark: `Donation fee`,
    provider: "chapa",
    status: "PENDING",
   };
   const transaction = await TransactionServices.createTransaction({
    ...transactionData,
   });
   if (!transaction) return res.status(500).json({ error: "Failed to create transaction" });
   if (transaction) donation.transactionId = transaction.reference;

   const newDonation = await DonationService.createDonation(donation);
   if (!newDonation) return res.status(500).json({ error: "Failed to create donation" });

   const payload = {
    reference: transaction?.reference!,
    type: "DONATION",
    id: transaction.reference,
    amount: price.toString(),
    email: donation.donorEmail,
    first_name: "your first name",
    last_name: "your last name",
    subaccount: bank.id,
   };
   console.log("donation controller =>", payload);

   const checkout_url = await ChapaController.initialize({
    reference: transaction.reference,
    type: "DONATION",
    id: transaction.reference,
    amount: price,
    email: donation.donorEmail,
    first_name: "your first name",
    last_name: "your last name",
    subaccount: bank.id,
   });

   return res.redirect(checkout_url);
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}

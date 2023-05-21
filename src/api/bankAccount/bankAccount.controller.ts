import { Request, Response } from "express";
import BankAccountServices from "./services";
import { PrismaError } from "../../errors/prisma.error";
import { validateBankAccount, validateBankAccountUpdate } from "./bankAccount.validate";

export default class BankAccountController {
 static async createBankAccount(req: Request, res: Response) {
  const bankAccount = req.body;
  try {
   const { error } = validateBankAccount(bankAccount);
   if (error) return res.status(400).json({ error: error.message });
   const createdBankAccount = await BankAccountServices.createBankAccount(bankAccount);

   return res.status(201).json({ bankAccount: createdBankAccount });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getBankAccountByPageId(req: Request, res: Response) {
  const pageId = req.params.pageId;

  if (pageId.length === 0 || !pageId) return res.status(400).json({ error: "Page Id Is Required" });
  try {
   const bankAccount = await BankAccountServices.getBankAccountByPageId(pageId);
   if (!bankAccount) return res.status(404).json({ error: "Bank Account Not Found" });

   return res.status(200).json({ bankAccount });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async deleteBankAccountById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) return res.status(400).json({ error: "Bank Account Id Is Required" });
  try {
   const bankAccount = await BankAccountServices.deleteBankAccountById(id);

   return res.status(200).json({ bankAccount });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async updateBankAccountById(req: Request, res: Response) {
  const { id } = req.params;
  const bankAccount = req.body;

  if (id.length === 0 || !id) return res.status(400).json({ error: "Bank Account Id Is Required" });

  try {
   const { error } = validateBankAccountUpdate(bankAccount);
   if (error) return res.status(400).json({ error: error.message });

   const updatedBankAccount = await BankAccountServices.updateBankAccountById(id, bankAccount);

   return res.status(200).json({ bankAccount: updatedBankAccount });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}

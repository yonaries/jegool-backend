import { Request, Response } from "express";
import BankAccountServices from "./services";
import { PrismaError } from "../../errors/prisma.error";
import { validateBankAccount } from "./bankAccount.validate";

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
}

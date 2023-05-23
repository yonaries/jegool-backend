import { Request, Response } from "express";
import BankAccountServices from "./services";
import { PrismaError } from "../../errors/prisma.error";
import { validateBankAccount, validateBankAccountUpdate } from "./bankAccount.validate";
import ChapaController from "../chapa/chapa.controller";
import { CreateSubaccountOptions, SplitType } from "chapa-nodejs";
import PageServices from "../page/services";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import ChapaError from "@/errors/chapa.error";
import UserService from "../user/services";

export default class BankAccountController {
 static async createBankAccount(req: Request, res: Response) {
  const bankAccount = req.body;
  try {
   const { error } = validateBankAccount(bankAccount);
   if (error) return res.status(400).json({ error: error.message });

   const page = await PageServices.getPageById(bankAccount.pageId);
   const user = await UserService.getUserById(page?.ownerId!);
   const fullName: string[] = bankAccount.accountName.split(" ");

   if (user?.firstName != fullName[0] || user?.lastName != fullName[1]) {
    return res
     .status(400)
     .json({ error: { message: "Account name must be matched with the user first and last name" } });
   }

   // todo: if sub-account is already exist chapa will thrown an error
   // in order to handle that add status property at bankAccount where status can be DEFAULT, HIDDEN or ALTER
   const bankAccountExists = await BankAccountServices.getBankAccountByPageId(bankAccount.pageId);
   if (bankAccountExists) return res.status(400).json({ error: { message: "Bank Account Already Exists" } });

   const bank: CreateSubaccountOptions = {
    business_name: page?.name!,
    account_name: bankAccount.accountName,
    bank_code: bankAccount.bankCode,
    account_number: bankAccount.accountNo,
    split_value: 0.08,
    split_type: SplitType.PERCENTAGE,
   };

   const id = await ChapaController.createSubaccount(bank);
   bankAccount.id = id;

   delete bankAccount.accountName;
   const createdBankAccount = await BankAccountServices.createBankAccount(bankAccount);

   return res.status(201).json({ bankAccount: createdBankAccount });
  } catch (error) {
   if (error instanceof ChapaError) return res.status(parseInt(error.status)).json({ error });
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

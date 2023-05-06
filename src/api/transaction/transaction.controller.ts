import { Request, Response } from "express";
import TransactionServices from "./services";
import { validateTransaction } from "./transaction.validate";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";

export default class TransactionController {
  static async createTransaction(req: Request, res: Response) {
    const transaction = req.body;

    try {
      const { error } = validateTransaction(transaction);
      if (error) return res.status(400).json({ error: error.message });

      const newTransaction = await TransactionServices.createTransaction(
        transaction
      );
      res.status(201).json(newTransaction);
    } catch (error) {
      handlePrismaError(res, error, "Transaction");
    }
  }
}

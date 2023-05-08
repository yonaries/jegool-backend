import { Request, Response } from "express";
import TransactionServices from "./services";
import { validateTransaction } from "./transaction.validate";
import { PrismaError } from "../../errors/prisma.error";

export default class TransactionController {
	static async createTransaction(req: Request, res: Response) {
		const transaction = req.body;

		try {
			const { error } = validateTransaction(transaction);
			if (error) return res.status(400).json({ error: error.message });

			const newTransaction = await TransactionServices.createTransaction(
				transaction,
			);
			res.status(201).json(newTransaction);
		} catch (error) {
			PrismaError(res, error);
		}
	}

	static async getTransactionByReference(req: Request, res: Response) {
		const { reference } = req.params;

		if (reference.length === 0 || !reference)
			return res
				.status(400)
				.json({ error: "Transaction Reference Is Required" });

		try {
			const transaction = await TransactionServices.getTransactionByReference(
				reference,
			);
			if (!transaction)
				return res.status(404).json({ error: "Transaction not found" });
			return res.status(200).json({ transaction });
		} catch (error) {
			PrismaError(res, error);
		}
	}

	static async updateTransactionByReference(req: Request, res: Response) {
		const { reference } = req.params;
		const transaction = req.body;

		if (reference.length === 0 || !reference)
			return res
				.status(400)
				.json({ error: "Transaction Reference Is Required" });

		try {
			const { error } = validateTransaction(transaction);
			if (error) return res.status(400).json({ error: error.message });

			const updatedTransaction =
				await TransactionServices.updateTransactionByReference(
					reference,
					transaction,
				);

			return res.status(200).json({ transaction: updatedTransaction });
		} catch (error) {
			PrismaError(res, error);
		}
	}
}

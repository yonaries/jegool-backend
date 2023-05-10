import { Transaction } from "@prisma/client";

export type TransactionWithOnlyNeededFields = Omit<Transaction, "createdAt" | "reference">;

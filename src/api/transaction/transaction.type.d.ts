import { Transaction } from "@prisma/client";

export type TransactionWithoutOnlyNeededFields = Omit<
  Transaction,
  "createdAt" | "reference"
>;

import { Transaction, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransaction = async (
  transaction: Transaction
): Promise<{
  reference: string;
} | null> => {
  try {
    const createdTransaction = await prisma.transaction.create({
      data: transaction,
      select: {
        reference: true,
      },
    });

    return createdTransaction;
  } catch (error) {
    throw error;
  }
};

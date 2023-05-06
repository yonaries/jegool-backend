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

export const getTransactionByReference = async (
  reference: string
): Promise<Transaction | null> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        reference,
      },
    });

    return transaction;
  } catch (error) {
    throw error;
  }
};

export const updateTransactionByReference = async (
  reference: string,
  transaction: Transaction
): Promise<Transaction | null> => {
  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        reference,
      },
      data: transaction,
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};

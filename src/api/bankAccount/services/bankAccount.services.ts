import { BankAccount, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBankAccount = async (data: BankAccount): Promise<{ id: string }> => {
 try {
  const bankAccount = await prisma.bankAccount.create({
   data,
   select: {
    id: true,
   },
  });

  return bankAccount;
 } catch (error) {
  throw error;
 }
};

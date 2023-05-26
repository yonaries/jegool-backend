import { BankAccount, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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

export const getBankAccountByPageId = async (pageId: string): Promise<BankAccount> => {
 const bankAccount = await prisma.bankAccount.findFirst({
  where: {
   pageId: pageId,
  },
  include: {
   page: {
    select: {
     name: true,
     owner: {
      select: {
       id: true,
       firstName: true,
       lastName: true,
      },
     },
    },
   },
  },
 });

 return bankAccount!;
};

export const deleteBankAccountById = async (id: string): Promise<BankAccount> => {
 try {
  const bankAccount = await prisma.bankAccount.delete({
   where: {
    id: id,
   },
  });
  return bankAccount;
 } catch (error) {
  throw error;
 }
};

export const updateBankAccountById = async (id: string, data: BankAccount): Promise<BankAccount> => {
 try {
  const bankAccount = await prisma.bankAccount.update({
   data,
   where: {
    id: id,
   },
  });
  return bankAccount;
 } catch (error) {
  throw error;
 }
};

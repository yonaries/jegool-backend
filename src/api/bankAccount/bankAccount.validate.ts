import { BankAccount } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const bankAccountSchema = Joi.object({
 bankCode: Joi.string().required(),
 bankName: Joi.string().required(),
 accountName: Joi.string().required(),
 accountNo: Joi.string().required(),
 pageId: Joi.string().required(),
});

const bankAccountUpdateSchema = Joi.object({
 id: Joi.string().required(),
 bankCode: Joi.string().required(),
 bankName: Joi.string().required(),
 accountNo: Joi.string().required(),
});

export const validateBankAccountUpdate = (bankAccount: BankAccount): { error: ValidationError; value: BankAccount } => {
 return bankAccountUpdateSchema.validate(bankAccount, options) as unknown as {
  error: ValidationError;
  value: BankAccount;
 };
};

export const validateBankAccount = (bankAccount: BankAccount): { error: ValidationError; value: BankAccount } => {
 return bankAccountSchema.validate(bankAccount, options) as unknown as {
  error: ValidationError;
  value: BankAccount;
 };
};

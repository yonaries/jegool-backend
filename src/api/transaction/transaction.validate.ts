import { Transaction, TransactionStatus } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const transactionSchema = Joi.object({
 reference: Joi.string().required(),
 provider: Joi.string().required(),
 payer: Joi.string().required(),
 payee: Joi.string().required(),
 amount: Joi.number().required(),
 currency: Joi.string().required(),
 remark: Joi.string().required(),
 status: Joi.string().valid(TransactionStatus.FAILED, TransactionStatus.PENDING, TransactionStatus.SUCCESS).required(),
});

export const validateTransaction = (transaction: Transaction): { error: ValidationError; value: Transaction } => {
 return transactionSchema.validate(transaction, options) as unknown as {
  error: ValidationError;
  value: Transaction;
 };
};

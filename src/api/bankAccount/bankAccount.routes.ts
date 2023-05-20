import express from "express";
import BankAccountController from "./bankAccount.controller";

const router = express.Router();

router.post("/", BankAccountController.createBankAccount);
router.get("/:pageId", BankAccountController.getBankAccountByPageId);
router.delete("/:id", BankAccountController.deleteBankAccountById);

export default router;

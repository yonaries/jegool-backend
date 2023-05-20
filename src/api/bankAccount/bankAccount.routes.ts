import express from "express";
import BankAccountController from "./bankAccount.controller";

const router = express.Router();

router.post("/", BankAccountController.createBankAccount);

export default router;
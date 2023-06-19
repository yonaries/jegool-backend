import express from "express";
import BankAccountController from "./bankAccount.controller";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = express.Router();

router.post("/", verifyToken, BankAccountController.createBankAccount);
router.get("/:pageId", verifyToken, BankAccountController.getBankAccountByPageId);
router.delete("/:id", verifyToken, BankAccountController.deleteBankAccountById);
router.put("/:id", verifyToken, BankAccountController.updateBankAccountById);

export default router;

import express from "express";
import TransactionController from "./transaction.controller";

const router = express.Router();

router.post("/", TransactionController.createTransaction);
router.get("/:reference", TransactionController.getTransactionByReference);
router.put("/:reference", TransactionController.updateTransactionByReference);

export default router;
